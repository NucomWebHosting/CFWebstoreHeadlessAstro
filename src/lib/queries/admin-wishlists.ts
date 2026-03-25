import { query } from "../db";

export interface WishlistSummary {
  User_ID:      number;
  FirstName:    string | null;
  LastName:     string | null;
  ListName:     string | null;
  ProductCount: number;
  GTotal:       number;
  LastUpdated:  Date | null;
}

export interface WishlistItem {
  ItemNum:     number;
  Product_ID:  number;
  Name:        string | null;
  Display:     boolean;
  Availability: string | null;
  optPrice:    number;
  BasePrice:   number;
  NumDesired:  number;
  Comments:    string | null;
  DateAdded:   Date | null;
}

export interface WishlistFilters {
  customer?:  string;
  startDate?: string;
  toDate?:    string;
  sort?:      "1" | "2" | "3" | "4" | "";
}

export async function getWishlists(filters: WishlistFilters = {}): Promise<WishlistSummary[]> {
  const conds: string[] = ["W.ListNum = 1"];
  const params: Record<string, unknown> = {};

  if (filters.customer?.trim()) {
    conds.push("(C.FirstName LIKE @customer OR C.LastName LIKE @customer OR C.Company LIKE @customer)");
    params["customer"] = `%${filters.customer.trim()}%`;
  }
  if (filters.startDate) {
    conds.push("W.DateAdded >= @startDate");
    params["startDate"] = filters.startDate;
  }
  if (filters.toDate) {
    conds.push("W.DateAdded <= @toDate");
    params["toDate"] = filters.toDate + "T23:59:59";
  }

  const orderBy = {
    "1": "ProductCount ASC",
    "2": "ProductCount DESC",
    "3": "GTotal ASC",
    "4": "GTotal DESC",
    "":  "LastUpdated DESC, C.LastName",
  }[filters.sort ?? ""] ?? "LastUpdated DESC, C.LastName";

  return query<WishlistSummary>(`
    SELECT
      U.User_ID,
      C.FirstName,
      C.LastName,
      W.ListName,
      COUNT(P.Product_ID)                            AS ProductCount,
      SUM((COALESCE(P.Base_Price,0) + W.optPrice) * W.NumDesired) AS GTotal,
      MAX(W.DateAdded)                               AS LastUpdated
    FROM WishList W
    LEFT JOIN Products P  ON P.Product_ID  = W.Product_ID
    LEFT JOIN Users U     ON U.User_ID     = W.User_ID
    LEFT JOIN Customers C ON C.Customer_ID = U.Customer_ID
    WHERE ${conds.join(" AND ")}
    GROUP BY U.User_ID, C.FirstName, C.LastName, W.ListName
    ORDER BY ${orderBy}
  `, params);
}

export async function getWishlistItems(userId: number): Promise<WishlistItem[]> {
  return query<WishlistItem>(`
    SELECT
      W.ItemNum,
      W.Product_ID,
      P.Name,
      COALESCE(P.Display, 0) AS Display,
      P.Availability,
      W.optPrice,
      COALESCE(P.Base_Price, 0) AS BasePrice,
      W.NumDesired,
      W.Comments,
      W.DateAdded
    FROM WishList W
    LEFT JOIN Products P ON P.Product_ID = W.Product_ID
    WHERE W.User_ID = @userId AND W.ListNum = 1
    ORDER BY W.ItemNum
  `, { userId });
}

export async function getWishlistUser(userId: number): Promise<{ FirstName: string | null; LastName: string | null } | null> {
  const rows = await query<{ FirstName: string | null; LastName: string | null }>(`
    SELECT TOP 1 C.FirstName, C.LastName
    FROM Users U
    LEFT JOIN Customers C ON C.Customer_ID = U.Customer_ID
    WHERE U.User_ID = @userId
  `, { userId });
  return rows[0] ?? null;
}
