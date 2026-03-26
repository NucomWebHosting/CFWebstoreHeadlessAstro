import { query } from "../db";

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
    `SELECT po.Option_ID AS ProdOpt_ID, po.Option_ID AS Opt_ID,
            COALESCE(so.Std_Prompt, po.Prompt) AS Opt_Name,
            po.Display AS Display_Style, po.Required,
            (SELECT COUNT(*) FROM ProdOpt_Choices WHERE Option_ID = po.Option_ID) AS ChoiceCount,
            CASE WHEN po.Std_ID IS NOT NULL AND po.Std_ID > 0 THEN 1 ELSE 0 END AS IsStandard,
            po.Std_ID
     FROM   Product_Options po
     LEFT JOIN StdOptions so ON so.Std_ID = po.Std_ID
     WHERE  po.Product_ID = @productId
     ORDER  BY po.Priority, po.Option_ID`,
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
    `SELECT pa.Addon_ID AS ProdAddon_ID, pa.Addon_ID,
            COALESCE(sa.Std_Prompt, pa.Prompt) AS Addon_Name,
            COALESCE(sa.Std_Type, pa.AddonType) AS Std_Type,
            pa.Price AS Std_Price,
            CASE WHEN pa.Standard_ID IS NOT NULL AND pa.Standard_ID > 0 THEN 1 ELSE 0 END AS IsStandard,
            pa.Standard_ID AS Std_ID
     FROM   ProdAddons pa
     LEFT JOIN StdAddons sa ON sa.Std_ID = pa.Standard_ID
     WHERE  pa.Product_ID = @productId
     ORDER  BY pa.Priority, pa.Addon_ID`,
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
