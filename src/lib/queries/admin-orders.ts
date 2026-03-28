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

// ── Order Detail ───────────────────────────────────────────────────────────────

export interface OrderDetailHeader {
  Order_No: number;
  Customer_ID: number;
  ShipTo: number;
  User_ID: number;
  DateOrdered: Date;
  DateFilled: Date | null;
  Process: boolean;
  Filled: boolean;
  Paid: boolean;
  Void: boolean;
  Status: string | null;
  ShipType: string | null;
  Source: string | null;
  OfflinePayment: string | null;
  Notes: string | null;
  OrderTotal: number;
  Tax: number;
  Shipping: number;
  Freight: number;
  Credits: number;
  AdminCredit: number;
  AdminCreditText: string | null;
  OrderDisc: number;
  AddonTotal: number;
  PO_Number: string | null;
  Affiliate: number | null;
  AmountPaid: number;
}

export interface OrderItem {
  Item_ID: number;
  Product_ID: number;
  Name: string;
  SKU: string | null;
  Quantity: number;
  Quantity_shipped: number;
  Price: number;
  OptPrice: number;
  AddonMultP: number;
  Options: string | null;
  Addons: string | null;
  DiscAmount: number;
}

export interface OrderCustomer {
  Customer_ID: number;
  FirstName: string | null;
  LastName: string | null;
  Company: string | null;
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  State: string | null;
  Zip: string | null;
  Country: string | null;
  Phone: string | null;
  Email: string | null;
}

export interface OrderPayment {
  Payment_ID: number;
  PaymentDateTime: Date;
  Amount: number;
  OrgAmount: number | null;
  OfflinePayment: string | null;
  CardType: string | null;
  NameOnCard: string | null;
  CardNumber: string | null;
  Expires: string | null;
  AuthNumber: string | null;
  TransactNum: string | null;
  Voided: boolean;
}

export interface OrderShipment {
  Shipment_ID: number;
  Shipper: string | null;
  ShipType: string | null;
  Tracking: string | null;
  Actual_Shipping: number | null;
  Weight: number | null;
  DateEntered: Date | null;
  Printed_Pack: boolean;
  ShippingLabel: string | null;
  easypostshipmentid: string | null;
}

export interface ShipmentItemRow {
  Shipment_ID: number;
  Item_ID: number;
  Name: string;
  Options: string | null;
  Addons: string | null;
  Quantity: number;
}

export interface OrderUser {
  User_ID: number;
  UserName: string;
  Email: string | null;
}

export async function getOrderDetail(orderNo: number): Promise<{
  order: OrderDetailHeader | null;
  items: OrderItem[];
  billing: OrderCustomer | null;
  shipping: OrderCustomer | null;
  payments: OrderPayment[];
  shipments: OrderShipment[];
  shipmentItems: ShipmentItemRow[];
  user: OrderUser | null;
}> {
  const [orders, items, payments, shipments, shipmentItems] = await Promise.all([
    query<OrderDetailHeader>(
      `SELECT O.*,
         COALESCE((SELECT SUM(P.Amount) FROM Payment P WHERE P.Order_No = O.Order_No), 0) AS AmountPaid
       FROM Order_No O
       WHERE O.Order_No = @orderNo`,
      { orderNo }
    ),
    query<OrderItem>(
      `SELECT Item_ID, Product_ID, Name, SKU, Quantity,
         ISNULL(Quantity_shipped, 0) AS Quantity_shipped,
         Price,
         ISNULL(OptPrice, 0) AS OptPrice, ISNULL(AddonMultP, 0) AS AddonMultP,
         ISNULL(DiscAmount, 0) AS DiscAmount,
         Options, Addons
       FROM Order_Items
       WHERE Order_No = @orderNo
       ORDER BY Item_ID`,
      { orderNo }
    ),
    query<OrderPayment>(
      `SELECT P.Payment_ID, P.PaymentDateTime, P.Amount,
         ISNULL(P.OrgAmount, 0) AS OrgAmount,
         P.OfflinePayment, P.AuthNumber, P.TransactNum,
         ISNULL(P.Voided, 0) AS Voided,
         C.CardType, C.NameOnCard, C.CardNumber, C.Expires
       FROM Payment P
       LEFT JOIN CardData C ON P.CardData_ID = C.ID
       WHERE P.Order_No = @orderNo
       ORDER BY P.Payment_ID ASC`,
      { orderNo }
    ),
    query<OrderShipment>(
      `SELECT Shipment_ID, Shipper, ShipType, Tracking, Actual_Shipping, Weight, DateEntered,
         ISNULL(Printed_Pack, 0) AS Printed_Pack,
         ShippingLabel, easypostshipmentid
       FROM Shipment
       WHERE Order_No = @orderNo
       ORDER BY Shipment_ID ASC`,
      { orderNo }
    ),
    query<ShipmentItemRow>(
      `SELECT SI.Shipment_ID, SI.Item_ID, OI.Name, OI.Options, OI.Addons, SI.Quantity
       FROM Shipment_Items SI
       JOIN Order_Items OI ON OI.Item_ID = SI.Item_ID
       WHERE OI.Order_No = @orderNo
       ORDER BY SI.Shipment_ID, SI.Item_ID`,
      { orderNo }
    ),
  ]);

  const order = orders[0] ?? null;
  if (!order) return { order: null, items: [], billing: null, shipping: null, payments: [], shipments: [], shipmentItems: [], user: null };

  // Fetch billing + (optionally different) shipping customer records
  const ids = [order.Customer_ID];
  if (order.ShipTo && order.ShipTo !== order.Customer_ID) ids.push(order.ShipTo);

  const [customers, userRows] = await Promise.all([
    query<OrderCustomer>(
      `SELECT Customer_ID, FirstName, LastName, Company, Address1, Address2,
              City, State, Zip, Country, Phone, Email
       FROM Customers
       WHERE Customer_ID IN (${ids.map((_, i) => `@cid${i}`).join(",")})`,
      Object.fromEntries(ids.map((id, i) => [`cid${i}`, id]))
    ),
    order.User_ID > 0
      ? query<OrderUser>(
          `SELECT User_ID, UserName, Email FROM Users WHERE User_ID = @uid`,
          { uid: order.User_ID }
        )
      : Promise.resolve([] as OrderUser[]),
  ]);

  const billing  = customers.find(c => c.Customer_ID === order.Customer_ID) ?? null;
  const shipping = order.ShipTo && order.ShipTo !== order.Customer_ID
    ? customers.find(c => c.Customer_ID === order.ShipTo) ?? null
    : null;
  const user = userRows[0] ?? null;

  return { order, items, billing, shipping, payments, shipments, shipmentItems, user };
}

export async function updateOrderUser(orderNo: number, userId: number): Promise<void> {
  await query(
    `UPDATE Order_No SET User_ID = @userId WHERE Order_No = @orderNo`,
    { orderNo, userId } as Record<string, number>
  );
}

export async function findUserBySearch(search: string): Promise<OrderUser | null> {
  if (!search.trim()) return null;
  const isId = /^\d+$/.test(search.trim());
  const rows = await query<OrderUser>(
    isId
      ? `SELECT User_ID, UserName, Email FROM Users WHERE User_ID = @val`
      : `SELECT User_ID, UserName, Email FROM Users WHERE UserName = @val`,
    { val: isId ? parseInt(search) : search.trim() } as Record<string, string | number>
  );
  return rows[0] ?? null;
}

// ── Order Editing ──────────────────────────────────────────────────────────────

export async function updateOrderItem(itemId: number, data: {
  Quantity: number;
  Price: number;
  OptPrice: number;
  AddonMultP: number;
  DiscAmount: number;
  Options: string;
  Addons: string;
}): Promise<void> {
  await query(
    `UPDATE Order_Items SET
       Quantity    = @Quantity,
       Price       = @Price,
       OptPrice    = @OptPrice,
       AddonMultP  = @AddonMultP,
       DiscAmount  = @DiscAmount,
       Options     = @Options,
       Addons      = @Addons
     WHERE Item_ID = @itemId`,
    { itemId, ...data } as Record<string, string | number>
  );
}

export async function deleteOrderItem(itemId: number): Promise<void> {
  await query(`DELETE FROM Order_Items WHERE Item_ID = @itemId`, { itemId });
}

export async function updateOrderTotals(orderNo: number, data: {
  ShipType: string;
  Shipping: number;
  Freight: number;
  AdminCredit: number;
  AdminCreditText: string;
}): Promise<void> {
  // Recalculate OrderTotal from live data after updating
  await query(
    `UPDATE Order_No SET
       ShipType        = @ShipType,
       Shipping        = @Shipping,
       Freight         = @Freight,
       AdminCredit     = @AdminCredit,
       AdminCreditText = @AdminCreditText
     WHERE Order_No = @orderNo`,
    { orderNo, ...data } as Record<string, string | number>
  );
  // Recalculate OrderTotal = item totals + Shipping + Freight + Tax - Credits - AdminCredit - OrderDisc
  await query(
    `UPDATE Order_No SET OrderTotal =
       ISNULL((SELECT SUM((OI.Price + ISNULL(OI.OptPrice,0) + ISNULL(OI.AddonMultP,0) - ISNULL(OI.DiscAmount,0)) * OI.Quantity)
               FROM Order_Items OI WHERE OI.Order_No = Order_No.Order_No), 0)
       + Order_No.Shipping + Order_No.Freight
       + ISNULL(Order_No.Tax, 0)
       - ISNULL(Order_No.Credits, 0)
       - ISNULL(Order_No.AdminCredit, 0)
       - ISNULL(Order_No.OrderDisc, 0)
     WHERE Order_No = @orderNo`,
    { orderNo }
  );
}

export async function searchProductsForOrder(q: string): Promise<{
  Product_ID: number; Name: string; SKU: string | null; UPC: string | null;
  Base_Price: number; Sm_image: string | null;
}[]> {
  if (!q.trim()) return [];
  return query(
    `SELECT TOP 30 Product_ID, Name, SKU, UPC, Base_Price,
       (SELECT TOP 1 Sm_image FROM Product_Images PI WHERE PI.Product_ID = P.Product_ID ORDER BY Product_Image_ID) AS Sm_image
     FROM Products P
     WHERE Display = 1
       AND (Name LIKE @q OR SKU LIKE @q OR UPC LIKE @q)
     ORDER BY Name`,
    { q: `%${q}%` }
  );
}

export async function addProductToOrder(
  orderNo: number,
  data: { Product_ID: number; Name: string; SKU: string | null; Quantity: number; Price: number; }
): Promise<void> {
  await query(
    `INSERT INTO Order_Items (Order_No, Product_ID, Name, SKU, Quantity, Price, OptPrice, AddonMultP, DiscAmount)
     VALUES (@orderNo, @Product_ID, @Name, @SKU, @Quantity, @Price, 0, 0, 0)`,
    { orderNo, ...data } as Record<string, string | number | null>
  );
  // Recalculate OrderTotal
  await query(
    `UPDATE Order_No SET OrderTotal =
       ISNULL((SELECT SUM((OI.Price + ISNULL(OI.OptPrice,0) + ISNULL(OI.AddonMultP,0) - ISNULL(OI.DiscAmount,0)) * OI.Quantity)
               FROM Order_Items OI WHERE OI.Order_No = Order_No.Order_No), 0)
       + Order_No.Shipping + Order_No.Freight
       + ISNULL(Order_No.Tax, 0)
       - ISNULL(Order_No.Credits, 0)
       - ISNULL(Order_No.AdminCredit, 0)
       - ISNULL(Order_No.OrderDisc, 0)
     WHERE Order_No = @orderNo`,
    { orderNo }
  );
}

export { addShipment, deleteShipment } from "./admin-order-shipments";
export type { ShipmentRow, ShipmentTrackingData } from "./admin-order-shipments";
export { getShipmentForTracking, updateShipmentTracking } from "./admin-order-shipments";
export { voidPayment, addManualPayment } from "./admin-order-payments";
export type { ManualPaymentData } from "./admin-order-payments";

export async function updateOrderStatus(orderNo: number, action: string): Promise<void> {
  const allowed = ["mark_paid","mark_unpaid","mark_process","mark_filled","mark_void","mark_unvoid"];
  if (!allowed.includes(action)) return;
  const sqls: Record<string, string> = {
    mark_paid:     "UPDATE Order_No SET Paid=1    WHERE Order_No=@orderNo",
    mark_unpaid:   "UPDATE Order_No SET Paid=0    WHERE Order_No=@orderNo",
    mark_process:  "UPDATE Order_No SET Process=1 WHERE Order_No=@orderNo",
    mark_filled:   "UPDATE Order_No SET Filled=1, DateFilled=GETDATE() WHERE Order_No=@orderNo",
    mark_void:     "UPDATE Order_No SET Void=1    WHERE Order_No=@orderNo",
    mark_unvoid:   "UPDATE Order_No SET Void=0    WHERE Order_No=@orderNo",
  };
  await query(sqls[action]!, { orderNo });
}

export async function saveOrderNotes(orderNo: number, notes: string): Promise<void> {
  await query("UPDATE Order_No SET Notes=@notes WHERE Order_No=@orderNo", { orderNo, notes });
}

export async function batchUpdateOrders(orderNos: number[], action: string): Promise<void> {
  if (orderNos.length === 0) return;
  const ph     = orderNos.map((_, i) => `@o${i}`).join(",");
  const params = Object.fromEntries(orderNos.map((id, i) => [`o${i}`, id]));
  const sqls: Record<string, string> = {
    process:        `UPDATE Order_No SET Process=1, Filled=0, Void=0 WHERE Order_No IN (${ph})`,
    pending:        `UPDATE Order_No SET Process=0, Filled=0, Void=0 WHERE Order_No IN (${ph})`,
    fill:           `UPDATE Order_No SET Filled=1, DateFilled=GETDATE(), Process=0 WHERE Order_No IN (${ph})`,
    "void-cancelled": `UPDATE Order_No SET Void=1, Status='CANCELED', Process=0, Filled=0 WHERE Order_No IN (${ph})`,
    "void-fraud":   `UPDATE Order_No SET Void=1, Status='FRAUD',    Process=0, Filled=0 WHERE Order_No IN (${ph})`,
  };
  if (!sqls[action]) throw new Error(`Unknown batch action: ${action}`);
  await query(sqls[action]!, params);
}
