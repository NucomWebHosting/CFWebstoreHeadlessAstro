import { query } from "../db";

// ─── Pricing Tab ──────────────────────────────────────────────────────────────

export interface PricingFields {
  Product_ID: number;
  Sale_Start: Date | null;
  Sale_End: Date | null;
  Min_Order: number | null;
  Mult_Min: boolean;
  Prep_days: number | null;
  reorder_level: number | null;
  Pack_Length: number | null;
  Pack_Width: number | null;
  Pack_Height: number | null;
  Shipping: number | null;
}

export async function getPricingFields(id: number): Promise<PricingFields | null> {
  const rows = await query<PricingFields>(
    `SELECT Product_ID, Sale_Start, Sale_End, Min_Order, Mult_Min,
            Prep_days, reorder_level, Pack_Length, Pack_Width, Pack_Height, Shipping
     FROM   Products WHERE Product_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function updatePricingFields(id: number, data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  const nopt = (k: string) => { const v = s(k); return v ? (parseFloat(v) || null) : null; };
  const iopt = (k: string) => { const v = s(k); return v ? (parseInt(v) || null) : null; };
  await query(
    `UPDATE Products SET
       Sale_Start    = @sale_start,
       Sale_End      = @sale_end,
       Min_Order     = @min_order,
       Mult_Min      = @req_mult,
       Prep_days     = @prep_days,
       reorder_level = @reorder,
       Pack_Length   = @pack_length,
       Pack_Width    = @pack_width,
       Pack_Height   = @pack_height,
       Shipping      = @shipping
     WHERE Product_ID = @id`,
    {
      id,
      sale_start:  s("sale_start"),
      sale_end:    s("sale_end"),
      min_order:   iopt("min_qty"),
      req_mult:    data.get("req_mult") === "1" ? 1 : 0,
      prep_days:   iopt("prep_days"),
      reorder:     iopt("reorder"),
      pack_length: nopt("pack_length"),
      pack_width:  nopt("pack_width"),
      pack_height: nopt("pack_height"),
      shipping:    nopt("shipping"),
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
