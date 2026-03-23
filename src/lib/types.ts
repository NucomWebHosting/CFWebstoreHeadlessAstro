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
export function getImageBaseUrl(settings: SettingsRow | null): string {
  if (!settings) return "";
  const domain = settings.DomainName?.replace(/\/$/, "") ?? "";
  const folder = settings.DefaultImages?.replace(/\/$/, "") ?? "";
  return `${domain}${folder}`;
}

export interface NavItem {
  id: number;
  name: string;
  href: string;
  children: NavItem[];
}
