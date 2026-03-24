import { query } from "../db";

export interface OrderListRow {
  Order_No: number;
  DateOrdered: Date;
  DateFilled: Date | null;
  FirstName: string | null;
  LastName: string | null;
  TotalProds: number;
  TotalItems: number;
  ToFill: number;
  OrderTotal: number;
  AmountPaid: number;
  Paid: boolean;
  Process: boolean;
  Filled: boolean;
  Void: boolean;
  Status: string | null;
  ShipType: string | null;
  Source: string | null;
}

export interface OrderListOptions {
  tab?: string;         // "pending" | "process" | "filled" | "search"
  orderNo?: string;
  customer?: string;
  paid?: string;        // "1" | "0"
  source?: string;      // "POS" | "WEB"
  voidStatus?: string;  // "all" | "none" | "void" | "cancelled" | "fraud"
  orderStatus?: string; // for search tab: "all"|"pending"|"process"|"filled"|"void"|"cancelled"|"fraud"
  orderdate?: string;   // "today"|"yesterday"|"this-month"|"last-month"|"this-year"
  startDate?: string;   // ISO date YYYY-MM-DD
  toDate?: string;
  page?: number;
  perPage?: number;
}

const BASE_FROM = `
  FROM Order_No O
  LEFT JOIN Customers C ON O.Customer_ID = C.Customer_ID
  LEFT JOIN (
    SELECT oi.Order_No,
           COUNT(DISTINCT oi.Product_ID) AS TotalProds,
           SUM(ISNULL(oi.Quantity, 0)) AS TotalItems
    FROM Order_Items oi
    GROUP BY oi.Order_No
  ) OIT ON OIT.Order_No = O.Order_No
  LEFT JOIN (
    SELECT OPH.Order_No, SUM(OPH.Amount) AS AmountPaid
    FROM Payment OPH
    GROUP BY OPH.Order_No
  ) PAY ON PAY.Order_No = O.Order_No
  LEFT JOIN (
    SELECT S.Order_No, SUM(ISNULL(SI.Quantity, 0)) AS shipment_quantity
    FROM Shipment S
    LEFT JOIN Shipment_Items SI ON S.Shipment_ID = SI.Shipment_ID
    GROUP BY S.Order_No
  ) ST ON ST.Order_No = O.Order_No
`;

export async function getOrdersAdmin(
  opts: OrderListOptions = {}
): Promise<{ rows: OrderListRow[]; total: number }> {
  const {
    tab = "pending",
    orderNo = "", customer = "", paid = "", source = "",
    voidStatus = "", orderStatus = "", orderdate = "",
    startDate = "", toDate = "",
    page = 1, perPage = 40,
  } = opts;

  const conditions: string[] = ["1=1"];
  const params: Record<string, string | number | boolean | null> = {};

  // ── Tab base conditions ────────────────────────────────────────────────────
  if (tab === "pending") {
    conditions.push("O.Process = 0", "O.Filled = 0", "O.Void = 0");
  } else if (tab === "process") {
    conditions.push("O.Process = 1", "O.Filled = 0", "O.Void = 0");
  } else if (tab === "filled") {
    conditions.push("O.Filled = 1");
  }
  // "search" → no base condition

  // ── Void / status filter (filled tab) ─────────────────────────────────────
  if (tab === "filled") {
    if (voidStatus === "none")      { conditions.push("O.Void = 0", "(O.Status IS NULL OR O.Status = '')"); }
    else if (voidStatus === "void") { conditions.push("O.Void = 1"); }
    else if (voidStatus === "cancelled") { conditions.push("O.Status = 'cancelled'"); }
    else if (voidStatus === "fraud")     { conditions.push("O.Status = 'fraud'"); }
    // "all" or empty: no extra filter
  }

  // ── Order status filter (search tab) ──────────────────────────────────────
  if (tab === "search" && orderStatus && orderStatus !== "all") {
    if (orderStatus === "pending")   { conditions.push("O.Process = 0", "O.Filled = 0", "O.Void = 0"); }
    else if (orderStatus === "process")   { conditions.push("O.Process = 1", "O.Filled = 0"); }
    else if (orderStatus === "filled")    { conditions.push("O.Filled = 1"); }
    else if (orderStatus === "void")      { conditions.push("O.Void = 1"); }
    else if (orderStatus === "cancelled") { conditions.push("O.Status = 'cancelled'"); }
    else if (orderStatus === "fraud")     { conditions.push("O.Status = 'fraud'"); }
  }

  // ── Order No. ─────────────────────────────────────────────────────────────
  if (orderNo) {
    conditions.push("O.Order_No = @orderNo");
    params.orderNo = parseInt(orderNo) || 0;
  }

  // ── Customer name / UID ───────────────────────────────────────────────────
  if (customer.trim()) {
    if (/^\d+$/.test(customer.trim())) {
      conditions.push("O.User_ID = @customerUid");
      params.customerUid = parseInt(customer);
    } else {
      conditions.push(
        "(C.FirstName LIKE '%' + @customer + '%'" +
        " OR C.LastName LIKE '%' + @customer + '%'" +
        " OR C.Company LIKE '%' + @customer + '%'" +
        " OR C.FirstName + ' ' + C.LastName LIKE '%' + @customer + '%')"
      );
      params.customer = customer.trim();
    }
  }

  // ── Paid ──────────────────────────────────────────────────────────────────
  if (paid === "1") conditions.push("O.Paid = 1");
  if (paid === "0") conditions.push("O.Paid = 0");

  // ── Source ────────────────────────────────────────────────────────────────
  if (source === "POS") conditions.push("O.Source = 'POS'");
  if (source === "WEB") conditions.push("O.Source = 'WEB'");

  // ── Quick date (pending / process) ────────────────────────────────────────
  if (orderdate && (tab === "pending" || tab === "process")) {
    if (orderdate === "today") {
      conditions.push("CAST(O.DateOrdered AS DATE) = CAST(GETDATE() AS DATE)");
    } else if (orderdate === "yesterday") {
      conditions.push("CAST(O.DateOrdered AS DATE) = CAST(DATEADD(day,-1,GETDATE()) AS DATE)");
    } else if (orderdate === "this-month") {
      conditions.push("YEAR(O.DateOrdered) = YEAR(GETDATE()) AND MONTH(O.DateOrdered) = MONTH(GETDATE())");
    } else if (orderdate === "last-month") {
      conditions.push(
        "YEAR(O.DateOrdered) = YEAR(DATEADD(month,-1,GETDATE()))" +
        " AND MONTH(O.DateOrdered) = MONTH(DATEADD(month,-1,GETDATE()))"
      );
    } else if (orderdate === "this-year") {
      conditions.push("YEAR(O.DateOrdered) = YEAR(GETDATE())");
    }
  }

  // ── Date range (filled / search) ──────────────────────────────────────────
  if ((tab === "filled" || tab === "search") && startDate) {
    conditions.push("O.DateOrdered >= @startDate");
    params.startDate = startDate;
  }
  if ((tab === "filled" || tab === "search") && toDate) {
    conditions.push("O.DateOrdered <= @toDate");
    params.toDate = toDate + " 23:59:59";
  }

  // ── Execute ────────────────────────────────────────────────────────────────
  const where = conditions.join(" AND ");
  const offset = (page - 1) * perPage;
  const countParams = { ...params };
  params.offset  = offset;
  params.perPage = perPage;

  const [rows, counts] = await Promise.all([
    query<OrderListRow>(
      `SELECT
         O.Order_No, O.DateOrdered, O.DateFilled, O.OrderTotal,
         O.Paid, O.Process, O.Filled, O.Void, O.Status, O.ShipType, O.Source,
         C.FirstName, C.LastName,
         COALESCE(OIT.TotalProds, 0)                                       AS TotalProds,
         COALESCE(OIT.TotalItems, 0)                                       AS TotalItems,
         COALESCE(PAY.AmountPaid, 0)                                       AS AmountPaid,
         COALESCE(OIT.TotalItems, 0) - COALESCE(ST.shipment_quantity, 0)   AS ToFill
       ${BASE_FROM}
       WHERE ${where}
       ORDER BY O.Order_No DESC
       OFFSET @offset ROWS FETCH NEXT @perPage ROWS ONLY`,
      params
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total ${BASE_FROM} WHERE ${where}`,
      countParams
    ),
  ]);

  return { rows, total: counts[0]?.total ?? 0 };
}
