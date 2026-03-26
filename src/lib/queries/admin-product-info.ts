import { query } from "../db";

// ─── Info Tab ─────────────────────────────────────────────────────────────────

export interface InfoFields {
  Product_ID: number;
  google_product_category: string | null;
  google_brand: string | null;
  google_condition: string | null;
  google_gender: string | null;
  google_age: string | null;
  ProdType_ID: number | null;
}

export async function getInfoFields(id: number): Promise<InfoFields | null> {
  const rows = await query<InfoFields>(
    `SELECT Product_ID, google_product_category, google_brand, google_condition,
            google_gender, google_age, ProdType_ID
     FROM   Products WHERE Product_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function saveInfoFields(id: number, data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  await query(
    `UPDATE Products SET
       google_product_category = @google_cat,
       google_brand            = @google_brand,
       google_condition        = @google_cond,
       google_gender           = @google_gender,
       google_age              = @google_age
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

// ─── Custom Fields ────────────────────────────────────────────────────────────

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

// ─── Product Type Specs ───────────────────────────────────────────────────────

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
    `SELECT account_id, Account_name FROM Account WHERE Type1 = 'manufacturer' ORDER BY Account_name`
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
