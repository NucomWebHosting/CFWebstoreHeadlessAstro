import { query } from "../db";

// ── Shared date helpers ────────────────────────────────────────────────────────

export function defaultDateRange(): { startDate: string; toDate: string } {
  const now = new Date();
  const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const toDate    = now.toISOString().slice(0, 10);
  return { startDate, toDate };
}

// ── Sales Summary ──────────────────────────────────────────────────────────────

export interface SalesSummary {
  NumOrders:     number;
  TotalSales:    number;
  TotalTax:      number;
  TotalShipping: number;
  TotalFreight:  number;
  TotalDisc:     number;
  TotalCredits:  number;
  TotalAdminCredit: number;
  TotalDropship: number;
}

export interface PaymentSummaryTotal {
  TotalPayments: number;
  NumPayments:   number;
}

export async function getSalesSummary(
  startDate: string,
  toDate: string,
  filledOnly: boolean
): Promise<{ summary: SalesSummary | null; payments: PaymentSummaryTotal | null }> {
  const conditions = [
    "DateOrdered >= @startDate",
    "DateOrdered <= @toDate",
    "Void = 0",
  ];
  if (filledOnly) conditions.push("Filled = 1", "Paid = 1");

  const where = conditions.join(" AND ");
  const params = { startDate, toDate: toDate + " 23:59:59" };

  const [rows, payRows] = await Promise.all([
    query<SalesSummary>(
      `SELECT
         COUNT(*)                         AS NumOrders,
         COALESCE(SUM(OrderTotal),  0)   AS TotalSales,
         COALESCE(SUM(Tax),         0)   AS TotalTax,
         COALESCE(SUM(Shipping),    0)   AS TotalShipping,
         COALESCE(SUM(Freight),     0)   AS TotalFreight,
         COALESCE(SUM(OrderDisc),   0)   AS TotalDisc,
         COALESCE(SUM(Credits),     0)   AS TotalCredits,
         COALESCE(SUM(AdminCredit), 0)   AS TotalAdminCredit,
         0                               AS TotalDropship
       FROM Order_No
       WHERE ${where}`,
      params
    ),
    query<PaymentSummaryTotal>(
      `SELECT
         COALESCE(SUM(P.Amount), 0) AS TotalPayments,
         COUNT(*)                   AS NumPayments
       FROM Payment P
       INNER JOIN Order_No N ON P.Order_No = N.Order_No
       WHERE P.PaymentDateTime >= @startDate
         AND P.PaymentDateTime <= @toDate
         AND P.Voided = 0
         AND N.Void = 0`,
      params
    ),
  ]);

  return { summary: rows[0] ?? null, payments: payRows[0] ?? null };
}

// ── Sales by Item ──────────────────────────────────────────────────────────────

export interface SalesByItemRow {
  Product_ID: number;
  Name: string;
  SKU: string | null;
  UnitsSold: number;
  TotalRevenue: number;
}

export async function getSalesByItem(
  startDate: string,
  toDate: string,
  filledOnly: boolean
): Promise<SalesByItemRow[]> {
  const orderConditions = ["o.Void = 0", "o.DateOrdered >= @startDate", "o.DateOrdered <= @toDate"];
  if (filledOnly) orderConditions.push("o.Filled = 1", "o.Paid = 1");

  return query<SalesByItemRow>(
    `SELECT
       oi.Product_ID,
       oi.Name,
       oi.SKU,
       SUM(oi.Quantity)                                          AS UnitsSold,
       SUM((oi.Price + oi.OptPrice + oi.AddonMultP) * oi.Quantity) AS TotalRevenue
     FROM Order_Items oi
     INNER JOIN Order_No o ON oi.Order_No = o.Order_No
     WHERE ${orderConditions.join(" AND ")}
     GROUP BY oi.Product_ID, oi.Name, oi.SKU
     ORDER BY TotalRevenue DESC`,
    { startDate, toDate: toDate + " 23:59:59" }
  );
}

// ── Top Customers ──────────────────────────────────────────────────────────────

export interface TopCustomerRow {
  User_ID: number;
  Username: string;
  Email: string;
  FirstName: string | null;
  LastName: string | null;
  Company: string | null;
  OrderCount: number;
  TotalSales: number;
}

export async function getTopCustomers(
  startDate: string,
  toDate: string
): Promise<TopCustomerRow[]> {
  return query<TopCustomerRow>(
    `SELECT TOP 50
       U.User_ID, U.Username, U.Email,
       C.FirstName, C.LastName, C.Company,
       COUNT(N.Order_No) AS OrderCount,
       COALESCE(SUM(N.OrderTotal), 0) AS TotalSales
     FROM Users U
     LEFT JOIN Order_No N ON U.User_ID = N.User_ID
     LEFT JOIN Customers C ON U.Customer_ID = C.Customer_ID
     WHERE N.DateOrdered >= @startDate
       AND N.DateOrdered <= @toDate
       AND N.Void = 0
     GROUP BY U.User_ID, U.Username, U.Email, C.FirstName, C.LastName, C.Company
     ORDER BY TotalSales DESC`,
    { startDate, toDate: toDate + " 23:59:59" }
  );
}

// ── Payments by Method ────────────────────────────────────────────────────────

export interface PaymentMethodRow {
  PayMethod: string;
  NumPayments: number;
  TotalAmount: number;
}

export async function getPaymentsByMethod(
  startDate: string,
  toDate: string
): Promise<PaymentMethodRow[]> {
  return query<PaymentMethodRow>(
    `SELECT
       CASE
         WHEN P.OfflinePayment IS NULL OR P.OfflinePayment = '' OR P.OfflinePayment = 'Online' THEN 'Credit Card'
         ELSE P.OfflinePayment
       END AS PayMethod,
       COUNT(*)           AS NumPayments,
       SUM(P.Amount)      AS TotalAmount
     FROM Payment P
     INNER JOIN Order_No N ON P.Order_No = N.Order_No
     WHERE P.PaymentDateTime >= @startDate
       AND P.PaymentDateTime <= @toDate
       AND P.Voided = 0
       AND N.Void = 0
     GROUP BY
       CASE
         WHEN P.OfflinePayment IS NULL OR P.OfflinePayment = '' OR P.OfflinePayment = 'Online' THEN 'Credit Card'
         ELSE P.OfflinePayment
       END
     ORDER BY TotalAmount DESC`,
    { startDate, toDate: toDate + " 23:59:59" }
  );
}
