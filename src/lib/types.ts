// TypeScript interfaces matching MSSQL schema column names exactly (mixed case)

export interface PageRow {
  Page_ID: number;
  Page_Name: string;
  Page_Title: string | null;
  PageText: string | null;
  Page_URL: string | null;
  Short_desc: string | null;
  Sm_Image: string | null;
  Lg_Image: string | null;
  Display: boolean;
  Display_Menu: boolean;
  Parent_ID: number | null;
  AccessKey: number | null;
  Metadescription: string | null;
  Keywords: string | null;
  TitleTag: string | null;
  Permalink: string | null;
  CatCore_ID: number | null;
}

export interface CategoryRow {
  Category_ID: number;
  Name: string;
  Parent_ID: number;
  Short_Desc: string | null;
  Long_Desc: string | null;
  Sm_Image: string | null;
  Lg_image: string | null;
  Lg_Title: string | null;          // title image (overrides text title when set)
  Lg_image_position: number;        // 0=left, 1=right, 2=top
  ShowCatHeader: boolean;           // show/hide the header section
  ShowSubCats: boolean;             // show/hide subcategory grid
  ProdFirst: boolean;               // true = products above subcats, false = subcats first
  ShowProdLeftColumn: boolean;      // sidebar filter column
  Page_URL: string | null;
  Display: boolean;
  Display_Menu: boolean;
  Priority: number;
  ParentIDs: string | null;
  ParentNames: string | null;
  Permalink: string | null;
  Metadescription: string | null;
  Keywords: string | null;
  TitleTag: string | null;
  CatCore_ID: number;
  AccessKey: number | null;
}

export interface ProductRow {
  Product_ID: number;
  Name: string;
  SKU: string | null;
  UPC: string | null;
  ALU: string | null;
  Short_Desc: string | null;
  Long_Desc: string | null;
  Long_Desc2: string | null;
  Long_Desc3: string | null;
  Long_Desc4: string | null;
  Bullet_point1: string | null;
  Bullet_point2: string | null;
  Bullet_point3: string | null;
  Bullet_point4: string | null;
  Bullet_point5: string | null;
  Base_Price: number;
  Retail_Price: number | null;
  Wholesale: number | null;
  MAP_Price: number | null;
  NumInStock: number;
  Display: boolean;
  Sale: boolean;
  Hot: boolean;
  Priority: number;
  Popularity: number;
  DateAdded: Date | null;
  Weight: number | null;
  Permalink: string | null;
  Metadescription: string | null;
  Keywords: string | null;
  TitleTag: string | null;
  Availability: string | null;
}

export interface ProductImageRow {
  Product_Image_ID: number;
  Product_ID: number;
  Th_image: string | null;
  Sm_image: string | null;
  Md_image: string | null;
  Lg_image: string | null;
}

export interface SettingsRow {
  SettingID: number;
  SiteName: string | null;
  SiteNameAB: string | null;
  DomainName: string | null;
  Phone: string | null;
  Logo_desktop: string | null;
  Logo_mobile: string | null;
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  State: string | null;
  Postalcode: string | null;
  Email: string | null;
  DefaultImages: string | null;  // e.g. "/images" — prepended to image filenames
}

// Build the image base URL from Settings: DomainName + DefaultImages
// Mirrors CF's: Request.ImagePath = request.domainname & AppSettings.defaultimages & "/"
// Falls back to IMAGE_BASE_URL env var when the DB fields aren't populated yet.
export function getImageBaseUrl(settings: SettingsRow | null): string {
  const envFallback = process.env.IMAGE_BASE_URL ?? "";
  if (!settings) return envFallback;
  const domain = settings.DomainName?.replace(/\/$/, "") ?? "";
  const folder = settings.DefaultImages?.replace(/\/$/, "") ?? "";
  const fromDb = `${domain}${folder}`;
  return fromDb || envFallback;
}

export interface NavItem {
  id: number;
  name: string;
  href: string;
  children: NavItem[];
}

// Homepage table — one row per site (keyed by ID, matched to Settings.SettingID)
export interface HomepageRow {
  ID: number;

  // Alert banner
  Alert_display: boolean;
  Alert_text: string | null;
  Alert_priority: number;

  // Hero image section
  Hero_display: boolean;
  Hero_image: string | null;
  Hero_text: string | null;      // free-form HTML overlay
  Hero_text1: string | null;     // preset animation line 1
  Hero_text2: string | null;
  Hero_text3: string | null;
  Hero_text4: string | null;
  Hero_button: string | null;    // CTA button label
  Hero_button_color: string | null;
  Hero_link: string | null;
  Hero_height: number | null;    // px; 0 = 80vh
  Hero_text_position: number;    // 0=left, 1=center, 2=right
  Hero_priority: number;
  Hero_over_menu: boolean;

  // Slider / Gallery (Bootstrap carousel driven by Gallery table)
  Gallery_display: boolean;
  Gallery_id: number | null;
  Gallery_title: string | null;
  Gallery_max: number | null;
  Gallery_fullwidth: boolean;
  Gallery_height: number | null;
  Gallery_priority: number;
  Carousel_altImage1: string | null;
  Carousel_altImage1_link: string | null;
  Carousel_altImage1_altText: string | null;
  Carousel_altImage1_button: string | null;
  Carousel_altImage2: string | null;
  Carousel_altImage2_link: string | null;
  Carousel_altImage2_altText: string | null;
  Carousel_altImage2_button: string | null;

  // Gallery 2
  Gallery2_display: boolean;
  Gallery2_id: number | null;
  Gallery2_priority: number;

  // Custom HTML text blocks (1–3)
  Custom_text_1_display: boolean;
  Custom_text_1: string | null;
  Custom_text_1_fullwidth: boolean;
  Custom_text_1_priority: number;

  Custom_text_2_display: boolean;
  Custom_text_2: string | null;
  Custom_text_2_fullwidth: boolean;
  Custom_text_2_priority: number;

  Custom_text_3_display: boolean;
  Custom_text_3: string | null;
  Custom_text_3_fullwidth: boolean;
  Custom_text_3_priority: number;

  // Top Categories grid
  Topcats_Display: boolean;
  Topcats_Allcats: boolean;       // true = all top-level cats; false = use Topcats_categories
  Topcats_cols: number | null;
  Topcats_categories: string | null; // comma-separated Category_IDs
  Topcats_catstyle: number | null;
  Topcats_title: string | null;
  Topcats_priority: number;

  // Product carousel / featured products
  Product_display: boolean;
  Product_priority: number;
  Product_style: number | null;   // 1=carousel, 2=masonry, 3=single, 4=quick table, 5=team table
  Product_title: string | null;
  Product_passparam: string | null; // comma-separated key=value pairs
  Product_fullwidth: boolean;

  // Testimonials
  Testimonial_display: boolean;
  Testimonial_priority: number;
  Testimonial_fullwidth: boolean;
  Testimonial_product_id: number | null;
  Testimonial_list_id: number | null;

  // Contact form
  Contact_display: boolean;
  Contact_priority: number;

  // Custom code block
  Custom_code_1_display: boolean;
  Custom_code_1_priority: number;
}

// Testimonials table
export interface TestimonialRow {
  ReviewID: number;
  Title: string | null;
  Comment: string | null;
  Anon_name: string | null;
  Rating: number | null;
  Posted: Date | null;
  Display: boolean;
}
