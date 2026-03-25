import { query } from "../db";

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Discount {
  Discount_ID: number;
  Type1:       number; // 1=single-item, 2=multi-item
  Type2:       number; // 1=$ off, 2=% off
  Type3:       number; // 0=product, 1=category, 3=storewide, 4=order, 5=shipping
  Type4:       number; // 0=by # items, 1=by $ amount spent
  Type5:       number; // 0=all users, 1=groups only
  Name:        string;
  Display:     string;
  Coup_Code:   string;
  OneTime:     boolean;
  AccessKey:   number;
  StartDate:   Date | null;
  EndDate:     Date | null;
  Amount:      number;
  MinOrder:    number;
  MaxOrder:    number;
}

export interface DiscountProduct  { Product_ID: number; Name: string; SKU: string; }
export interface DiscountCategory { Category_ID: number; Name: string; ParentNames: string; }
export interface DiscountGroup    { Group_ID: number; Name: string; }

export interface ProductResult  { Product_ID: number; Name: string; SKU: string; }
export interface CategoryResult { Category_ID: number; Name: string; ParentNames: string; }

// ── Helpers ───────────────────────────────────────────────────────────────────

export const TYPE3_LABELS: Record<number, string> = {
  0: "Product",
  1: "Category",
  3: "Storewide",
  4: "Order",
  5: "Shipping",
};

export function discountStatus(d: Pick<Discount, "StartDate" | "EndDate">): "active" | "scheduled" | "expired" {
  const now = Date.now();
  if (d.EndDate && new Date(d.EndDate).getTime() < now)     return "expired";
  if (d.StartDate && new Date(d.StartDate).getTime() > now) return "scheduled";
  return "active";
}

// ── List ──────────────────────────────────────────────────────────────────────

export interface DiscountFilters {
  name?:     string;
  coupCode?: string;
  current?:  "current" | "scheduled" | "expired" | "";
}

export async function getDiscounts(filters: DiscountFilters = {}): Promise<Discount[]> {
  const conds: string[] = ["1 = 1"];
  const params: Record<string, unknown> = {};

  if (filters.name?.trim()) {
    conds.push("D.Name LIKE @name");
    params["name"] = `%${filters.name.trim()}%`;
  }
  if (filters.coupCode?.trim()) {
    conds.push("D.Coup_Code LIKE @coupCode");
    params["coupCode"] = `%${filters.coupCode.trim().toUpperCase()}%`;
  }
  if (filters.current === "current") {
    conds.push("(D.EndDate >= GETDATE() OR D.EndDate IS NULL)");
  } else if (filters.current === "expired") {
    conds.push("D.EndDate < GETDATE()");
  } else if (filters.current === "scheduled") {
    conds.push("D.StartDate > GETDATE()");
  }

  const where = conds.join(" AND ");

  return query<Discount>(`
    SELECT Discount_ID, Type1, Type2, Type3, Type4, Type5,
           Name, COALESCE(Display,'') AS Display,
           COALESCE(Coup_Code,'') AS Coup_Code,
           OneTime, COALESCE(AccessKey,0) AS AccessKey,
           StartDate, EndDate, Amount, MinOrder, MaxOrder
    FROM Discounts D
    WHERE ${where}
    ORDER BY D.Name, D.MinOrder
  `, params);
}

// ── Single ────────────────────────────────────────────────────────────────────

export async function getDiscount(id: number): Promise<Discount | null> {
  const rows = await query<Discount>(`
    SELECT TOP 1 Discount_ID, Type1, Type2, Type3, Type4, Type5,
           Name, COALESCE(Display,'') AS Display,
           COALESCE(Coup_Code,'') AS Coup_Code,
           OneTime, COALESCE(AccessKey,0) AS AccessKey,
           StartDate, EndDate, Amount, MinOrder, MaxOrder
    FROM Discounts
    WHERE Discount_ID = @id
  `, { id });
  return rows[0] ?? null;
}

// ── Create ────────────────────────────────────────────────────────────────────

export interface DiscountWrite {
  Type1:     number;
  Type2:     number;
  Type3:     number;
  Type4:     number;
  Type5:     number;
  Name:      string;
  Display:   string;
  Coup_Code: string;
  OneTime:   boolean;
  AccessKey: number;
  StartDate: string | null; // YYYY-MM-DD or null
  EndDate:   string | null;
  Amount:    number;
  MinOrder:  number;
  MaxOrder:  number | null; // null → 999999999
}

export async function createDiscount(d: DiscountWrite): Promise<number> {
  const rows = await query<{ newId: number }>(`
    INSERT INTO Discounts
      (Type1, Type2, Type3, Type4, Type5, Coup_Code, OneTime, AccessKey,
       Name, Display, Amount, MinOrder, MaxOrder, StartDate, EndDate)
    VALUES
      (@type1, @type2, @type3, @type4, @type5, @coupCode, @oneTime, @accessKey,
       @name, @display, @amount, @minOrder, @maxOrder,
       ${d.StartDate ? "@startDate" : "NULL"},
       ${d.EndDate   ? "@endDate"   : "NULL"});
    SELECT CAST(SCOPE_IDENTITY() AS INT) AS newId
  `, {
    type1:     d.Type1,
    type2:     d.Type2,
    type3:     d.Type3,
    type4:     d.Type4,
    type5:     d.Type5,
    coupCode:  d.Coup_Code.toUpperCase(),
    oneTime:   d.OneTime ? 1 : 0,
    accessKey: d.AccessKey,
    name:      d.Name,
    display:   d.Display || d.Name,
    amount:    d.Amount,
    minOrder:  d.MinOrder,
    maxOrder:  d.MaxOrder ?? 999999999,
    ...(d.StartDate ? { startDate: d.StartDate } : {}),
    ...(d.EndDate   ? { endDate:   d.EndDate   } : {}),
  });
  return rows[0]?.newId ?? 0;
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateDiscount(id: number, d: Omit<DiscountWrite, "Type3">): Promise<void> {
  await query(`
    UPDATE Discounts SET
      Type1     = @type1,
      Type2     = @type2,
      Type4     = @type4,
      Type5     = @type5,
      Coup_Code = @coupCode,
      OneTime   = @oneTime,
      AccessKey = @accessKey,
      Name      = @name,
      Display   = @display,
      Amount    = @amount,
      MinOrder  = @minOrder,
      MaxOrder  = @maxOrder,
      StartDate = ${d.StartDate ? "@startDate" : "NULL"},
      EndDate   = ${d.EndDate   ? "@endDate"   : "NULL"}
    WHERE Discount_ID = @id
  `, {
    id,
    type1:     d.Type1,
    type2:     d.Type2,
    type4:     d.Type4,
    type5:     d.Type5,
    coupCode:  d.Coup_Code.toUpperCase(),
    oneTime:   d.OneTime ? 1 : 0,
    accessKey: d.AccessKey,
    name:      d.Name,
    display:   d.Display || d.Name,
    amount:    d.Amount,
    minOrder:  d.MinOrder,
    maxOrder:  d.MaxOrder ?? 999999999,
    ...(d.StartDate ? { startDate: d.StartDate } : {}),
    ...(d.EndDate   ? { endDate:   d.EndDate   } : {}),
  });

  // If changed to all-users, clear groups
  if (d.Type5 === 0) {
    await query(`DELETE FROM Discount_Groups WHERE Discount_ID = @id`, { id });
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteDiscount(id: number): Promise<void> {
  await query(`DELETE FROM Discount_Products    WHERE Discount_ID = @id`, { id });
  await query(`DELETE FROM Discount_Categories  WHERE Discount_ID = @id`, { id });
  await query(`DELETE FROM Discount_Groups      WHERE Discount_ID = @id`, { id });
  await query(`DELETE FROM Discounts            WHERE Discount_ID = @id`, { id });
}

// ── Related: Products ─────────────────────────────────────────────────────────

export async function getDiscountProducts(discountId: number): Promise<DiscountProduct[]> {
  return query<DiscountProduct>(`
    SELECT P.Product_ID, P.Name, COALESCE(P.SKU,'') AS SKU
    FROM Discount_Products DP
    JOIN Products P ON P.Product_ID = DP.Product_ID
    WHERE DP.Discount_ID = @discountId
    ORDER BY P.Name
  `, { discountId });
}

export async function addDiscountProduct(discountId: number, productId: number): Promise<void> {
  await query(`
    IF NOT EXISTS (SELECT 1 FROM Discount_Products WHERE Discount_ID=@discountId AND Product_ID=@productId)
      INSERT INTO Discount_Products (Discount_ID, Product_ID) VALUES (@discountId, @productId)
  `, { discountId, productId });
}

export async function removeDiscountProduct(discountId: number, productId: number): Promise<void> {
  await query(`DELETE FROM Discount_Products WHERE Discount_ID=@discountId AND Product_ID=@productId`, { discountId, productId });
}

// ── Related: Categories ───────────────────────────────────────────────────────

export async function getDiscountCategories(discountId: number): Promise<DiscountCategory[]> {
  return query<DiscountCategory>(`
    SELECT C.Category_ID, C.Name, COALESCE(C.ParentNames,'') AS ParentNames
    FROM Discount_Categories DC
    JOIN Categories C ON C.Category_ID = DC.Category_ID
    WHERE DC.Discount_ID = @discountId
    ORDER BY C.Name
  `, { discountId });
}

export async function addDiscountCategory(discountId: number, categoryId: number): Promise<void> {
  await query(`
    IF NOT EXISTS (SELECT 1 FROM Discount_Categories WHERE Discount_ID=@discountId AND Category_ID=@categoryId)
      INSERT INTO Discount_Categories (Discount_ID, Category_ID) VALUES (@discountId, @categoryId)
  `, { discountId, categoryId });
}

export async function removeDiscountCategory(discountId: number, categoryId: number): Promise<void> {
  await query(`DELETE FROM Discount_Categories WHERE Discount_ID=@discountId AND Category_ID=@categoryId`, { discountId, categoryId });
}

// ── Related: Groups ───────────────────────────────────────────────────────────

export async function getDiscountGroups(discountId: number): Promise<DiscountGroup[]> {
  return query<DiscountGroup>(`
    SELECT G.Group_ID, G.Name
    FROM Discount_Groups DG
    JOIN Groups G ON G.Group_ID = DG.Group_ID
    WHERE DG.Discount_ID = @discountId
    ORDER BY G.Name
  `, { discountId });
}

export async function addDiscountGroup(discountId: number, groupId: number): Promise<void> {
  await query(`
    IF NOT EXISTS (SELECT 1 FROM Discount_Groups WHERE Discount_ID=@discountId AND Group_ID=@groupId)
      INSERT INTO Discount_Groups (Discount_ID, Group_ID) VALUES (@discountId, @groupId)
  `, { discountId, groupId });
}

export async function removeDiscountGroup(discountId: number, groupId: number): Promise<void> {
  await query(`DELETE FROM Discount_Groups WHERE Discount_ID=@discountId AND Group_ID=@groupId`, { discountId, groupId });
}

// ── Search helpers ────────────────────────────────────────────────────────────

export async function searchProducts(term: string): Promise<ProductResult[]> {
  return query<ProductResult>(`
    SELECT TOP 30 Product_ID, Name, COALESCE(SKU,'') AS SKU
    FROM Products
    WHERE (Name LIKE @term OR SKU LIKE @term) AND Display = 1
    ORDER BY Name
  `, { term: `%${term}%` });
}

export async function searchCategories(term: string): Promise<CategoryResult[]> {
  return query<CategoryResult>(`
    SELECT TOP 30 Category_ID, Name, COALESCE(ParentNames,'') AS ParentNames
    FROM Categories
    WHERE Name LIKE @term
    ORDER BY Name
  `, { term: `%${term}%` });
}

export async function getAllGroups(): Promise<DiscountGroup[]> {
  return query<DiscountGroup>(`
    SELECT Group_ID, Name FROM Groups ORDER BY Name
  `, {});
}
