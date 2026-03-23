import { query } from "../db";
import type { ProductRow, CategoryRow, PageRow, HomepageRow, SettingsRow } from "../types";

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalPages: number;
  unreadContacts: number;
}

export interface ContactFormRow {
  ContactForm_ID: number;
  FirstName: string | null;
  LastName: string | null;
  FromEmail: string | null;
  Subject: string | null;
  Message: string | null;
  DateCreated: Date | null;
  ReadStatus: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const rows = await query<DashboardStats>(`
    SELECT
      (SELECT COUNT(*) FROM Products)                          AS totalProducts,
      (SELECT COUNT(*) FROM Categories)                        AS totalCategories,
      (SELECT COUNT(*) FROM Pages)                             AS totalPages,
      (SELECT COUNT(*) FROM ContactForms WHERE ReadStatus = 0) AS unreadContacts
  `);
  return rows[0] ?? { totalProducts: 0, totalCategories: 0, totalPages: 0, unreadContacts: 0 };
}

export async function getRecentContacts(limit = 10): Promise<ContactFormRow[]> {
  return query<ContactFormRow>(
    `SELECT TOP (@limit) ContactForm_ID, FirstName, LastName, FromEmail, Subject, Message, DateCreated, ReadStatus
     FROM ContactForms ORDER BY DateCreated DESC`,
    { limit }
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductListRow {
  Product_ID: number;
  Name: string;
  SKU: string | null;
  Base_Price: number;
  NumInStock: number;
  Display: boolean;
  Sale: boolean;
  Priority: number;
}

export async function getProductsAdmin(
  page = 1,
  search = "",
  pageSize = 50
): Promise<{ rows: ProductListRow[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const [rows, counts] = await Promise.all([
    query<ProductListRow>(
      `SELECT Product_ID, Name, SKU, Base_Price, NumInStock, Display, Sale, Priority
       FROM Products
       WHERE LEN(@search) = 0 OR Name LIKE '%' + @search + '%' OR SKU LIKE '%' + @search + '%'
       ORDER BY Name ASC
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`,
      { search, offset, pageSize }
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM Products
       WHERE LEN(@search) = 0 OR Name LIKE '%' + @search + '%' OR SKU LIKE '%' + @search + '%'`,
      { search }
    ),
  ]);
  return { rows, total: counts[0]?.total ?? 0 };
}

export async function getProductByIdAdmin(id: number): Promise<ProductRow | null> {
  const rows = await query<ProductRow>("SELECT * FROM Products WHERE Product_ID = @id", { id });
  return rows[0] ?? null;
}

export type ProductParams = Record<string, string | number | boolean | null>;

function productParams(data: FormData): ProductParams {
  const s = (k: string) => (data.get(k) as string | null) ?? null;
  const sval = (k: string) => { const v = s(k); return v?.trim() || null; };
  const n = (k: string, fallback = 0) => parseFloat(s(k) ?? "") || fallback;
  const nopt = (k: string) => { const v = s(k); return v && v.trim() ? parseFloat(v) || null : null; };
  const b = (k: string) => data.get(k) === "on";
  const i = (k: string, fallback = 0) => parseInt(s(k) ?? "") || fallback;
  return {
    name:            s("name") ?? "",
    sku:             sval("sku"),
    upc:             sval("upc"),
    alu:             sval("alu"),
    short_desc:      sval("short_desc"),
    long_desc:       sval("long_desc"),
    long_desc2:      sval("long_desc2"),
    long_desc3:      sval("long_desc3"),
    long_desc4:      sval("long_desc4"),
    bullet1:         sval("bullet1"),
    bullet2:         sval("bullet2"),
    bullet3:         sval("bullet3"),
    bullet4:         sval("bullet4"),
    bullet5:         sval("bullet5"),
    base_price:      n("base_price"),
    retail_price:    nopt("retail_price"),
    wholesale:       nopt("wholesale"),
    map_price:       nopt("map_price"),
    num_in_stock:    i("num_in_stock"),
    weight:          nopt("weight"),
    display:         b("display"),
    sale:            b("sale"),
    hot:             b("hot"),
    priority:        i("priority", 50),
    availability:    sval("availability"),
    permalink:       sval("permalink"),
    metadescription: sval("metadescription"),
    keywords:        sval("keywords"),
    title_tag:       sval("title_tag"),
  };
}

export async function createProduct(data: FormData): Promise<number> {
  const p = productParams(data);
  const rows = await query<{ Product_ID: number }>(
    `INSERT INTO Products
       (Name, SKU, UPC, ALU, Short_Desc, Long_Desc, Long_Desc2, Long_Desc3, Long_Desc4,
        Bullet_point1, Bullet_point2, Bullet_point3, Bullet_point4, Bullet_point5,
        Base_Price, Retail_Price, Wholesale, MAP_Price, NumInStock, Weight,
        Display, Sale, Hot, Priority, Popularity, Availability,
        Permalink, Metadescription, Keywords, TitleTag, DateAdded)
     OUTPUT INSERTED.Product_ID
     VALUES
       (@name, @sku, @upc, @alu, @short_desc, @long_desc, @long_desc2, @long_desc3, @long_desc4,
        @bullet1, @bullet2, @bullet3, @bullet4, @bullet5,
        @base_price, @retail_price, @wholesale, @map_price, @num_in_stock, @weight,
        @display, @sale, @hot, @priority, 0, @availability,
        @permalink, @metadescription, @keywords, @title_tag, GETDATE())`,
    p
  );
  return rows[0]?.Product_ID ?? 0;
}

export async function updateProduct(id: number, data: FormData): Promise<void> {
  const p = productParams(data);
  await query(
    `UPDATE Products SET
       Name = @name, SKU = @sku, UPC = @upc, ALU = @alu,
       Short_Desc = @short_desc, Long_Desc = @long_desc,
       Long_Desc2 = @long_desc2, Long_Desc3 = @long_desc3, Long_Desc4 = @long_desc4,
       Bullet_point1 = @bullet1, Bullet_point2 = @bullet2, Bullet_point3 = @bullet3,
       Bullet_point4 = @bullet4, Bullet_point5 = @bullet5,
       Base_Price = @base_price, Retail_Price = @retail_price,
       Wholesale = @wholesale, MAP_Price = @map_price,
       NumInStock = @num_in_stock, Weight = @weight,
       Display = @display, Sale = @sale, Hot = @hot,
       Priority = @priority, Availability = @availability,
       Permalink = @permalink, Metadescription = @metadescription,
       Keywords = @keywords, TitleTag = @title_tag
     WHERE Product_ID = @id`,
    { ...p, id }
  );
}

export async function deleteProduct(id: number): Promise<void> {
  await query("DELETE FROM Products WHERE Product_ID = @id", { id });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface CategoryListRow {
  Category_ID: number;
  Name: string;
  Parent_ID: number;
  Display: boolean;
  Priority: number;
}

export async function getCategoriesAdmin(): Promise<CategoryListRow[]> {
  return query<CategoryListRow>(
    `SELECT Category_ID, Name, Parent_ID, Display, Priority
     FROM Categories ORDER BY Parent_ID ASC, Priority ASC, Name ASC`
  );
}

export async function getCategoryByIdAdmin(id: number): Promise<CategoryRow | null> {
  const rows = await query<CategoryRow>("SELECT * FROM Categories WHERE Category_ID = @id", { id });
  return rows[0] ?? null;
}

function categoryParams(data: FormData): Record<string, string | number | boolean | null> {
  const s = (k: string) => (data.get(k) as string | null) ?? null;
  const sval = (k: string) => { const v = s(k); return v?.trim() || null; };
  const b = (k: string) => data.get(k) === "on";
  const i = (k: string, fallback = 0) => parseInt(s(k) ?? "") || fallback;
  return {
    name:               s("name") ?? "",
    parent_id:          i("parent_id"),
    short_desc:         sval("short_desc"),
    long_desc:          sval("long_desc"),
    sm_image:           sval("sm_image"),
    lg_image:           sval("lg_image"),
    lg_title:           sval("lg_title"),
    lg_image_position:  i("lg_image_position"),
    page_url:           sval("page_url"),
    display:            b("display"),
    display_menu:       b("display_menu"),
    show_cat_header:    b("show_cat_header"),
    show_sub_cats:      b("show_sub_cats"),
    prod_first:         b("prod_first"),
    show_prod_left_col: b("show_prod_left_col"),
    priority:           i("priority", 50),
    permalink:          sval("permalink"),
    metadescription:    sval("metadescription"),
    keywords:           sval("keywords"),
    title_tag:          sval("title_tag"),
  };
}

export async function createCategory(data: FormData): Promise<number> {
  const p = categoryParams(data);
  const rows = await query<{ Category_ID: number }>(
    `INSERT INTO Categories
       (Name, Parent_ID, Short_Desc, Long_Desc, Sm_Image, Lg_image, Lg_Title,
        Lg_image_position, Page_URL, Display, Display_Menu, ShowCatHeader,
        ShowSubCats, ProdFirst, ShowProdLeftColumn, Priority,
        Permalink, Metadescription, Keywords, TitleTag)
     OUTPUT INSERTED.Category_ID
     VALUES
       (@name, @parent_id, @short_desc, @long_desc, @sm_image, @lg_image, @lg_title,
        @lg_image_position, @page_url, @display, @display_menu, @show_cat_header,
        @show_sub_cats, @prod_first, @show_prod_left_col, @priority,
        @permalink, @metadescription, @keywords, @title_tag)`,
    p
  );
  return rows[0]?.Category_ID ?? 0;
}

export async function updateCategory(id: number, data: FormData): Promise<void> {
  const p = categoryParams(data);
  await query(
    `UPDATE Categories SET
       Name = @name, Parent_ID = @parent_id, Short_Desc = @short_desc, Long_Desc = @long_desc,
       Sm_Image = @sm_image, Lg_image = @lg_image, Lg_Title = @lg_title,
       Lg_image_position = @lg_image_position, Page_URL = @page_url,
       Display = @display, Display_Menu = @display_menu, ShowCatHeader = @show_cat_header,
       ShowSubCats = @show_sub_cats, ProdFirst = @prod_first,
       ShowProdLeftColumn = @show_prod_left_col, Priority = @priority,
       Permalink = @permalink, Metadescription = @metadescription,
       Keywords = @keywords, TitleTag = @title_tag
     WHERE Category_ID = @id`,
    { ...p, id }
  );
}

export async function deleteCategory(id: number): Promise<void> {
  await query("DELETE FROM Categories WHERE Category_ID = @id", { id });
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export interface PageListRow {
  Page_ID: number;
  Page_Name: string;
  Page_Title: string | null;
  Display: boolean;
  Custom_include: string | null;
}

export async function getPagesAdmin(): Promise<PageListRow[]> {
  return query<PageListRow>(
    `SELECT Page_ID, Page_Name, Page_Title, Display, Custom_include
     FROM Pages ORDER BY Page_Name ASC`
  );
}

export async function getPageByIdAdmin(id: number): Promise<PageRow | null> {
  const rows = await query<PageRow>("SELECT * FROM Pages WHERE Page_ID = @id", { id });
  return rows[0] ?? null;
}

export async function updatePage(id: number, data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  const b = (k: string) => data.get(k) === "on";
  await query(
    `UPDATE Pages SET
       Page_Name = @page_name, Page_Title = @page_title, PageText = @page_text,
       Page_URL = @page_url, Short_desc = @short_desc,
       Display = @display, Display_Menu = @display_menu,
       Custom_include = @custom_include,
       Permalink = @permalink, Metadescription = @metadescription,
       Keywords = @keywords, TitleTag = @title_tag
     WHERE Page_ID = @id`,
    {
      id,
      page_name:       data.get("page_name") as string,
      page_title:      s("page_title"),
      page_text:       (data.get("page_text") as string | null) || null,
      page_url:        s("page_url"),
      short_desc:      s("short_desc"),
      display:         b("display"),
      display_menu:    b("display_menu"),
      custom_include:  s("custom_include"),
      permalink:       s("permalink"),
      metadescription: s("metadescription"),
      keywords:        s("keywords"),
      title_tag:       s("title_tag"),
    }
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomepageAdmin(): Promise<HomepageRow | null> {
  const rows = await query<HomepageRow>("SELECT TOP 1 * FROM Homepage WHERE ID = 1");
  return rows[0] ?? null;
}

export async function updateHomepage(data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  const b = (k: string) => data.get(k) === "on";
  const i = (k: string, fallback = 0) => parseInt((data.get(k) as string) ?? "") || fallback;
  const iopt = (k: string) => { const v = data.get(k) as string; return v?.trim() ? parseInt(v) || null : null; };

  await query(
    `UPDATE Homepage SET
       Alert_display = @alert_display, Alert_text = @alert_text, Alert_priority = @alert_priority,
       Hero_display = @hero_display, Hero_image = @hero_image, Hero_text = @hero_text,
       Hero_text1 = @hero_text1, Hero_text2 = @hero_text2, Hero_text3 = @hero_text3, Hero_text4 = @hero_text4,
       Hero_button = @hero_button, Hero_button_color = @hero_button_color, Hero_link = @hero_link,
       Hero_height = @hero_height, Hero_text_position = @hero_text_position, Hero_priority = @hero_priority,
       Hero_over_menu = @hero_over_menu,
       Gallery_display = @gallery_display, Gallery_id = @gallery_id, Gallery_title = @gallery_title,
       Gallery_max = @gallery_max, Gallery_fullwidth = @gallery_fullwidth,
       Gallery_height = @gallery_height, Gallery_priority = @gallery_priority,
       Gallery2_display = @gallery2_display, Gallery2_id = @gallery2_id, Gallery2_priority = @gallery2_priority,
       Custom_text_1_display = @ct1_display, Custom_text_1 = @ct1_text,
       Custom_text_1_fullwidth = @ct1_fullwidth, Custom_text_1_priority = @ct1_priority,
       Custom_text_2_display = @ct2_display, Custom_text_2 = @ct2_text,
       Custom_text_2_fullwidth = @ct2_fullwidth, Custom_text_2_priority = @ct2_priority,
       Custom_text_3_display = @ct3_display, Custom_text_3 = @ct3_text,
       Custom_text_3_fullwidth = @ct3_fullwidth, Custom_text_3_priority = @ct3_priority,
       Topcats_Display = @topcats_display, Topcats_Allcats = @topcats_allcats,
       Topcats_cols = @topcats_cols, Topcats_categories = @topcats_categories,
       Topcats_catstyle = @topcats_catstyle, Topcats_title = @topcats_title, Topcats_priority = @topcats_priority,
       Product_display = @product_display, Product_priority = @product_priority,
       Product_style = @product_style, Product_title = @product_title,
       Product_passparam = @product_passparam, Product_fullwidth = @product_fullwidth,
       Testimonial_display = @testimonial_display, Testimonial_priority = @testimonial_priority,
       Testimonial_fullwidth = @testimonial_fullwidth,
       Contact_display = @contact_display, Contact_priority = @contact_priority,
       Custom_code_1_display = @cc1_display, Custom_code_1_priority = @cc1_priority
     WHERE ID = 1`,
    {
      alert_display:       b("alert_display"),
      alert_text:          s("alert_text"),
      alert_priority:      i("alert_priority", 1),
      hero_display:        b("hero_display"),
      hero_image:          s("hero_image"),
      hero_text:           (data.get("hero_text") as string | null) || null,
      hero_text1:          s("hero_text1"),
      hero_text2:          s("hero_text2"),
      hero_text3:          s("hero_text3"),
      hero_text4:          s("hero_text4"),
      hero_button:         s("hero_button"),
      hero_button_color:   s("hero_button_color"),
      hero_link:           s("hero_link"),
      hero_height:         iopt("hero_height"),
      hero_text_position:  i("hero_text_position"),
      hero_priority:       i("hero_priority", 1),
      hero_over_menu:      b("hero_over_menu"),
      gallery_display:     b("gallery_display"),
      gallery_id:          iopt("gallery_id"),
      gallery_title:       s("gallery_title"),
      gallery_max:         iopt("gallery_max"),
      gallery_fullwidth:   b("gallery_fullwidth"),
      gallery_height:      iopt("gallery_height"),
      gallery_priority:    i("gallery_priority", 2),
      gallery2_display:    b("gallery2_display"),
      gallery2_id:         iopt("gallery2_id"),
      gallery2_priority:   i("gallery2_priority", 3),
      ct1_display:         b("ct1_display"),
      ct1_text:            (data.get("ct1_text") as string | null) || null,
      ct1_fullwidth:       b("ct1_fullwidth"),
      ct1_priority:        i("ct1_priority", 4),
      ct2_display:         b("ct2_display"),
      ct2_text:            (data.get("ct2_text") as string | null) || null,
      ct2_fullwidth:       b("ct2_fullwidth"),
      ct2_priority:        i("ct2_priority", 5),
      ct3_display:         b("ct3_display"),
      ct3_text:            (data.get("ct3_text") as string | null) || null,
      ct3_fullwidth:       b("ct3_fullwidth"),
      ct3_priority:        i("ct3_priority", 6),
      topcats_display:     b("topcats_display"),
      topcats_allcats:     b("topcats_allcats"),
      topcats_cols:        iopt("topcats_cols"),
      topcats_categories:  s("topcats_categories"),
      topcats_catstyle:    iopt("topcats_catstyle"),
      topcats_title:       s("topcats_title"),
      topcats_priority:    i("topcats_priority", 7),
      product_display:     b("product_display"),
      product_priority:    i("product_priority", 8),
      product_style:       iopt("product_style"),
      product_title:       s("product_title"),
      product_passparam:   s("product_passparam"),
      product_fullwidth:   b("product_fullwidth"),
      testimonial_display:  b("testimonial_display"),
      testimonial_priority: i("testimonial_priority", 9),
      testimonial_fullwidth: b("testimonial_fullwidth"),
      contact_display:     b("contact_display"),
      contact_priority:    i("contact_priority", 10),
      cc1_display:         b("cc1_display"),
      cc1_priority:        i("cc1_priority", 11),
    }
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function updateSettings(data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  const b = (k: string) => data.get(k) === "on";
  const iopt = (k: string) => { const v = data.get(k) as string; return v?.trim() ? parseInt(v) || null : null; };

  await query(
    `UPDATE Settings SET
       SiteName = @site_name, SiteNameAB = @site_name_ab, DomainName = @domain_name,
       Phone = @phone, Phone2 = @phone2, Phone3 = @phone3, Phone4 = @phone4,
       Logo_desktop = @logo_desktop, Logo_mobile = @logo_mobile,
       Address1 = @address1, Address2 = @address2,
       City = @city, State = @state, Postalcode = @postalcode,
       Email = @email, MerchantEmail = @merchant_email,
       DefaultImages = @default_images, GoogleMapEmbed = @google_map_embed,
       Email_Server = @email_server, Email_User = @email_user, Email_Pass = @email_pass,
       Email_Port = @email_port, Email_useSSL = @email_use_ssl, Email_useTLS = @email_use_tls
     WHERE SettingID = 1`,
    {
      site_name:       s("site_name"),
      site_name_ab:    s("site_name_ab"),
      domain_name:     s("domain_name"),
      phone:           s("phone"),
      phone2:          s("phone2"),
      phone3:          s("phone3"),
      phone4:          s("phone4"),
      logo_desktop:    s("logo_desktop"),
      logo_mobile:     s("logo_mobile"),
      address1:        s("address1"),
      address2:        s("address2"),
      city:            s("city"),
      state:           s("state"),
      postalcode:      s("postalcode"),
      email:           s("email"),
      merchant_email:  s("merchant_email"),
      default_images:  s("default_images"),
      google_map_embed: (data.get("google_map_embed") as string | null) || null,
      email_server:    s("email_server"),
      email_user:      s("email_user"),
      email_pass:      s("email_pass"),
      email_port:      iopt("email_port"),
      email_use_ssl:   b("email_use_ssl"),
      email_use_tls:   b("email_use_tls"),
    }
  );
}
