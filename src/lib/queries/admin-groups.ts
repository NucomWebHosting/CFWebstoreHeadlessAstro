import { query } from "../db";

export const PAGE_SIZE = 40;

// ── Reference data ─────────────────────────────────────────────────────────

export interface DiscountRef { Discount_ID: number; Name: string; }
export interface PromotionRef { Promotion_ID: number; Name: string; }

export async function getGroupDiscounts(): Promise<DiscountRef[]> {
  // Only discounts with Type5=1 are eligible for group assignment
  return query<DiscountRef>(
    `SELECT Discount_ID, Name FROM Discounts WHERE Type5 = 1 ORDER BY Name, MinOrder`,
    {}
  );
}

export async function getGroupPromotions(): Promise<PromotionRef[]> {
  // Only promotions with Type4=1 are eligible for group assignment
  return query<PromotionRef>(
    `SELECT Promotion_ID, Name FROM Promotions WHERE Type4 = 1 ORDER BY Name, StartDate`,
    {}
  );
}

// ── List ───────────────────────────────────────────────────────────────────

export interface GroupListRow {
  Group_ID: number;
  Name: string;
  Description: string | null;
  Wholesale: boolean;
  DiscountIds: string;   // comma-separated, empty string if none
  PromotionIds: string;  // comma-separated, empty string if none
}

export interface GroupListOptions {
  name?: string;
  description?: string;
  wholesale?: string;   // "0" | "1" | ""
  discounts?: string;   // "0"=none, "1"=has some, ""=all
  promotions?: string;
  page?: number;
}

export async function getGroups(
  opts: GroupListOptions
): Promise<{ rows: GroupListRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const params: Record<string, unknown> = {};

  if (opts.name?.trim()) {
    conditions.push(`G.Name LIKE @name`);
    params.name = `%${opts.name.trim()}%`;
  }
  if (opts.description?.trim()) {
    conditions.push(`G.Description LIKE @description`);
    params.description = `%${opts.description.trim()}%`;
  }
  if (opts.wholesale === "0" || opts.wholesale === "1") {
    conditions.push(`G.Wholesale = @wholesale`);
    params.wholesale = parseInt(opts.wholesale);
  }
  if (opts.discounts === "1") {
    conditions.push(`G.Group_ID IN (SELECT DISTINCT Group_ID FROM Discount_Groups)`);
  } else if (opts.discounts === "0") {
    conditions.push(`G.Group_ID NOT IN (SELECT DISTINCT Group_ID FROM Discount_Groups)`);
  }
  if (opts.promotions === "1") {
    conditions.push(`G.Group_ID IN (SELECT DISTINCT Group_ID FROM Promotion_Groups)`);
  } else if (opts.promotions === "0") {
    conditions.push(`G.Group_ID NOT IN (SELECT DISTINCT Group_ID FROM Promotion_Groups)`);
  }

  const where = conditions.join(" AND ");

  const countRows = await query<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt FROM [Groups] G WHERE ${where}`,
    params
  );
  const total = countRows[0]?.cnt ?? 0;

  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await query<{
    Group_ID: number; Name: string; Description: string | null; Wholesale: boolean;
  }>(
    `SELECT G.Group_ID, G.Name, G.Description, G.Wholesale
     FROM [Groups] G
     WHERE ${where}
     ORDER BY G.Group_ID
     OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`,
    params
  );

  // Attach discount/promotion ID lists per group
  const ids = rows.map((r) => r.Group_ID);
  if (ids.length === 0) return { rows: [], total };

  const idList = ids.join(",");
  const [dgRows, pgRows] = await Promise.all([
    query<{ Group_ID: number; Discount_ID: number }>(
      `SELECT Group_ID, Discount_ID FROM Discount_Groups WHERE Group_ID IN (${idList})`,
      {}
    ),
    query<{ Group_ID: number; Promotion_ID: number }>(
      `SELECT Group_ID, Promotion_ID FROM Promotion_Groups WHERE Group_ID IN (${idList})`,
      {}
    ),
  ]);

  const discountMap = new Map<number, number[]>();
  for (const r of dgRows) {
    if (!discountMap.has(r.Group_ID)) discountMap.set(r.Group_ID, []);
    discountMap.get(r.Group_ID)!.push(r.Discount_ID);
  }
  const promotionMap = new Map<number, number[]>();
  for (const r of pgRows) {
    if (!promotionMap.has(r.Group_ID)) promotionMap.set(r.Group_ID, []);
    promotionMap.get(r.Group_ID)!.push(r.Promotion_ID);
  }

  const result: GroupListRow[] = rows.map((r) => ({
    ...r,
    DiscountIds:   (discountMap.get(r.Group_ID) ?? []).join(", "),
    PromotionIds:  (promotionMap.get(r.Group_ID) ?? []).join(", "),
  }));

  return { rows: result, total };
}

// ── Detail ─────────────────────────────────────────────────────────────────

export interface GroupDetail {
  Group_ID: number;
  Name: string;
  Description: string | null;
  Group_Code: string | null;
  Wholesale: boolean;
  TaxExempt: boolean;
  ShipExempt: boolean;
  // assigned discount/promotion IDs
  DiscountIds: number[];
  PromotionIds: number[];
}

export async function getGroup(id: number): Promise<GroupDetail | null> {
  const [rows, dgRows, pgRows] = await Promise.all([
    query<{
      Group_ID: number; Name: string; Description: string | null;
      Group_Code: string | null; Wholesale: boolean;
      TaxExempt: boolean; ShipExempt: boolean;
    }>(
      `SELECT Group_ID, Name, Description, Group_Code, Wholesale, TaxExempt, ShipExempt
       FROM [Groups] WHERE Group_ID = @id`,
      { id }
    ),
    query<{ Discount_ID: number }>(
      `SELECT Discount_ID FROM Discount_Groups WHERE Group_ID = @id ORDER BY Discount_ID`,
      { id }
    ),
    query<{ Promotion_ID: number }>(
      `SELECT Promotion_ID FROM Promotion_Groups WHERE Group_ID = @id ORDER BY Promotion_ID`,
      { id }
    ),
  ]);

  const g = rows[0];
  if (!g) return null;

  return {
    ...g,
    DiscountIds:  dgRows.map((r) => r.Discount_ID),
    PromotionIds: pgRows.map((r) => r.Promotion_ID),
  };
}

// ── Create ─────────────────────────────────────────────────────────────────

export async function createGroup(data: {
  Name: string;
  Description: string;
  Group_Code: string;
  Wholesale: boolean;
  TaxExempt: boolean;
  ShipExempt: boolean;
  discountIds: number[];
  promotionIds: number[];
}): Promise<number> {
  // Groups uses manual IDs (not IDENTITY) — replicate CF's MAX+1 approach
  const maxRow = await query<{ maxid: number | null }>(
    `SELECT MAX(Group_ID) AS maxid FROM [Groups]`,
    {}
  );
  const newId = (maxRow[0]?.maxid ?? 0) + 1;

  await query(
    `INSERT INTO [Groups] (Group_ID, Name, Description, Group_Code, Wholesale, TaxExempt, ShipExempt)
     VALUES (@id, @Name, @Description, @Group_Code, @Wholesale, @TaxExempt, @ShipExempt)`,
    { id: newId, Name: data.Name, Description: data.Description, Group_Code: data.Group_Code,
      Wholesale: data.Wholesale, TaxExempt: data.TaxExempt, ShipExempt: data.ShipExempt }
  );

  await syncGroupRelations(newId, data.discountIds, data.promotionIds);
  return newId;
}

// ── Update ─────────────────────────────────────────────────────────────────

export async function updateGroup(id: number, data: {
  Name: string;
  Description: string;
  Group_Code: string;
  Wholesale: boolean;
  TaxExempt: boolean;
  ShipExempt: boolean;
  discountIds: number[];
  promotionIds: number[];
}): Promise<void> {
  await query(
    `UPDATE [Groups] SET
       Name        = @Name,
       Description = @Description,
       Group_Code  = @Group_Code,
       Wholesale   = @Wholesale,
       TaxExempt   = @TaxExempt,
       ShipExempt  = @ShipExempt
     WHERE Group_ID = @id`,
    { id, Name: data.Name, Description: data.Description, Group_Code: data.Group_Code,
      Wholesale: data.Wholesale, TaxExempt: data.TaxExempt, ShipExempt: data.ShipExempt }
  );

  await syncGroupRelations(id, data.discountIds, data.promotionIds);
}

// Replace junction rows — simpler than the CF per-row diff approach
async function syncGroupRelations(
  groupId: number,
  discountIds: number[],
  promotionIds: number[]
): Promise<void> {
  await query(`DELETE FROM Discount_Groups WHERE Group_ID = @id`, { id: groupId });
  await query(`DELETE FROM Promotion_Groups WHERE Group_ID = @id`, { id: groupId });

  for (const did of discountIds) {
    await query(
      `INSERT INTO Discount_Groups (Discount_ID, Group_ID) VALUES (@did, @gid)`,
      { did, gid: groupId }
    );
  }
  for (const pid of promotionIds) {
    await query(
      `INSERT INTO Promotion_Groups (Promotion_ID, Group_ID) VALUES (@pid, @gid)`,
      { pid, gid: groupId }
    );
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteGroup(id: number): Promise<void> {
  // Remove all junction rows and product group prices, reset user Group_IDs, then delete
  await query(`DELETE FROM Discount_Groups  WHERE Group_ID = @id`, { id });
  await query(`DELETE FROM Promotion_Groups WHERE Group_ID = @id`, { id });
  await query(`DELETE FROM ProdGrpPrice     WHERE Group_ID = @id`, { id });
  await query(`UPDATE Users SET Group_ID = 0 WHERE Group_ID = @id`, { id });
  await query(`DELETE FROM [Groups] WHERE Group_ID = @id`, { id });
}
