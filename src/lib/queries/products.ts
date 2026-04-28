import { query } from "../db";
import type { ProductRow, ProductImageRow, ProductContentRow } from "../types";

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
    case "price_asc":  return "P.price ASC";
    case "price_desc": return "P.price DESC";
    case "name_asc":   return "P.name ASC";
    case "name_desc":  return "P.name DESC";
    case "newest":     return "P.date_created DESC";
    case "popular":    return "P.priority DESC";
    default:           return "P.priority ASC, P.name ASC";
  }
}

export async function getProductsByCategory(
  categoryId: number,
  opts: ProductListOptions = {}
): Promise<ProductRow[]> {
  const conditions: string[] = ["PC.category_id = :category_id", "P.display = 1"];
  const params: Record<string, string | number | boolean | null> = { category_id: categoryId };

  if (opts.search) {
    conditions.push("P.name LIKE :search");
    params.search = `%${opts.search}%`;
  }
  if (opts.minPrice !== undefined) {
    conditions.push("P.price >= :min_price");
    params.min_price = opts.minPrice;
  }
  if (opts.maxPrice !== undefined) {
    conditions.push("P.price <= :max_price");
    params.max_price = opts.maxPrice;
  }
  if (opts.saleOnly)  conditions.push("JSON_EXTRACT(pcon.product_data, '$.sale') = 1");
  if (opts.hotOnly)   conditions.push("JSON_EXTRACT(pcon.product_data, '$.hot') = 1");
  if (opts.newOnly)   conditions.push("P.date_created >= DATE_SUB(NOW(), INTERVAL 30 DAY)");

  const where = conditions.join(" AND ");
  const orderBy = buildOrderBy(opts.sort);

  return query<ProductRow>(
    `SELECT P.product_id, P.name, P.price, P.price_wholesale, P.display, P.priority,
            P.account_id AS vendor_id, P.mfg_account_id AS brand_id, P.prodtype_id, P.slug, P.date_created, P.last_updated,
            img.md_image AS sm_image,
            img2.md_image AS sm_image_hover,
            IFNULL(JSON_EXTRACT(pcon.product_data, '$.sale') = 1, 0) AS is_on_sale,
            IFNULL(JSON_EXTRACT(pcon.product_data, '$.hot') = 1, 0)  AS is_hot,
            CAST(JSON_EXTRACT(pcon.product_data, '$.price_retail') AS DECIMAL(10,2)) AS price_retail,
            pcon.short_desc,
            brand.account_name AS brand_name
     FROM product P
     INNER JOIN product_category_product PC ON P.product_id = PC.product_id
     LEFT JOIN product_content pcon ON pcon.product_id = P.product_id
     LEFT JOIN account brand ON brand.account_id = P.mfg_account_id
     LEFT JOIN LATERAL (
       SELECT md_image FROM product_images
       WHERE product_id = P.product_id
       ORDER BY product_image_id ASC
       LIMIT 1
     ) img ON TRUE
     LEFT JOIN LATERAL (
       SELECT md_image FROM product_images
       WHERE product_id = P.product_id
       ORDER BY product_image_id ASC
       LIMIT 1 OFFSET 1
     ) img2 ON TRUE
     WHERE ${where}
     ORDER BY ${orderBy}`,
    params
  );
}

export async function getProductById(id: number): Promise<ProductRow | null> {
  const rows = await query<ProductRow>(
    `SELECT product_id, name, price, price_wholesale, display, priority,
            account_id AS vendor_id, mfg_account_id AS brand_id, prodtype_id, slug, date_created, last_updated
     FROM product WHERE product_id = :id AND display = 1`,
    { id }
  );
  return rows[0] ?? null;
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const rows = await query<ProductRow>(
    `SELECT product_id, name, price, price_wholesale, display, priority,
            account_id AS vendor_id, mfg_account_id AS brand_id, prodtype_id, slug, date_created, last_updated
     FROM product WHERE (slug = :slug OR slug = :slug_trail) AND display = 1`,
    { slug, slug_trail: slug.replace(/\/$/, "") + "/" }
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
  const conditions = ["P.display = 1"];
  const params: Record<string, string | number | boolean | null> = {};

  if (opts.hot)      conditions.push("JSON_EXTRACT(pcon.product_data, '$.hot') = 1");
  if (opts.saleOnly) conditions.push("JSON_EXTRACT(pcon.product_data, '$.sale') = 1");
  if (opts.newOnly)  conditions.push("P.date_created >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
  if (opts.categoryId !== undefined) {
    conditions.push("EXISTS (SELECT 1 FROM product_category_product PC WHERE PC.product_id = P.product_id AND PC.category_id = :category_id)");
    params.category_id = opts.categoryId;
  }

  const limit = opts.maxRows ?? 12;
  const where = conditions.join(" AND ");

  return query<ProductRow>(
    `SELECT P.product_id, P.name, P.price, P.price_wholesale, P.display, P.priority,
            P.account_id AS vendor_id, P.mfg_account_id AS brand_id, P.prodtype_id, P.slug, P.date_created, P.last_updated,
            img.md_image AS sm_image,
            img2.md_image AS sm_image_hover,
            IFNULL(JSON_EXTRACT(pcon.product_data, '$.sale') = 1, 0) AS is_on_sale,
            IFNULL(JSON_EXTRACT(pcon.product_data, '$.hot') = 1, 0)  AS is_hot,
            CAST(JSON_EXTRACT(pcon.product_data, '$.price_retail') AS DECIMAL(10,2)) AS price_retail,
            pcon.short_desc
     FROM product P
     LEFT JOIN product_content pcon ON pcon.product_id = P.product_id
     LEFT JOIN LATERAL (
       SELECT md_image FROM product_images
       WHERE product_id = P.product_id
       ORDER BY product_image_id ASC
       LIMIT 1
     ) img ON TRUE
     LEFT JOIN LATERAL (
       SELECT md_image FROM product_images
       WHERE product_id = P.product_id
       ORDER BY product_image_id ASC
       LIMIT 1 OFFSET 1
     ) img2 ON TRUE
     WHERE ${where}
     ORDER BY P.priority ASC
     LIMIT ${limit}`,
    params
  );
}

export async function getProductImages(productId: number): Promise<ProductImageRow[]> {
  return query<ProductImageRow>(
    "SELECT * FROM product_images WHERE product_id = :product_id ORDER BY product_image_id ASC",
    { product_id: productId }
  );
}

export interface ProductVideoPublic {
  video_id: number;
  product_id: number;
  name: string | null;
  caption: string | null;
  poster: string | null;
  video_external: string | null;
  video_mp4: string | null;
  video_webm: string | null;
  video_width: number;
  video_height: number;
  priority: number;
}

export async function getProductVideos(productId: number): Promise<ProductVideoPublic[]> {
  return query<ProductVideoPublic>(
    `SELECT video_id, product_id, name, caption, poster,
            video_external, video_mp4, video_webm,
            video_width, video_height, priority
     FROM   product_video WHERE product_id = :productId
     ORDER  BY priority ASC`,
    { productId }
  );
}

export async function getProductContent(productId: number): Promise<ProductContentRow | null> {
  const rows = await query<ProductContentRow>(
    "SELECT * FROM product_content WHERE product_id = :product_id",
    { product_id: productId }
  );
  return rows[0] ?? null;
}

export async function getProductMarketing(productId: number): Promise<ProductContentRow | null> {
  const rows = await query<ProductContentRow>(
    "SELECT * FROM product_content WHERE product_id = :product_id",
    { product_id: productId }
  );
  return rows[0] ?? null;
}

export async function getRelatedProducts(productId: number): Promise<ProductRow[]> {
  return query<ProductRow>(
    `SELECT P.product_id, P.name, P.price, P.price_wholesale, P.display, P.priority,
            P.account_id AS vendor_id, P.mfg_account_id AS brand_id, P.prodtype_id, P.slug, P.date_created, P.last_updated,
            img.md_image AS sm_image,
            img2.md_image AS sm_image_hover,
            IFNULL(JSON_EXTRACT(pcon.product_data, '$.sale') = 1, 0) AS is_on_sale,
            IFNULL(JSON_EXTRACT(pcon.product_data, '$.hot') = 1, 0)  AS is_hot,
            CAST(JSON_EXTRACT(pcon.product_data, '$.price_retail') AS DECIMAL(10,2)) AS price_retail,
            pcon.short_desc
     FROM product P
     INNER JOIN product_category_product PC ON P.product_id = PC.product_id
     LEFT JOIN product_content pcon ON pcon.product_id = P.product_id
     LEFT JOIN LATERAL (
       SELECT md_image FROM product_images
       WHERE product_id = P.product_id
       ORDER BY product_image_id ASC
       LIMIT 1
     ) img ON TRUE
     LEFT JOIN LATERAL (
       SELECT md_image FROM product_images
       WHERE product_id = P.product_id
       ORDER BY product_image_id ASC
       LIMIT 1 OFFSET 1
     ) img2 ON TRUE
     WHERE PC.category_id = (
       SELECT category_id FROM product_category_product WHERE product_id = :product_id ORDER BY category_id ASC LIMIT 1
     )
     AND P.product_id != :product_id
     AND P.display = 1
     ORDER BY P.priority ASC
     LIMIT 8`,
    { product_id: productId }
  );
}
