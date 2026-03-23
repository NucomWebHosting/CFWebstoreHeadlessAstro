import { query } from "../db";
import type { ProductRow, ProductImageRow } from "../types";

type SortOption = "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest" | "popular";

export interface ProductListOptions {
  sort?: SortOption;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  saleOnly?: boolean;
  hotOnly?: boolean;
  newOnly?: boolean;
}

// Maps validated enum values to safe SQL — never interpolate raw user input
function buildOrderBy(sort: SortOption | undefined): string {
  switch (sort) {
    case "price_asc":  return "P.Base_Price ASC";
    case "price_desc": return "P.Base_Price DESC";
    case "name_asc":   return "P.Name ASC";
    case "name_desc":  return "P.Name DESC";
    case "newest":     return "P.DateAdded DESC";
    case "popular":    return "P.Popularity DESC";
    default:           return "P.Priority ASC, P.Name ASC";
  }
}

export async function getProductsByCategory(
  categoryId: number,
  opts: ProductListOptions = {}
): Promise<ProductRow[]> {
  const conditions: string[] = ["PC.Category_ID = @category_id", "P.Display = 1"];
  const params: Record<string, string | number | boolean | null> = { category_id: categoryId };

  if (opts.search) {
    conditions.push("(P.Name LIKE @search OR P.SKU LIKE @search OR P.Short_Desc LIKE @search)");
    params.search = `%${opts.search}%`;
  }
  if (opts.minPrice !== undefined) {
    conditions.push("P.Base_Price >= @min_price");
    params.min_price = opts.minPrice;
  }
  if (opts.maxPrice !== undefined) {
    conditions.push("P.Base_Price <= @max_price");
    params.max_price = opts.maxPrice;
  }
  if (opts.saleOnly)  conditions.push("P.Sale = 1");
  if (opts.hotOnly)   conditions.push("P.Hot = 1");
  if (opts.newOnly)   conditions.push("P.DateAdded >= DATEADD(day, -30, GETDATE())");

  const where = conditions.join(" AND ");
  const orderBy = buildOrderBy(opts.sort);

  return query<ProductRow>(
    `SELECT P.*, img.Sm_image
     FROM Products P
     INNER JOIN Product_Category PC ON P.Product_ID = PC.Product_ID
     OUTER APPLY (
       SELECT TOP 1 Sm_image FROM Product_Images
       WHERE Product_ID = P.Product_ID
       ORDER BY Product_Image_ID ASC
     ) img
     WHERE ${where}
     ORDER BY ${orderBy}`,
    params
  );
}

export async function getProductById(id: number): Promise<ProductRow | null> {
  const rows = await query<ProductRow>(
    "SELECT * FROM Products WHERE Product_ID = @id AND Display = 1",
    { id }
  );
  return rows[0] ?? null;
}

export async function getProductByPermalink(permalink: string): Promise<ProductRow | null> {
  const rows = await query<ProductRow>(
    "SELECT * FROM Products WHERE Permalink = @permalink AND Display = 1",
    { permalink }
  );
  return rows[0] ?? null;
}

export interface FeaturedProductOptions {
  hot?: boolean;
  saleOnly?: boolean;
  newOnly?: boolean;
  maxRows?: number;
  categoryId?: number;
}

// Parse the Homepage.Product_passparam field (comma-separated key=value pairs)
export function parsePassParam(passparam: string | null): FeaturedProductOptions {
  const opts: FeaturedProductOptions = {};
  if (!passparam) return opts;
  for (const pair of passparam.split(",")) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim().toLowerCase();
    const val = pair.slice(eqIdx + 1).trim();
    if (key === "hot" && val === "1")      opts.hot = true;
    if (key === "onsale" && val === "1")   opts.saleOnly = true;
    if (key === "new" && val === "1")      opts.newOnly = true;
    if (key === "maxrows" && !isNaN(Number(val))) opts.maxRows = Number(val);
    if (key === "category_id" && !isNaN(Number(val))) opts.categoryId = Number(val);
  }
  return opts;
}

export async function getFeaturedProducts(opts: FeaturedProductOptions = {}): Promise<ProductRow[]> {
  const conditions = ["P.Display = 1"];
  const params: Record<string, string | number | boolean | null> = {};

  if (opts.hot)      conditions.push("P.Hot = 1");
  if (opts.saleOnly) conditions.push("P.Sale = 1");
  if (opts.newOnly)  conditions.push("P.DateAdded >= DATEADD(day, -30, GETDATE())");
  if (opts.categoryId !== undefined) {
    conditions.push("EXISTS (SELECT 1 FROM Product_Category PC WHERE PC.Product_ID = P.Product_ID AND PC.Category_ID = @category_id)");
    params.category_id = opts.categoryId;
  }

  const limit = opts.maxRows ?? 12;
  const where = conditions.join(" AND ");

  return query<ProductRow>(
    `SELECT TOP ${limit} P.*, img.Sm_image
     FROM Products P
     OUTER APPLY (
       SELECT TOP 1 Sm_image FROM Product_Images
       WHERE Product_ID = P.Product_ID
       ORDER BY Product_Image_ID ASC
     ) img
     WHERE ${where}
     ORDER BY P.Priority ASC, P.Popularity DESC`,
    params
  );
}

export async function getProductImages(productId: number): Promise<ProductImageRow[]> {
  return query<ProductImageRow>(
    "SELECT * FROM Product_Images WHERE Product_ID = @product_id ORDER BY Product_Image_ID ASC",
    { product_id: productId }
  );
}

export async function getRelatedProducts(productId: number): Promise<ProductRow[]> {
  return query<ProductRow>(
    `SELECT TOP 8 P.*, img.Sm_image
     FROM Products P
     INNER JOIN Product_Category PC ON P.Product_ID = PC.Product_ID
     OUTER APPLY (
       SELECT TOP 1 Sm_image FROM Product_Images
       WHERE Product_ID = P.Product_ID
       ORDER BY Product_Image_ID ASC
     ) img
     WHERE PC.Category_ID IN (
       SELECT TOP 1 Category_ID FROM Product_Category WHERE Product_ID = @product_id
     )
     AND P.Product_ID != @product_id
     AND P.Display = 1
     ORDER BY P.Priority ASC, P.Popularity DESC`,
    { product_id: productId }
  );
}
