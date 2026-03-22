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
    `SELECT P.*
     FROM Products P
     INNER JOIN Product_Category PC ON P.Product_ID = PC.Product_ID
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

export async function getProductImages(productId: number): Promise<ProductImageRow[]> {
  return query<ProductImageRow>(
    "SELECT * FROM Product_Images WHERE Product_ID = @product_id ORDER BY Product_Image_ID ASC",
    { product_id: productId }
  );
}
