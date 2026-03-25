import { query } from "../db";

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Promotion {
  Promotion_ID:  number;
  Type1:         number; // 1=single-item, 2=cross-item, 3=multi-item, 4=order-based
  Type2:         number; // 1=$ off, 2=% off
  Type3:         number; // 0=qualify by # items, 1=qualify by $ spent
  Type4:         number; // 0=all users, 1=groups only
  Name:          string;
  Display:       string;
  Coup_Code:     string;
  OneTime:       boolean;
  AccessKey:     number;
  StartDate:     Date | null;
  EndDate:       Date | null;
  Amount:        number;
  QualifyNum:    number;
  QualifyNumMax: number; // 0 = no max
  DiscountNum:   number;
  Multiply:      boolean;
  Add_DiscProd:  boolean;
  Disc_Product:  number; // FK Products — 0 = none
  // joined
  ProdName:      string | null;
}

export interface PromoProduct { Product_ID: number; Name: string; SKU: string; }
export interface PromoGroup   { Group_ID: number;   Name: string; }

// ── Labels / helpers ──────────────────────────────────────────────────────────

export const TYPE1_LABELS: Record<number, string> = {
  1: "Single-item",
  2: "Cross-item",
  3: "Multi-item",
  4: "Order-based",
};

export const TYPE1_HINTS: Record<number, string> = {
  1: "Discount on the same qualifying product",
  2: "Discount on a different (discounted) product",
  3: "Group all qualifying products — discount on one product",
  4: "Qualify by order total — discount on one product",
};

export function promoStatus(p: Pick<Promotion, "StartDate" | "EndDate">): "active" | "scheduled" | "expired" {
  const now = Date.now();
  if (p.EndDate   && new Date(p.EndDate).getTime()   < now) return "expired";
  if (p.StartDate && new Date(p.StartDate).getTime() > now) return "scheduled";
  return "active";
}

/** Types 2, 3, 4 need a Disc_Product to be set */
export function needsDiscProduct(type1: number) { return type1 >= 2; }
/** Types 1, 2, 3 need qualifying products */
export function needsQualProducts(type1: number) { return type1 <= 3; }

// ── List ──────────────────────────────────────────────────────────────────────

export interface PromotionFilters {
  name?:    string;
  coupCode?: string;
  current?: "current" | "scheduled" | "expired" | "";
}

export async function getPromotions(filters: PromotionFilters = {}): Promise<Promotion[]> {
  const conds: string[] = ["1 = 1"];
  const params: Record<string, unknown> = {};

  if (filters.name?.trim()) {
    conds.push("P.Name LIKE @name");
    params["name"] = `%${filters.name.trim()}%`;
  }
  if (filters.coupCode?.trim()) {
    conds.push("P.Coup_Code LIKE @coupCode");
    params["coupCode"] = `%${filters.coupCode.trim().toUpperCase()}%`;
  }
  if (filters.current === "current")   conds.push("(P.EndDate >= GETDATE() OR P.EndDate IS NULL)");
  if (filters.current === "expired")   conds.push("P.EndDate < GETDATE()");
  if (filters.current === "scheduled") conds.push("P.StartDate > GETDATE()");

  return query<Promotion>(`
    SELECT P.Promotion_ID, P.Type1, P.Type2, P.Type3, P.Type4,
           P.Name, COALESCE(P.Display,'') AS Display,
           COALESCE(P.Coup_Code,'') AS Coup_Code,
           P.OneTime, COALESCE(P.AccessKey,0) AS AccessKey,
           P.StartDate, P.EndDate,
           P.Amount, P.QualifyNum, P.QualifyNumMax, P.DiscountNum,
           P.Multiply, P.Add_DiscProd,
           COALESCE(P.Disc_Product,0) AS Disc_Product,
           Pt.Name AS ProdName
    FROM Promotions P
    LEFT JOIN Products Pt ON Pt.Product_ID = P.Disc_Product
    WHERE ${conds.join(" AND ")}
    ORDER BY P.Name, P.QualifyNum
  `, params);
}

// ── Single ────────────────────────────────────────────────────────────────────

export async function getPromotion(id: number): Promise<Promotion | null> {
  const rows = await query<Promotion>(`
    SELECT TOP 1
           P.Promotion_ID, P.Type1, P.Type2, P.Type3, P.Type4,
           P.Name, COALESCE(P.Display,'') AS Display,
           COALESCE(P.Coup_Code,'') AS Coup_Code,
           P.OneTime, COALESCE(P.AccessKey,0) AS AccessKey,
           P.StartDate, P.EndDate,
           P.Amount, P.QualifyNum, P.QualifyNumMax, P.DiscountNum,
           P.Multiply, P.Add_DiscProd,
           COALESCE(P.Disc_Product,0) AS Disc_Product,
           Pt.Name AS ProdName
    FROM Promotions P
    LEFT JOIN Products Pt ON Pt.Product_ID = P.Disc_Product
    WHERE P.Promotion_ID = @id
  `, { id });
  return rows[0] ?? null;
}

// ── Write interfaces ──────────────────────────────────────────────────────────

export interface PromotionWrite {
  Type1:         number;
  Type2:         number;
  Type3:         number;
  Type4:         number;
  Name:          string;
  Display:       string;
  Coup_Code:     string;
  OneTime:       boolean;
  AccessKey:     number;
  StartDate:     string | null;
  EndDate:       string | null;
  Amount:        number;
  QualifyNum:    number;
  QualifyNumMax: number;
  DiscountNum:   number;
  Multiply:      boolean;
  Add_DiscProd:  boolean;
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createPromotion(d: PromotionWrite): Promise<number> {
  const rows = await query<{ newId: number }>(`
    INSERT INTO Promotions
      (Type1, Type2, Type3, Type4, Coup_Code, OneTime, AccessKey,
       Name, Display, Amount, QualifyNum, QualifyNumMax, DiscountNum,
       Multiply, Add_DiscProd,
       StartDate, EndDate, Disc_Product)
    VALUES
      (@type1, @type2, @type3, @type4, @coupCode, @oneTime, @accessKey,
       @name, @display, @amount, @qualifyNum, @qualifyNumMax, @discountNum,
       @multiply, @addDiscProd,
       ${d.StartDate ? "@startDate" : "NULL"},
       ${d.EndDate   ? "@endDate"   : "NULL"},
       0);
    SELECT CAST(SCOPE_IDENTITY() AS INT) AS newId
  `, {
    type1:        d.Type1,
    type2:        d.Type2,
    type3:        d.Type3,
    type4:        d.Type4,
    coupCode:     d.Coup_Code.toUpperCase(),
    oneTime:      d.OneTime ? 1 : 0,
    accessKey:    d.AccessKey,
    name:         d.Name,
    display:      d.Display || d.Name,
    amount:       d.Amount,
    qualifyNum:   d.QualifyNum,
    qualifyNumMax: d.QualifyNumMax,
    discountNum:  d.DiscountNum,
    multiply:     d.Multiply ? 1 : 0,
    addDiscProd:  d.Add_DiscProd ? 1 : 0,
    ...(d.StartDate ? { startDate: d.StartDate } : {}),
    ...(d.EndDate   ? { endDate:   d.EndDate   } : {}),
  });
  return rows[0]?.newId ?? 0;
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updatePromotion(id: number, d: PromotionWrite): Promise<void> {
  await query(`
    UPDATE Promotions SET
      Type1         = @type1,
      Type2         = @type2,
      Type3         = @type3,
      Type4         = @type4,
      Coup_Code     = @coupCode,
      OneTime       = @oneTime,
      AccessKey     = @accessKey,
      Name          = @name,
      Display       = @display,
      Amount        = @amount,
      QualifyNum    = @qualifyNum,
      QualifyNumMax = @qualifyNumMax,
      DiscountNum   = @discountNum,
      Multiply      = @multiply,
      Add_DiscProd  = @addDiscProd,
      StartDate     = ${d.StartDate ? "@startDate" : "NULL"},
      EndDate       = ${d.EndDate   ? "@endDate"   : "NULL"}
    WHERE Promotion_ID = @id
  `, {
    id,
    type1:        d.Type1,
    type2:        d.Type2,
    type3:        d.Type3,
    type4:        d.Type4,
    coupCode:     d.Coup_Code.toUpperCase(),
    oneTime:      d.OneTime ? 1 : 0,
    accessKey:    d.AccessKey,
    name:         d.Name,
    display:      d.Display || d.Name,
    amount:       d.Amount,
    qualifyNum:   d.QualifyNum,
    qualifyNumMax: d.QualifyNumMax,
    discountNum:  d.DiscountNum,
    multiply:     d.Multiply ? 1 : 0,
    addDiscProd:  d.Add_DiscProd ? 1 : 0,
    ...(d.StartDate ? { startDate: d.StartDate } : {}),
    ...(d.EndDate   ? { endDate:   d.EndDate   } : {}),
  });

  if (d.Type4 === 0) {
    await query(`DELETE FROM Promotion_Groups WHERE Promotion_ID = @id`, { id });
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deletePromotion(id: number): Promise<void> {
  await query(`DELETE FROM Promotion_Qual_Products WHERE Promotion_ID = @id`, { id });
  await query(`DELETE FROM Promotion_Groups         WHERE Promotion_ID = @id`, { id });
  await query(`DELETE FROM Promotions               WHERE Promotion_ID = @id`, { id });
}

// ── Disc_Product ──────────────────────────────────────────────────────────────

export async function setDiscProduct(promoId: number, productId: number): Promise<void> {
  await query(`UPDATE Promotions SET Disc_Product = @productId WHERE Promotion_ID = @promoId`, { promoId, productId });
}

// ── Qualifying Products ───────────────────────────────────────────────────────

export async function getQualProducts(promoId: number): Promise<PromoProduct[]> {
  return query<PromoProduct>(`
    SELECT P.Product_ID, P.Name, COALESCE(P.SKU,'') AS SKU
    FROM Promotion_Qual_Products PP
    JOIN Products P ON P.Product_ID = PP.Product_ID
    WHERE PP.Promotion_ID = @promoId
    ORDER BY P.Name
  `, { promoId });
}

export async function addQualProduct(promoId: number, productId: number): Promise<void> {
  await query(`
    IF NOT EXISTS (SELECT 1 FROM Promotion_Qual_Products WHERE Promotion_ID=@promoId AND Product_ID=@productId)
      INSERT INTO Promotion_Qual_Products (Promotion_ID, Product_ID) VALUES (@promoId, @productId)
  `, { promoId, productId });
}

export async function removeQualProduct(promoId: number, productId: number): Promise<void> {
  await query(`
    DELETE FROM Promotion_Qual_Products WHERE Promotion_ID=@promoId AND Product_ID=@productId
  `, { promoId, productId });
}

// ── Groups ────────────────────────────────────────────────────────────────────

export async function getPromoGroups(promoId: number): Promise<PromoGroup[]> {
  return query<PromoGroup>(`
    SELECT G.Group_ID, G.Name
    FROM Promotion_Groups PG
    JOIN Groups G ON G.Group_ID = PG.Group_ID
    WHERE PG.Promotion_ID = @promoId
    ORDER BY G.Name
  `, { promoId });
}

export async function addPromoGroup(promoId: number, groupId: number): Promise<void> {
  await query(`
    IF NOT EXISTS (SELECT 1 FROM Promotion_Groups WHERE Promotion_ID=@promoId AND Group_ID=@groupId)
      INSERT INTO Promotion_Groups (Promotion_ID, Group_ID) VALUES (@promoId, @groupId)
  `, { promoId, groupId });
}

export async function removePromoGroup(promoId: number, groupId: number): Promise<void> {
  await query(`DELETE FROM Promotion_Groups WHERE Promotion_ID=@promoId AND Group_ID=@groupId`, { promoId, groupId });
}

// ── Product search (reused from discounts pattern) ────────────────────────────

export async function searchProducts(term: string): Promise<PromoProduct[]> {
  return query<PromoProduct>(`
    SELECT TOP 30 Product_ID, Name, COALESCE(SKU,'') AS SKU
    FROM Products
    WHERE (Name LIKE @term OR SKU LIKE @term) AND Display = 1
    ORDER BY Name
  `, { term: `%${term}%` });
}

export async function getAllGroups(): Promise<PromoGroup[]> {
  return query<PromoGroup>(`SELECT Group_ID, Name FROM Groups ORDER BY Name`, {});
}
