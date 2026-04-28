import { query, insert, execute } from "../db";
import { categoryAutoSlug } from "../slug-util";
import { getBlockTypeBySlug, createBlock, attachBlock } from "./admin-content-blocks";

export interface CategoryListRow {
  category_id: number;
  name: string;
  parent_id: number;
  display: boolean;
  priority: number;
}

export interface SubcatRow {
  category_id: number;
  name: string;
}

export interface CategoryAdminRow {
  category_id: number;
  name: string;
  parent_id: number;
  theme_id: number | null;
  slug: string | null;
  display: boolean;
  priority: number;
  // category_content
  short_desc: string | null;
  long_desc: string | null;
  metadescription: string | null;
  keywords: string | null;
  titletag: string | null;
  menu_config: string | null;
  display_config: string | null;
}

export async function getSubcatsAdmin(parentId: number): Promise<SubcatRow[]> {
  return query<SubcatRow>(
    "SELECT category_id, name FROM product_category WHERE parent_id = :parentId ORDER BY priority ASC, name ASC",
    { parentId }
  );
}

export async function getCategoriesAdmin(opts: {
  search?: string;
  display?: string;
  parentId?: number | null;
  page?: number;
  perPage?: number;
} = {}): Promise<{ rows: CategoryListRow[]; total: number }> {
  const perPage = opts.perPage ?? 50;
  const page    = Math.max(1, opts.page ?? 1);
  const offset  = (page - 1) * perPage;

  const conditions: string[] = [];
  const params: Record<string, string | number | null> = {};

  if (opts.search) {
    conditions.push("C.name LIKE :search");
    params.search = `%${opts.search}%`;
  }
  if (opts.display === "1") conditions.push("C.display = 1");
  else if (opts.display === "0") conditions.push("C.display = 0");
  if (opts.parentId !== null && opts.parentId !== undefined) {
    conditions.push("C.parent_id = :parent_id");
    params.parent_id = opts.parentId;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows, rows] = await Promise.all([
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM product_category C ${where}`,
      params
    ),
    query<CategoryListRow>(
      `SELECT C.category_id, C.name, C.parent_id,
              C.display, C.priority
       FROM product_category C
       ${where}
       ORDER BY C.priority ASC, C.name ASC
       LIMIT ${perPage} OFFSET ${offset}`,
      params
    ),
  ]);

  return { rows, total: countRows[0]?.total ?? 0 };
}

export async function getCategoryByIdAdmin(id: number): Promise<CategoryAdminRow | null> {
  const rows = await query<CategoryAdminRow>(
    `SELECT C.category_id, C.name, C.parent_id, C.theme_id, C.slug,
            C.display, C.priority,
            CC.short_desc, CC.long_desc, CC.metadescription, CC.keywords, CC.titletag,
            CC.menu_config, CC.display_config
     FROM product_category C
     LEFT JOIN product_category_content CC ON CC.category_id = C.category_id
     WHERE C.category_id = :id`,
    { id }
  );
  return rows[0] ?? null;
}

function categoryBaseParams(data: FormData): Record<string, string | number | boolean | null> {
  const s     = (k: string) => (data.get(k) as string | null) ?? null;
  const sval  = (k: string) => { const v = s(k); return v?.trim() || null; };
  const b     = (k: string) => data.get(k) === "on";
  const i     = (k: string, fallback = 0) => parseInt(s(k) ?? "") || fallback;
  const iopt  = (k: string) => { const v = s(k); return v?.trim() ? parseInt(v) || null : null; };
  return {
    name:           s("name") ?? "",
    parent_id:      i("parent_id"),
    theme_id:       iopt("theme_id"),
    display:        b("display"),
    priority:       i("priority", 50),
    _slug:          sval("slug"), // handled separately for slug generation
  };
}

function categoryContentParams(data: FormData): Record<string, string | number | null> {
  const s    = (k: string) => (data.get(k) as string | null)?.trim() || null;
  const st   = (k: string) => (data.get(k) as string | null) || null;
  const b    = (k: string) => (data.get(k) === "on" ? 1 : 0);
  const iopt = (k: string) => { const v = data.get(k) as string; return v?.trim() ? parseInt(v) || null : null; };
  const idef = (k: string, d = 0) => { const v = data.get(k) as string; return v?.trim() ? parseInt(v) ?? d : d; };

  const menu_config = JSON.stringify({
    page_url:         s("mc_page_url"),
    mm_width:         s("mc_mm_width"),
    mm_flyout_width:  s("mc_mm_flyout_width"),
    mm_columns:       idef("mc_mm_columns", 1),
    mm_subcats:       idef("mc_mm_subcats", 1),
    mm_percolumn:     iopt("mc_mm_percolumn"),
    mm_productid:     idef("mc_mm_productid"),
    mm_link:          s("mc_mm_link"),
    mm_sm_image:      s("mc_mm_sm_image"),
    mm_show_sm_image: b("mc_mm_show_sm_image"),
    mm_title:         s("mc_mm_title"),
    mm_short_desc:    s("mc_mm_short_desc"),
    mm_dummy_title:   s("mc_mm_dummy_title"),
    mm_tab:           b("mc_mm_tab"),
  });

  const display_config = JSON.stringify({
    // Category display
    category_display_header:       b("dc_category_display_header"),
    category_display_subcats:      b("dc_category_display_subcats"),
    category_grid_style:           s("dc_category_grid_style"),
    category_all_products:         b("dc_category_all_products"),
    category_random_products:      b("dc_category_random_products"),
    category_image_height:         idef("dc_category_image_height"),
    ccolumns:                      iopt("dc_ccolumns"),

    // Filter display
    filter_display:                idef("dc_filter_display", 1),
    filter_display_options:        b("dc_filter_display_options"),
    filter_display_product_filters: b("dc_filter_display_product_filters"),
    filter_display_price:          b("dc_filter_display_price"),
    filter_display_category:       b("dc_filter_display_category"),
    filter_display_brand:          b("dc_filter_display_brand"),
    filter_style:                  s("dc_filter_style"),
    subcatmenustyle:               s("dc_subcatmenustyle"),

    // Card display
    card_grid_style:               s("dc_card_grid_style"),
    card_style:                    s("dc_card_style"),
    card_display_price:            b("dc_card_display_price"),
    card_display_buybox:           b("dc_card_display_buybox"),
    card_display_sku:              b("dc_card_display_sku"),
    card_display_desc:             b("dc_card_display_desc"),
    card_display_rating:           b("dc_card_display_rating"),
    card_display_icons:            b("dc_card_display_icons"),
    pcolumns:                      iopt("dc_pcolumns"),
    product_image_height:          iopt("dc_product_image_height"),

    // Other
    accesskey:                     iopt("dc_accesskey"),
    ltspcatid:                     idef("dc_ltspcatid"),

    // Images
    sm_image:                      s("dc_sm_image"),
    sm_image_width:                iopt("dc_sm_image_width"),
    sm_image_height:               iopt("dc_sm_image_height"),
    lg_image:                      s("dc_lg_image"),
    lg_image_width:                iopt("dc_lg_image_width"),
    lg_image_height:               iopt("dc_lg_image_height"),
    lg_image_position:             idef("dc_lg_image_position"),
  });

  return {
    short_desc:      st("short_desc"),
    long_desc:       st("long_desc"),
    metadescription: s("metadescription"),
    keywords:        s("keywords"),
    titletag:        s("titletag"),
    menu_config,
    display_config,
  };
}

export async function createCategory(data: FormData): Promise<number> {
  const p  = categoryBaseParams(data);
  const cp = categoryContentParams(data);
  const slug = await categoryAutoSlug(
    p.name as string,
    p.parent_id as number,
    p._slug as string | null
  );
  const { _slug: _, ...baseParams } = p;
  const id = await insert(
    `INSERT INTO product_category
       (name, parent_id, theme_id, slug,
        display, priority)
     VALUES
       (:name, :parent_id, :theme_id, :slug,
        :display, :priority)`,
    { ...baseParams, slug }
  );
  await execute(
    `INSERT INTO product_category_content
       (category_id, short_desc, long_desc, metadescription, keywords, titletag, menu_config, display_config)
     VALUES
       (:id, :short_desc, :long_desc, :metadescription, :keywords, :titletag, :menu_config, :display_config)`,
    { id, ...cp }
  );

  // Auto-attach a default Product Teaser block
  try {
    const teaserType = await getBlockTypeBySlug("product_teaser");
    if (teaserType) {
      const blockId = await createBlock(teaserType.block_type_id, "Products", { style: "grid", columns: 4, max_items: 12 });
      await attachBlock("category", id, blockId, "content");
    }
  } catch (_) { /* non-fatal */ }

  return id;
}

export async function updateCategory(id: number, data: FormData): Promise<void> {
  const p  = categoryBaseParams(data);
  const cp = categoryContentParams(data);
  const slug = await categoryAutoSlug(
    p.name as string,
    p.parent_id as number,
    p._slug as string | null,
    id
  );
  const { _slug: _, ...baseParams } = p;
  await Promise.all([
    execute(
      `UPDATE product_category SET
         name = :name, parent_id = :parent_id,
         theme_id = :theme_id, slug = :slug,
         display = :display, priority = :priority
       WHERE category_id = :id`,
      { ...baseParams, slug, id }
    ),
    execute(
      `INSERT INTO product_category_content
         (category_id, short_desc, long_desc, metadescription, keywords, titletag, menu_config, display_config)
       VALUES
         (:id, :short_desc, :long_desc, :metadescription, :keywords, :titletag, :menu_config, :display_config)
       ON DUPLICATE KEY UPDATE
         short_desc      = :short_desc,
         long_desc       = :long_desc,
         metadescription = :metadescription,
         keywords        = :keywords,
         titletag        = :titletag,
         menu_config     = JSON_MERGE_PATCH(COALESCE(menu_config,    '{}'), :menu_config),
         display_config  = :display_config`,
      { id, ...cp }
    ),
  ]);
}

export async function deleteCategory(id: number): Promise<void> {
  await execute("DELETE FROM product_category WHERE category_id = :id", { id });
}
