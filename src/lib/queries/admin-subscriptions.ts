import { query } from "../db";

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Subscription {
  ID:                  number;
  User_ID:             number;
  Product_ID:          number;
  Quantity:            number;
  NextShipDate:        Date;
  subscription_period: number;
  Pause:               boolean;
  // from joins
  FirstName:           string;
  LastName:            string;
  ProductName:         string;
  base_price:          number;
  sm_image:            string | null;
}

export interface SubscriptionSettings {
  ID:                number;
  Free_shipping:     boolean;
  flat_rate:         number;
  shipping_type:     string;
  shippingmethod_id: number | null;
}

export const PERIOD_LABELS: Record<number, string> = {
  1:  "1 Week",
  2:  "2 Weeks",
  3:  "3 Weeks",
  4:  "1 Month",
  5:  "5 Weeks",
  6:  "6 Weeks",
  7:  "7 Weeks",
  8:  "2 Months",
  12: "3 Months",
  16: "4 Months",
  20: "5 Months",
  24: "6 Months",
};

// ── Filters ───────────────────────────────────────────────────────────────────

export interface SubscriptionFilters {
  customer?:   string;
  productId?:  number;
  pause?:      0 | 1 | 2; // 0=no, 1=yes, 2=all (default)
  startDate?:  string;     // YYYY-MM-DD
  toDate?:     string;     // YYYY-MM-DD
}

// ── List ──────────────────────────────────────────────────────────────────────

export async function getSubscriptions(
  filters: SubscriptionFilters = {}
): Promise<Subscription[]> {
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.customer?.trim()) {
    conditions.push("(C.FirstName + ' ' + C.LastName LIKE @customer OR C.LastName LIKE @customer)");
    params["customer"] = `%${filters.customer.trim()}%`;
  }

  if (filters.productId && filters.productId > 0) {
    conditions.push("S.Product_ID = @productId");
    params["productId"] = filters.productId;
  }

  if (filters.pause === 0 || filters.pause === 1) {
    conditions.push("S.Pause = @pause");
    params["pause"] = filters.pause;
  }

  if (filters.startDate) {
    conditions.push("S.NextShipDate >= @startDate");
    params["startDate"] = filters.startDate;
  }

  if (filters.toDate) {
    conditions.push("S.NextShipDate <= @toDate");
    params["toDate"] = filters.toDate;
  }

  const where = conditions.length ? `WHERE ${conditions.map(c => `(${c})`).join(" AND ")}` : "";

  return query<Subscription>(`
    SELECT
      S.ID, S.User_ID, S.Product_ID, S.Quantity, S.NextShipDate,
      S.subscription_period, S.Pause,
      COALESCE(C.FirstName, '') AS FirstName,
      COALESCE(C.LastName,  '') AS LastName,
      COALESCE(P.Name,      '') AS ProductName,
      COALESCE(P.base_price, 0) AS base_price,
      I.sm_image
    FROM Subscription_Order_Items S
    LEFT JOIN Users U           ON U.User_id    = S.User_ID
    LEFT JOIN Customers C       ON C.Customer_id = U.Customer_id
    LEFT JOIN Products P        ON P.Product_ID  = S.Product_ID
    OUTER APPLY (
      SELECT TOP 1 sm_image
      FROM Product_Images PI
      WHERE PI.Product_ID = S.Product_ID
      ORDER BY PI.Priority ASC
    ) I
    ${where}
    ORDER BY S.NextShipDate DESC, C.LastName
  `, params);
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function updateSubscription(
  id: number,
  data: { subscription_period: number; NextShipDate: string; Quantity: number }
): Promise<void> {
  await query(`
    UPDATE Subscription_Order_Items
    SET subscription_period = @period,
        NextShipDate        = @nextShipDate,
        Quantity            = @quantity
    WHERE ID = @id
  `, {
    id,
    period:      data.subscription_period,
    nextShipDate: data.NextShipDate,
    quantity:    data.Quantity,
  });
}

export async function setSubscriptionPause(id: number, pause: boolean): Promise<void> {
  await query(`
    UPDATE Subscription_Order_Items SET Pause = @pause WHERE ID = @id
  `, { id, pause: pause ? 1 : 0 });
}

export async function deleteSubscription(id: number): Promise<void> {
  await query(`DELETE FROM Subscription_Order_Items WHERE ID = @id`, { id });
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSubscriptionSettings(): Promise<SubscriptionSettings | null> {
  const rows = await query<SubscriptionSettings>(`
    SELECT TOP 1 ID, Free_shipping, flat_rate,
                 COALESCE(shipping_type,    '') AS shipping_type,
                 shippingmethod_id
    FROM Subscription_Settings
    WHERE ID = 1
  `, {});
  return rows[0] ?? null;
}

export async function saveSubscriptionSettings(
  data: Omit<SubscriptionSettings, "ID">
): Promise<void> {
  await query(`
    UPDATE Subscription_Settings
    SET Free_shipping     = @freeShipping,
        flat_rate         = @flatRate,
        shipping_type     = @shippingType,
        shippingmethod_id = @shippingMethodId
    WHERE ID = 1
  `, {
    freeShipping:     data.Free_shipping ? 1 : 0,
    flatRate:         data.flat_rate,
    shippingType:     data.shipping_type,
    shippingMethodId: data.shippingmethod_id ?? null,
  });
}
