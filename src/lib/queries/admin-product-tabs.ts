import { query } from "../db";

// ─── Pricing Tab ──────────────────────────────────────────────────────────────

export interface PricingFields {
  Product_ID: number;
  // On/Off
  NotSold: boolean;
  stock_date: Date | null;
  // Sale dates
  Sale_Start: Date | null;
  Sale_End: Date | null;
  // Inventory / Identifiers
  SKU: string | null;
  UPC: string | null;
  ALU: string | null;
  Availability: string | null;
  NumInStock: number | null;
  Min_Order: number | null;
  Mult_Min: boolean;
  Prep_days: number | null;
  reorder_level: number | null;
  // Prices
  Base_Price: number;
  Retail_Price: number | null;
  MAP_Price: number | null;
  Wholesale: number | null;
  Unit_Desc: string | null;
  ShowPrice: string | null;
  showPriceRange: string | null;
  showquantity: number | null;
  // Subscription
  subscription: boolean;
  subscription_discount: number | null;
  // Discounts
  showDiscounts: boolean;
  ShowPromotions: boolean;
  // Vendor
  Vendor_SKU: string | null;
  dropship_cost: number | null;
  DropShip_Note: string | null;
  // Shipping
  shipping: boolean;
  shipping_quote: boolean;
  Weight: number | null;
  Item_Handling: number | null;
  freight_dom: number | null;
  freight_intl: number | null;
  Add_Additional_Handling: boolean;
  Giftwrap: boolean;
  // Pack dims 1
  Pack_Length: number | null;
  Pack_Width: number | null;
  Pack_Height: number | null;
  // Pack dims 2–4
  Weight2: number | null;
  Pack_Length2: number | null;
  Pack_Width2: number | null;
  Pack_Height2: number | null;
  Weight3: number | null;
  Pack_Length3: number | null;
  Pack_Width3: number | null;
  Pack_Height3: number | null;
  Weight4: number | null;
  Pack_Length4: number | null;
  Pack_Width4: number | null;
  Pack_Height4: number | null;
}

export async function getPricingFields(id: number): Promise<PricingFields | null> {
  const rows = await query<PricingFields>(
    `SELECT Product_ID,
            NotSold, stock_date, Sale_Start, Sale_End,
            SKU, UPC, ALU, Availability, NumInStock,
            Min_Order, Mult_Min, Prep_days, reorder_level,
            Base_Price, Retail_Price, MAP_Price, Wholesale, Unit_Desc,
            ShowPrice, showPriceRange, showquantity,
            subscription, subscription_discount, showDiscounts, ShowPromotions,
            Vendor_SKU, dropship_cost, DropShip_Note,
            shipping, shipping_quote, Weight, Item_Handling, freight_dom, freight_intl,
            Add_Additional_Handling, Giftwrap,
            Pack_Length, Pack_Width, Pack_Height,
            Weight2, Pack_Length2, Pack_Width2, Pack_Height2,
            Weight3, Pack_Length3, Pack_Width3, Pack_Height3,
            Weight4, Pack_Length4, Pack_Width4, Pack_Height4
     FROM   Products WHERE Product_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function updatePricingFields(id: number, data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  const nopt = (k: string) => { const v = s(k); return v ? (parseFloat(v) || null) : null; };
  const iopt = (k: string) => { const v = s(k); return v ? (parseInt(v) || null) : null; };
  const bit  = (k: string) => data.get(k) === "1" ? 1 : 0;
  await query(
    `UPDATE Products SET
       NotSold       = @not_sold,
       stock_date    = @stock_date,
       Sale_Start    = @sale_start,
       Sale_End      = @sale_end,
       SKU           = @sku,
       UPC           = @upc,
       ALU           = @alu,
       Availability  = @availability,
       NumInStock    = @num_in_stock,
       Min_Order     = @min_order,
       Mult_Min      = @mult_min,
       Prep_days     = @prep_days,
       reorder_level = @reorder,
       Base_Price    = @base_price,
       Retail_Price  = @retail_price,
       MAP_Price     = @map_price,
       Wholesale     = @wholesale,
       Unit_Desc     = @unit_desc,
       ShowPrice     = @show_price,
       showPriceRange = @show_price_range,
       showquantity  = @show_quantity,
       subscription  = @subscription,
       subscription_discount = @sub_discount,
       showDiscounts = @show_discounts,
       ShowPromotions = @show_promotions,
       Vendor_SKU    = @vendor_sku,
       dropship_cost = @dropship_cost,
       DropShip_Note = @dropship_note,
       shipping      = @shipping,
       shipping_quote = @shipping_quote,
       Weight        = @weight,
       Item_Handling = @item_handling,
       freight_dom   = @freight_dom,
       freight_intl  = @freight_intl,
       Add_Additional_Handling = @add_handling,
       Giftwrap      = @giftwrap,
       Pack_Length   = @pack_length,
       Pack_Width    = @pack_width,
       Pack_Height   = @pack_height,
       Weight2       = @weight2,
       Pack_Length2  = @pack_length2,
       Pack_Width2   = @pack_width2,
       Pack_Height2  = @pack_height2,
       Weight3       = @weight3,
       Pack_Length3  = @pack_length3,
       Pack_Width3   = @pack_width3,
       Pack_Height3  = @pack_height3,
       Weight4       = @weight4,
       Pack_Length4  = @pack_length4,
       Pack_Width4   = @pack_width4,
       Pack_Height4  = @pack_height4
     WHERE Product_ID = @id`,
    {
      id,
      not_sold:         bit("NotSold"),
      stock_date:       s("stock_date"),
      sale_start:       s("sale_start"),
      sale_end:         s("sale_end"),
      sku:              s("SKU"),
      upc:              s("UPC"),
      alu:              s("ALU"),
      availability:     s("availability"),
      num_in_stock:     iopt("NumInStock"),
      min_order:        iopt("min_order"),
      mult_min:         bit("mult_min"),
      prep_days:        iopt("prep_days"),
      reorder:          iopt("reorder_level"),
      base_price:       parseFloat(s("Base_Price") ?? "0") || 0,
      retail_price:     nopt("Retail_Price"),
      map_price:        nopt("MAP_Price"),
      wholesale:        nopt("Wholesale"),
      unit_desc:        s("Unit_Desc"),
      show_price:       data.get("ShowPrice") === "N" ? "N" : "Y",
      show_price_range: data.get("showPriceRange") === "Y" ? "Y" : "N",
      show_quantity:    iopt("showquantity") ?? 0,
      subscription:     bit("subscription"),
      sub_discount:     nopt("subscription_discount"),
      show_discounts:   bit("showDiscounts"),
      show_promotions:  bit("ShowPromotions"),
      vendor_sku:       s("Vendor_SKU"),
      dropship_cost:    nopt("dropship_cost"),
      dropship_note:    s("DropShip_Note"),
      shipping:         bit("shipping"),
      shipping_quote:   bit("shipping_quote"),
      weight:           nopt("Weight"),
      item_handling:    nopt("Item_Handling"),
      freight_dom:      nopt("freight_dom"),
      freight_intl:     nopt("freight_intl"),
      add_handling:     bit("Add_Additional_Handling"),
      giftwrap:         bit("Giftwrap"),
      pack_length:      nopt("Pack_Length"),
      pack_width:       nopt("Pack_Width"),
      pack_height:      nopt("Pack_Height"),
      weight2:          nopt("Weight2"),
      pack_length2:     nopt("Pack_Length2"),
      pack_width2:      nopt("Pack_Width2"),
      pack_height2:     nopt("Pack_Height2"),
      weight3:          nopt("Weight3"),
      pack_length3:     nopt("Pack_Length3"),
      pack_width3:      nopt("Pack_Width3"),
      pack_height3:     nopt("Pack_Height3"),
      weight4:          nopt("Weight4"),
      pack_length4:     nopt("Pack_Length4"),
      pack_width4:      nopt("Pack_Width4"),
      pack_height4:     nopt("Pack_Height4"),
    } as Record<string, string | number | null>
  );
}

// ─── Images ───────────────────────────────────────────────────────────────────

export interface ProductImage {
  Image_ID: number;
  Product_ID: number;
  filename: string | null;
  Original: string | null;
  sm_image: string | null;
  md_image: string | null;
  lg_image: string | null;
  priority: number;
  caption: string | null;
  Gallery: boolean;
}

export async function getProductImages(id: number): Promise<ProductImage[]> {
  return query<ProductImage>(
    `SELECT Image_ID, Product_ID, filename, Original, sm_image, md_image, lg_image, priority, caption, Gallery
     FROM   Product_Images WHERE Product_ID = @id
     ORDER  BY priority ASC, Image_ID ASC`,
    { id }
  );
}

export async function updateProductImage(imageId: number, caption: string | null, priority: number, gallery: boolean): Promise<void> {
  await query(
    `UPDATE Product_Images SET caption=@caption, priority=@priority, Gallery=@gallery WHERE Image_ID=@imageId`,
    { imageId, caption, priority, gallery: gallery ? 1 : 0 } as Record<string, string | number | null>
  );
}

export async function addProductImage(productId: number, filename: string, priority: number, caption: string | null, gallery: boolean): Promise<void> {
  await query(
    `INSERT INTO Product_Images (Product_ID, filename, Original, sm_image, md_image, lg_image, priority, caption, Gallery)
     VALUES (@productId, @filename, @filename, @filename, @filename, @filename, @priority, @caption, @gallery)`,
    { productId, filename, priority, caption, gallery: gallery ? 1 : 0 } as Record<string, string | number | null>
  );
}

export async function deleteProductImage(imageId: number): Promise<void> {
  await query(`DELETE FROM Product_Images WHERE Image_ID = @imageId`, { imageId });
}

export interface ProductVideo {
  Video_Id: number;
  Product_ID: number;
  Name: string | null;
  video_external: string | null;
  video_mp4: string | null;
  Priority: number;
  Description: string | null;
}

export async function getProductVideos(id: number): Promise<ProductVideo[]> {
  return query<ProductVideo>(
    `SELECT Video_Id, Product_ID, Name, video_external, video_mp4, Priority, Description
     FROM   Product_Videos WHERE Product_ID = @id ORDER BY Priority ASC`,
    { id }
  );
}

export async function addProductVideo(productId: number, data: {
  name: string; external: string; mp4: string; priority: number; description: string;
}): Promise<void> {
  await query(
    `INSERT INTO Product_Videos (Product_ID, Name, video_external, video_mp4, Priority, Description)
     VALUES (@productId, @name, @external, @mp4, @priority, @description)`,
    { productId, ...data } as Record<string, string | number | null>
  );
}

export async function deleteProductVideo(videoId: number): Promise<void> {
  await query(`DELETE FROM Product_Videos WHERE Video_Id = @videoId`, { videoId });
}

// ─── Files ────────────────────────────────────────────────────────────────────

export const FILE_CATEGORIES: Record<number, string> = {
  1: "Download",
  2: "Manual",
  3: "Design Drawings",
  4: "Spec Image",
  5: "Price List",
};

export interface ProductFile {
  file_id: number;
  Product_ID: number;
  filename: string | null;
  filepath: string | null;
  category_id: number;
  description: string | null;
  priority: number;
}

export async function getProductFiles(id: number): Promise<ProductFile[]> {
  return query<ProductFile>(
    `SELECT file_id, Product_ID, filename, filepath, category_id, description, priority
     FROM   Product_Files WHERE Product_ID = @id
     ORDER  BY priority ASC, file_id ASC`,
    { id }
  );
}

export async function addProductFile(productId: number, filename: string, categoryId: number, description: string | null, priority: number): Promise<void> {
  await query(
    `INSERT INTO Product_Files (Product_ID, filename, filepath, category_id, description, priority)
     VALUES (@productId, @filename, @filename, @categoryId, @description, @priority)`,
    { productId, filename, categoryId, description, priority } as Record<string, string | number | null>
  );
}

export async function updateProductFile(fileId: number, categoryId: number, description: string | null, priority: number): Promise<void> {
  await query(
    `UPDATE Product_Files SET category_id=@categoryId, description=@description, priority=@priority WHERE file_id=@fileId`,
    { fileId, categoryId, description, priority } as Record<string, string | number | null>
  );
}

export async function deleteProductFile(fileId: number): Promise<void> {
  await query(`DELETE FROM Product_Files WHERE file_id = @fileId`, { fileId });
}

// ─── Group Prices ─────────────────────────────────────────────────────────────

export interface GroupPrice {
  GrpPrice_ID: number;
  Group_ID: number;
  GroupName: string;
  Price: number;
}

export async function getGroupPrices(productId: number): Promise<GroupPrice[]> {
  return query<GroupPrice>(
    `SELECT gp.GrpPrice_ID, gp.Group_ID, g.Name AS GroupName, gp.Price
     FROM   ProdGrpPrice gp
     JOIN   Groups g ON g.Group_ID = gp.Group_ID
     WHERE  gp.Product_ID = @productId
     ORDER  BY g.Name`,
    { productId }
  );
}

export async function getAvailableGroups(productId: number): Promise<{ Group_ID: number; Name: string }[]> {
  return query<{ Group_ID: number; Name: string }>(
    `SELECT g.Group_ID, g.Name
     FROM   Groups g
     WHERE  g.Group_ID NOT IN (SELECT Group_ID FROM ProdGrpPrice WHERE Product_ID = @productId)
     ORDER  BY g.Name`,
    { productId }
  );
}

export async function addGroupPrice(productId: number, groupId: number, price: number): Promise<void> {
  await query(
    `INSERT INTO ProdGrpPrice (Product_ID, Group_ID, Price) VALUES (@productId, @groupId, @price)`,
    { productId, groupId, price }
  );
}

export async function updateGroupPrice(grpPriceId: number, price: number): Promise<void> {
  await query(`UPDATE ProdGrpPrice SET Price=@price WHERE GrpPrice_ID=@grpPriceId`, { grpPriceId, price });
}

export async function deleteGroupPrice(grpPriceId: number): Promise<void> {
  await query(`DELETE FROM ProdGrpPrice WHERE GrpPrice_ID = @grpPriceId`, { grpPriceId });
}

// ─── Qty Discounts ────────────────────────────────────────────────────────────

export interface QtyDiscount {
  ProdDisc_ID: number;
  Wholesale: boolean;
  QuantFrom: number;
  QuantTo: number;
  DiscountPer: number;
  Display: boolean;
  Type: boolean;  // false = Discount Per, true = Price Per
}

export async function getQtyDiscounts(productId: number): Promise<QtyDiscount[]> {
  return query<QtyDiscount>(
    `SELECT ProdDisc_ID, Wholesale, QuantFrom, QuantTo, DiscountPer, Display, Type
     FROM   ProdDisc WHERE Product_ID = @productId
     ORDER  BY Wholesale ASC, QuantFrom ASC`,
    { productId }
  );
}

export async function addQtyDiscount(productId: number, data: {
  wholesale: boolean; quantFrom: number; quantTo: number;
  discountPer: number; display: boolean; type: boolean;
}): Promise<void> {
  await query(
    `INSERT INTO ProdDisc (Product_ID, Wholesale, QuantFrom, QuantTo, DiscountPer, Display, Type)
     VALUES (@productId, @wholesale, @quantFrom, @quantTo, @discountPer, @display, @type)`,
    {
      productId,
      wholesale:   data.wholesale ? 1 : 0,
      quantFrom:   data.quantFrom,
      quantTo:     data.quantTo,
      discountPer: data.discountPer,
      display:     data.display ? 1 : 0,
      type:        data.type ? 1 : 0,
    }
  );
}

export async function deleteQtyDiscount(discId: number): Promise<void> {
  await query(`DELETE FROM ProdDisc WHERE ProdDisc_ID = @discId`, { discId });
}

// ─── Options ──────────────────────────────────────────────────────────────────

export interface AssignedOption {
  ProdOpt_ID: number;
  Opt_ID: number;
  Opt_Name: string;
  Display_Style: string | null;
  Required: boolean;
  ChoiceCount: number;
  IsStandard: boolean;
  Std_ID: number | null;
}

export async function getProductOptions(productId: number): Promise<AssignedOption[]> {
  return query<AssignedOption>(
    `SELECT po.ProdOpt_ID, o.Opt_ID, o.Opt_Name, o.Display_Style, o.Required,
            (SELECT COUNT(*) FROM ProdOpt_Choices WHERE Opt_ID = o.Opt_ID) AS ChoiceCount,
            CASE WHEN po.Std_ID IS NOT NULL THEN 1 ELSE 0 END AS IsStandard,
            po.Std_ID
     FROM   Product_Options po
     JOIN   Prod_Options o ON o.Opt_ID = po.Opt_ID
     WHERE  po.Product_ID = @productId
     ORDER  BY o.Priority, o.Opt_Name`,
    { productId }
  );
}

export async function getUnassignedStdOptions(productId: number): Promise<{ Std_ID: number; Std_Name: string }[]> {
  return query<{ Std_ID: number; Std_Name: string }>(
    `SELECT s.Std_ID, s.Std_Name
     FROM   StdOptions s
     WHERE  s.Std_ID NOT IN (SELECT Std_ID FROM Product_Options WHERE Product_ID = @productId AND Std_ID IS NOT NULL)
       AND  s.Std_Display = 1
     ORDER  BY s.Std_Name`,
    { productId }
  );
}

export async function removeProductOption(prodOptId: number): Promise<void> {
  await query(`DELETE FROM Product_Options WHERE ProdOpt_ID = @prodOptId`, { prodOptId });
}

// ─── Addons ───────────────────────────────────────────────────────────────────

export interface AssignedAddon {
  ProdAddon_ID: number;
  Addon_ID: number;
  Addon_Name: string;
  Std_Type: string | null;
  Std_Price: number;
  IsStandard: boolean;
  Std_ID: number | null;
}

export async function getProductAddons(productId: number): Promise<AssignedAddon[]> {
  return query<AssignedAddon>(
    `SELECT pa.ProdAddon_ID, a.Addon_ID, a.Addon_Name, a.Std_Type, a.Std_Price,
            CASE WHEN pa.Standard_ID IS NOT NULL THEN 1 ELSE 0 END AS IsStandard,
            pa.Standard_ID AS Std_ID
     FROM   ProdAddons pa
     JOIN   Prod_Addons a ON a.Addon_ID = pa.Addon_ID
     WHERE  pa.Product_ID = @productId
     ORDER  BY a.Addon_Name`,
    { productId }
  );
}

export async function getUnassignedStdAddons(productId: number): Promise<{ Std_ID: number; Std_Name: string }[]> {
  return query<{ Std_ID: number; Std_Name: string }>(
    `SELECT s.Std_ID, s.Std_Name
     FROM   StdAddons s
     WHERE  s.Std_ID NOT IN (SELECT Standard_ID FROM ProdAddons WHERE Product_ID = @productId AND Standard_ID IS NOT NULL)
       AND  s.Std_Display = 1
     ORDER  BY s.Std_Name`,
    { productId }
  );
}

export async function removeProductAddon(prodAddonId: number): Promise<void> {
  await query(`DELETE FROM ProdAddons WHERE ProdAddon_ID = @prodAddonId`, { prodAddonId });
}

// ─── Related Products ─────────────────────────────────────────────────────────

export interface RelatedProduct {
  Item_ID: number;
  Name: string;
  SKU: string | null;
  Display: boolean;
}

export async function getRelatedProducts(productId: number): Promise<RelatedProduct[]> {
  return query<RelatedProduct>(
    `SELECT p.Product_ID AS Item_ID, p.Name, p.SKU, p.Display
     FROM   Product_Item pi
     JOIN   Products p ON p.Product_ID = pi.Item_ID
     WHERE  pi.Product_ID = @productId
     ORDER  BY p.Name`,
    { productId }
  );
}

export async function searchProductsForRelated(productId: number, name: string, sku: string): Promise<{ Product_ID: number; Name: string; SKU: string | null; Display: boolean }[]> {
  const conditions = [
    "Product_ID != @productId",
    "Product_ID NOT IN (SELECT Item_ID FROM Product_Item WHERE Product_ID = @productId)",
  ];
  const params: Record<string, string | number> = { productId };
  if (name) { conditions.push("Name LIKE '%' + @name + '%'"); params.name = name; }
  if (sku)  { conditions.push("SKU  LIKE @sku + '%'");        params.sku  = sku; }
  return query<{ Product_ID: number; Name: string; SKU: string | null; Display: boolean }>(
    `SELECT TOP 40 Product_ID, Name, SKU, Display FROM Products
     WHERE ${conditions.join(" AND ")} ORDER BY Name`,
    params
  );
}

export async function addRelatedProduct(productId: number, itemId: number): Promise<void> {
  await query(
    `IF NOT EXISTS (SELECT 1 FROM Product_Item WHERE Product_ID=@productId AND Item_ID=@itemId)
     INSERT INTO Product_Item (Product_ID, Item_ID) VALUES (@productId, @itemId)`,
    { productId, itemId }
  );
}

export async function removeRelatedProduct(productId: number, itemId: number): Promise<void> {
  await query(`DELETE FROM Product_Item WHERE Product_ID=@productId AND Item_ID=@itemId`, { productId, itemId });
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────

export interface InfoFields {
  Product_ID: number;
  Google_Category: string | null;
  Google_Brand: string | null;
  Google_Condition: string | null;
  Google_Gender: string | null;
  Google_Age_Group: string | null;
  ProdType_ID: number | null;
}

export async function getInfoFields(id: number): Promise<InfoFields | null> {
  const rows = await query<InfoFields>(
    `SELECT Product_ID, Google_Category, Google_Brand, Google_Condition,
            Google_Gender, Google_Age_Group, ProdType_ID
     FROM   Products WHERE Product_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function saveInfoFields(id: number, data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  await query(
    `UPDATE Products SET
       Google_Category   = @google_cat,
       Google_Brand      = @google_brand,
       Google_Condition  = @google_cond,
       Google_Gender     = @google_gender,
       Google_Age_Group  = @google_age
     WHERE Product_ID = @id`,
    {
      id,
      google_cat:    s("google_category"),
      google_brand:  s("google_brand"),
      google_cond:   s("google_condition"),
      google_gender: s("google_gender"),
      google_age:    s("google_age_group"),
    } as Record<string, string | number | null>
  );
}

export interface CustomFieldValue {
  Custom_ID: number;
  Custom_Name: string | null;
  Custom_Display: boolean;
  CustomInfo: string | null;
}

export async function getCustomFieldValues(productId: number): Promise<CustomFieldValue[]> {
  return query<CustomFieldValue>(
    `SELECT cf.Custom_ID, cf.Custom_Name, cf.Custom_Display, ci.CustomInfo
     FROM   Prod_CustomFields cf
     LEFT JOIN Prod_CustInfo ci ON ci.Custom_ID = cf.Custom_ID AND ci.Product_ID = @productId
     ORDER  BY cf.Custom_ID`,
    { productId }
  );
}

export async function saveCustomFieldValues(productId: number, values: { customId: number; value: string }[]): Promise<void> {
  for (const v of values) {
    const exists = await query<{ c: number }>(
      `SELECT COUNT(*) AS c FROM Prod_CustInfo WHERE Product_ID=@productId AND Custom_ID=@customId`,
      { productId, customId: v.customId }
    );
    if (exists[0].c > 0) {
      await query(
        `UPDATE Prod_CustInfo SET CustomInfo=@value WHERE Product_ID=@productId AND Custom_ID=@customId`,
        { productId, customId: v.customId, value: v.value || null } as Record<string, string | number | null>
      );
    } else {
      await query(
        `INSERT INTO Prod_CustInfo (Product_ID, Custom_ID, CustomInfo) VALUES (@productId, @customId, @value)`,
        { productId, customId: v.customId, value: v.value || null } as Record<string, string | number | null>
      );
    }
  }
}

export interface SpecValue {
  ProdTypeSpec_ID: number;
  Name: string;
  IsTitle: boolean;
  Priority: number;
  SpecValue: string | null;
}

export async function getProductTypeSpecs(productId: number): Promise<SpecValue[]> {
  return query<SpecValue>(
    `SELECT s.ProdTypeSpec_ID, s.Name, s.IsTitle, s.Priority,
            sp.SpecValue
     FROM   prodtypespecs s
     JOIN   Products p ON p.ProdType_ID = s.ProdType_ID AND p.Product_ID = @productId
     LEFT JOIN prodtypespec_product sp ON sp.ProdTypeSpec_ID = s.ProdTypeSpec_ID AND sp.Product_ID = @productId
     ORDER  BY s.Priority, s.Name`,
    { productId }
  );
}

export async function saveSpecValues(productId: number, values: { specId: number; value: string }[]): Promise<void> {
  for (const v of values) {
    const exists = await query<{ c: number }>(
      `SELECT COUNT(*) AS c FROM prodtypespec_product WHERE Product_ID=@productId AND ProdTypeSpec_ID=@specId`,
      { productId, specId: v.specId }
    );
    if (exists[0].c > 0) {
      await query(
        `UPDATE prodtypespec_product SET SpecValue=@value WHERE Product_ID=@productId AND ProdTypeSpec_ID=@specId`,
        { productId, specId: v.specId, value: v.value || null } as Record<string, string | number | null>
      );
    } else {
      await query(
        `INSERT INTO prodtypespec_product (Product_ID, ProdTypeSpec_ID, SpecValue) VALUES (@productId, @specId, @value)`,
        { productId, specId: v.specId, value: v.value || null } as Record<string, string | number | null>
      );
    }
  }
}

// ─── Display Tab Support Queries ──────────────────────────────────────────────

export interface CategoryPicklistRow {
  Category_ID: number;
  Name: string;
  FullPath: string;
}

export async function getCategoryPicklist(): Promise<CategoryPicklistRow[]> {
  // 3-level self-join to build breadcrumb path; covers most category trees
  return query<CategoryPicklistRow>(`
    SELECT c.Category_ID, c.Name,
      CASE
        WHEN gp.Name IS NOT NULL THEN gp.Name + ' \u00bb ' + p.Name + ' \u00bb ' + c.Name
        WHEN p.Name  IS NOT NULL THEN p.Name + ' \u00bb ' + c.Name
        ELSE c.Name
      END AS FullPath
    FROM Categories c
    LEFT JOIN Categories p  ON p.Category_ID  = c.Parent_ID AND c.Parent_ID > 0
    LEFT JOIN Categories gp ON gp.Category_ID = p.Parent_ID AND p.Parent_ID > 0
    ORDER BY FullPath
  `);
}

export interface ManufacturerRow {
  account_id: number;
  Account_name: string;
}

export async function getManufacturers(): Promise<ManufacturerRow[]> {
  return query<ManufacturerRow>(
    `SELECT account_id, Account_name FROM Accounts WHERE Type1 = 'manufacturer' ORDER BY Account_name`
  );
}

export interface ProductTypeRow {
  ProdType_ID: number;
  TypeName: string;
}

export async function getProductTypes(): Promise<ProductTypeRow[]> {
  return query<ProductTypeRow>(
    `SELECT ProdType_ID, TypeName FROM ProdTypes ORDER BY TypeName`
  );
}

export async function getProductCategoryIds(productId: number): Promise<number[]> {
  const rows = await query<{ Category_ID: number }>(
    `SELECT Category_ID FROM Product_Category WHERE Product_ID = @productId`,
    { productId }
  );
  return rows.map(r => r.Category_ID);
}

export async function saveProductCategories(productId: number, newIds: number[]): Promise<void> {
  await query(`DELETE FROM Product_Category WHERE Product_ID = @productId`, { productId });
  for (const catId of newIds) {
    await query(
      `INSERT INTO Product_Category (Product_ID, Category_ID) VALUES (@productId, @catId)`,
      { productId, catId } as Record<string, number>
    );
  }
}
