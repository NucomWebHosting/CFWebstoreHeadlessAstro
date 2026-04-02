import { query } from "../db";

export const PAGE_SIZE = 20;

export interface ReviewListRow {
  Review_ID:    number;
  Product_ID:   number;
  Product_Name: string;
  Title:        string;
  Posted:       Date;
  Rating:       number | null;
  Approved:     boolean;
  NeedsCheck:   boolean;
  Helpful_Yes:  number;
  Helpful_Total: number;
}

export interface ReviewDetail {
  Review_ID:    number;
  Product_ID:   number;
  Product_Name: string | null;
  User_ID:      number | null;
  Username:     string | null;
  Anonymous:    boolean;
  Anon_Name:    string | null;
  Anon_Loc:     string | null;
  Anon_Email:   string | null;
  Title:        string;
  Comment:      string | null;
  Rating:       number | null;
  Editorial:    string | null;
  Posted:       Date | null;
  Updated:      Date | null;
  Approved:     boolean;
  NeedsCheck:   boolean;
  Helpful_Yes:  number;
  Helpful_Total: number;
}

export interface ReviewFilters {
  product_id?:     string;
  search?:         string;
  sortby?:         string;  // newest|oldest|highest|lowest|mosthelp|leasthelp
  display_status?: string;  // check|pending|editor|day|week|month
  page?:           number;
}

function buildOrderBy(sortby: string): string {
  switch (sortby) {
    case "newest":   return "R.Posted DESC";
    case "oldest":   return "R.Posted ASC";
    case "highest":  return "R.Rating DESC";
    case "lowest":   return "R.Rating ASC";
    case "mosthelp": return "CASE WHEN R.Helpful_Total > 0 THEN CAST(R.Helpful_Yes AS float)/R.Helpful_Total ELSE 0 END DESC";
    case "leasthelp": return "CASE WHEN R.Helpful_Total > 0 THEN CAST(R.Helpful_Yes AS float)/R.Helpful_Total ELSE 0 END ASC";
    default:         return "R.Review_ID DESC";
  }
}

export async function getReviews(
  filters: ReviewFilters
): Promise<{ rows: ReviewListRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const params: Record<string, string | number> = {};

  if (filters.product_id?.trim()) {
    conditions.push("R.Product_ID = @product_id");
    params.product_id = parseInt(filters.product_id) || 0;
  }
  if (filters.search?.trim()) {
    conditions.push("(R.Title LIKE @search OR R.Comment LIKE @search OR P.Name LIKE @search)");
    params.search = `%${filters.search.trim()}%`;
  }

  switch (filters.display_status) {
    case "check":   conditions.push("R.NeedsCheck = 1");   break;
    case "pending": conditions.push("R.Approved = 0");     break;
    case "editor":  conditions.push("(R.Approved = 0 OR R.NeedsCheck = 1)"); break;
    case "day":
      conditions.push("R.Posted >= DATEADD(day, -1, GETDATE())"); break;
    case "week":
      conditions.push("R.Posted >= DATEADD(day, -7, GETDATE())"); break;
    case "month":
      conditions.push("R.Posted >= DATEADD(day, -30, GETDATE())"); break;
  }

  const where = conditions.join(" AND ");
  const orderBy = buildOrderBy(filters.sortby ?? "");

  const countRows = await query<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt
     FROM ProductReviews R
     INNER JOIN Products P ON R.Product_ID = P.Product_ID
     WHERE ${where}`,
    params
  );
  const total = countRows[0]?.cnt ?? 0;

  const page = Math.max(1, filters.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await query<ReviewListRow>(
    `SELECT R.Review_ID, R.Product_ID, P.Name AS Product_Name,
            R.Title, R.Posted, R.Rating, R.Approved, R.NeedsCheck,
            R.Helpful_Yes, R.Helpful_Total
     FROM ProductReviews R
     INNER JOIN Products P ON R.Product_ID = P.Product_ID
     WHERE ${where}
     ORDER BY ${orderBy}
     OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`,
    params
  );

  return { rows, total };
}

export async function getReview(id: number): Promise<ReviewDetail | null> {
  const rows = await query<ReviewDetail>(
    `SELECT R.Review_ID, R.Product_ID, P.Name AS Product_Name,
            R.User_ID, U.Username, R.Anonymous, R.Anon_Name, R.Anon_Loc, R.Anon_Email,
            R.Title, R.Comment, R.Rating, R.Editorial,
            R.Posted, R.Updated, R.Approved, R.NeedsCheck,
            R.Helpful_Yes, R.Helpful_Total
     FROM ProductReviews R
     INNER JOIN Products P ON R.Product_ID = P.Product_ID
     LEFT JOIN Users U ON R.User_ID = U.User_ID
     WHERE R.Review_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function updateReview(id: number, data: {
  User_ID:      number | null;
  Anonymous:    number;
  Anon_Name:    string;
  Anon_Loc:     string;
  Anon_Email:   string;
  Title:        string;
  Comment:      string;
  Rating:       number | null;
  Posted:       string;
  Updated:      string;
  Approved:     number;
  NeedsCheck:   number;
  Helpful_Yes:  number;
  Helpful_Total: number;
}): Promise<void> {
  await query(
    `UPDATE ProductReviews SET
       User_ID       = @User_ID,
       Anonymous     = @Anonymous,
       Anon_Name     = @Anon_Name,
       Anon_Loc      = @Anon_Loc,
       Anon_Email    = @Anon_Email,
       Title         = @Title,
       Comment       = @Comment,
       Rating        = @Rating,
       Posted        = @Posted,
       Updated       = @Updated,
       Approved      = @Approved,
       NeedsCheck    = @NeedsCheck,
       Helpful_Yes   = @Helpful_Yes,
       Helpful_Total = @Helpful_Total
     WHERE Review_ID = @id`,
    { id, ...data } as Record<string, string | number | null>
  );
}

export async function deleteReview(id: number): Promise<void> {
  await query(`DELETE FROM ProductReviewsHelpful WHERE Review_ID = @id`, { id });
  await query(`DELETE FROM ProductReviews WHERE Review_ID = @id`, { id });
}

export async function findUserByUsername(username: string): Promise<number | null> {
  const rows = await query<{ User_ID: number }>(
    `SELECT User_ID FROM Users WHERE Username = @username`,
    { username }
  );
  return rows[0]?.User_ID ?? null;
}
