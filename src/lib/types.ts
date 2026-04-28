import { parseJsonColumn } from "./db";

// TypeScript interfaces matching MySQL schema column names (lowercase)

export interface PageRow {
  page_id: number;
  page_url: string | null;
  theme_id: number | null;
  passparam: string | null;
  display: boolean;
  action: string | null;
  name: string;
  title: string | null;
  sm_image: string | null;
  sm_image_width: number | null;
  sm_image_height: number | null;
  lg_image: string | null;
  lg_image_width: number | null;
  lg_image_height: number | null;
  short_desc: string | null;
  long_desc: string | null;
  display_textfirst: boolean | null;
  system: boolean | null;
  href_attributes: string | null;
  accesskey: number | null;
  priority: number;
  parent_id: number | null;
  title_priority: number | null;
  metadescription: string | null;
  keywords: string | null;
  titletag: string | null;
  slug: string | null;
  custom_include: string | null;
  date_created: Date | null;
  last_updated: Date | null;
}

export interface CategoryRow {
  category_id: number;
  name: string;
  parent_id: number;
  theme_id: number | null;
  slug: string | null;
  display: boolean;
  priority: number;
  date_created: Date | null;
  last_updated: Date | null;
}

export interface ProductRow {
  product_id: number;
  name: string;
  price: number;
  price_wholesale: number;
  display: boolean;
  priority: number;
  vendor_id: number;
  brand_id: number;
  prodtype_id: number;
  slug: string | null;
  date_created: Date | null;
  last_updated: Date | null;
  sm_image?: string | null;       // joined from product_images (first image, md size)
  sm_image_hover?: string | null;  // 2nd product image for hover effect (md size)
  is_on_sale?: boolean;            // from product_data.sale JSON
  is_hot?: boolean;                // from product_data.hot JSON
  price_retail?: number | null;    // compare/original price from product_data
  short_desc?: string | null;      // from product_content
  brand_name?: string | null;      // from account table (mfg_account_id)
}

export interface ProductContentRow {
  product_id: number;
  short_desc: string | null;
  long_desc: string | null;
  metadescription: string | null;
  keywords: string | null;
  titletag: string | null;
  product_data: string | null;  // JSON
}

export interface ProductImageRow {
  product_image_id: number;
  product_id: number;
  original: string | null;
  th_image: string | null;
  sm_image: string | null;
  md_image: string | null;
  lg_image: string | null;
  th_image_width: number | null;
  th_image_height: number | null;
  sm_image_width: number | null;
  sm_image_height: number | null;
  md_image_width: number | null;
  md_image_height: number | null;
  lg_image_width: number | null;
  lg_image_height: number | null;
  filename: string | null;
  image_file: string | null;
  gallery: number | null;
  caption: string | null;
  priority: number;
}

export interface SettingsRow {
  setting_id: number;
  display_inventory_tab: boolean | null;
  allow_edit_slug: boolean | null;
  display_source: boolean | null;
  display_dropship: boolean | null;
  display_amazon: boolean | null;
  moneyunit: string | null;
  weightunit: string | null;
  sizeunit: string | null;
  invlevel: string | null;
  locale: string | null;
  timeoffset: number | null;
  excludeip: string | null;
  display_onetimecode: boolean | null;
  display_wishlists: boolean | null;
  display_gift_registry: boolean | null;
  product_data: string | null;       // JSON
  category_data: string | null;      // JSON
  blog_data: string | null;          // JSON
  email_data: string | null;         // JSON
  google_data: string | null;        // JSON
  search_data: string | null;        // JSON
  cloudflare_data: string | null;    // JSON
  marketing_data: string | null;     // JSON
  seo_data: string | null;           // JSON
  tax_provider_id: number | null;    // 1=local, 2=avatax
  last_updated: Date | null;
}

/**
 * Root-relative image path for use in browser <img> tags (never includes domain).
 * e.g. "/images"  →  <img src="/images/product.jpg">
 *
 * DefaultImages is now stored in store.address_data JSON or env var.
 */
// Re-export from client-safe module (no server dependencies)
export { resolveImg } from "./image-utils";

/**
 * Absolute image URL for email templates, OG tags, and sitemaps.
 * Pass the full relative path including subfolder, e.g. "/images/product.jpg".
 */
export function getAbsoluteImageUrl(settings: SettingsRow | null, path: string): string {
  const domain = (import.meta.env.SITE_DOMAIN as string | undefined) ?? "";
  const file   = path.startsWith("/") ? path : `/${path}`;
  return domain ? `${domain}${file}` : file;
}

export interface NavItem {
  id: number;
  name: string;
  href: string;
  children: NavItem[];
}

// Homepage table — one row per site
// Store table — one row per site
export interface StoreRow {
  store_id: number;
  name: string;
  domainname: string | null;
  setting_id: number;
  cart_setting_id: number;
  location_id: number;
  homepage_id: number;
  theme_id: number;
  footer_id: number;
  address_data: string | null;   // JSON
  logo_data: string | null;      // JSON
  date_created: Date | null;
  last_updated: Date | null;
}

export interface AddressData {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postalcode?: string | null;
  county?: string | null;
  country?: string | null;
  merchant_message?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  phone3?: string | null;
}

export function getAddressData(store: StoreRow | null): AddressData {
  if (!store?.address_data) return {};
  return parseJsonColumn<AddressData>(store.address_data, {});
}

export interface LogoData {
  logo_desktop?: string | null;
  logo_mobile?: string | null;
  logo_print?: string | null;
  logo_desktop_width?: number | null;
  logo_desktop_height?: number | null;
  logo_mobile_width?: number | null;
  logo_mobile_height?: number | null;
  logo_print_width?: number | null;
  logo_print_height?: number | null;
  logo_desktop_stickey_width?: number | null;
  logo_desktop_stickey_height?: number | null;
  logo_desktop_stickey_data_width?: number | null;
  logo_desktop_stickey_data_height?: number | null;
}

export function getLogoData(store: StoreRow | null): LogoData {
  if (!store?.logo_data) return {};
  return parseJsonColumn<LogoData>(store.logo_data, {});
}

// Category content table (descriptions, images, SEO)
export interface CategoryContentRow {
  category_id: number;
  short_desc: string | null;
  long_desc: string | null;
  metadescription: string | null;
  keywords: string | null;
  titletag: string | null;
  searchheader: string | null;
  sm_image: string | null;
  lg_image: string | null;
  menu_config: string | null;
  display_config: string | null;
}

// Category settings table (layout/menu JSON)
export interface CategorySettingsRow {
  category_id: number;
  menu_data: string | null;   // JSON
  layout_data: string | null; // JSON
}

// Testimonials table
export interface TestimonialRow {
  testimony_id: number;
  name: string | null;
  description: string | null;
  image: string | null;
  priority: number;
  display: boolean;
}

// ── Navigation Menu System ────────────────────────────────────────────────────

export interface NavMenuRow {
  menu_id: number;
  name: string;
  auto_add: boolean;
  date_created: Date | null;
  last_updated: Date | null;
}

export type NavMenuItemType = 'page' | 'category' | 'custom' | 'post' | 'store';

export interface NavMenuItemRow {
  item_id: number;
  menu_id: number;
  parent_id: number;   // 0 = root
  sort_order: number;
  label: string;
  item_type: NavMenuItemType;
  target_id: number | null;
  custom_url: string | null;
  target_blank: boolean;
}

export interface NavMenuLocationRow {
  location_key: string;
  menu_id: number | null;
}
