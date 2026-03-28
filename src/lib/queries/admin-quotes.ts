import { query } from "../db";

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface QuoteListItem {
  Order_No:     number;
  DateOrdered:  Date;
  Customer_ID:  number;
  User_ID:      number;
  FirstName:    string;
  LastName:     string;
  OrderTotal:   number;
  AmountPaid:   number;
  Process:      boolean;
  Filled:       boolean;
  Paid:         boolean;
  ItemTotal:    number;   // SUM of Quantity from Order_Items_Quote
  ProductCount: number;  // distinct Product_ID count
}

export interface QuoteItem {
  Item_ID:    number;
  Product_ID: number;
  Name:       string;
  SKU:        string;
  Options:    string;
  Addons:     string;
  Price:      number;
  OptPrice:   number;
  AddonMultP: number;
  DiscAmount: number;
  Quantity:   number;
}

export interface Quote {
  Order_No:        number;
  DateOrdered:     Date;
  Customer_ID:     number;
  ShipTo:          number;
  User_ID:         number;
  OrderTotal:      number;
  Shipping:        number;
  Tax:             number;
  AdminCredit:     number;
  AdminCreditText: string;
  Notes:           string;
  Process:         boolean;
  Filled:          boolean;
  Paid:            boolean;
  ShipType:        string;
  InvoiceNum:      string;
  Comments:        string;
  // Customer
  FirstName:  string;
  LastName:   string;
  Email:      string;
  Phone:      string;
  Address1:   string;
  Address2:   string;
  City:       string;
  State:      string;
  Zip:        string;
  Country:    string;
  // Billing customer (same record in Customers table, linked via Customer_ID)
}

// ── List ──────────────────────────────────────────────────────────────────────

export interface QuoteFilters {
  dateRange?:  "today" | "yesterday" | "thismonth" | "lastmonth" | "thisyear";
  invoiceNum?: string;
  customer?:   string;
}

export async function getQuotes(filters: QuoteFilters = {}): Promise<QuoteListItem[]> {
  const conditions: string[] = [
    "N.Process = 0",
    "N.Filled  = 0",
  ];
  const params: Record<string, unknown> = {};

  if (filters.dateRange) {
    switch (filters.dateRange) {
      case "today":
        conditions.push("CAST(N.DateOrdered AS DATE) = CAST(GETDATE() AS DATE)");
        break;
      case "yesterday":
        conditions.push("CAST(N.DateOrdered AS DATE) = CAST(DATEADD(day,-1,GETDATE()) AS DATE)");
        break;
      case "thismonth":
        conditions.push("MONTH(N.DateOrdered) = MONTH(GETDATE()) AND YEAR(N.DateOrdered) = YEAR(GETDATE())");
        break;
      case "lastmonth":
        conditions.push("MONTH(N.DateOrdered) = MONTH(DATEADD(month,-1,GETDATE())) AND YEAR(N.DateOrdered) = YEAR(DATEADD(month,-1,GETDATE()))");
        break;
      case "thisyear":
        conditions.push("YEAR(N.DateOrdered) = YEAR(GETDATE())");
        break;
    }
  }

  if (filters.invoiceNum?.trim()) {
    conditions.push("N.InvoiceNum LIKE @invoiceNum");
    params["invoiceNum"] = `%${filters.invoiceNum.trim()}%`;
  }

  if (filters.customer?.trim()) {
    conditions.push("(C.FirstName + ' ' + C.LastName LIKE @customer OR C.Email LIKE @customer)");
    params["customer"] = `%${filters.customer.trim()}%`;
  }

  const where = conditions.map(c => `(${c})`).join(" AND ");

  const rows = await query<QuoteListItem>(`
    SELECT
      N.Order_No,
      N.DateOrdered,
      N.Customer_ID,
      N.User_ID,
      C.FirstName,
      C.LastName,
      N.OrderTotal,
      COALESCE((SELECT SUM(amount) FROM Payment P WHERE P.Order_No = N.Order_No), 0) AS AmountPaid,
      N.Process,
      N.Filled,
      N.Paid,
      COALESCE((SELECT SUM(O.Quantity) FROM Order_Items_Quote O WHERE O.Order_No = N.Order_No), 0) AS ItemTotal,
      COALESCE((SELECT COUNT(DISTINCT O.Product_ID) FROM Order_Items_Quote O WHERE O.Order_No = N.Order_No), 0) AS ProductCount
    FROM Order_No_Quote N
    LEFT JOIN Customers C ON C.Customer_ID = N.Customer_ID
    WHERE ${where}
    ORDER BY N.DateOrdered DESC
  `, params);

  return rows;
}

// ── Single quote ──────────────────────────────────────────────────────────────

export async function getQuote(orderNo: number): Promise<Quote | null> {
  const rows = await query<Quote>(`
    SELECT TOP 1
      N.Order_No, N.DateOrdered, N.Customer_ID, N.ShipTo, N.User_ID,
      N.OrderTotal, N.Shipping, N.Tax,
      COALESCE(N.AdminCredit, 0)     AS AdminCredit,
      COALESCE(N.AdminCreditText,'') AS AdminCreditText,
      COALESCE(N.Notes,'')           AS Notes,
      N.Process, N.Filled, N.Paid,
      COALESCE(N.ShipType,'')    AS ShipType,
      COALESCE(N.InvoiceNum,'')  AS InvoiceNum,
      COALESCE(N.Comments,'')    AS Comments,
      COALESCE(C.FirstName,'')   AS FirstName,
      COALESCE(C.LastName,'')    AS LastName,
      COALESCE(C.Email,'')       AS Email,
      COALESCE(C.Phone,'')       AS Phone,
      COALESCE(C.Address1,'')    AS Address1,
      COALESCE(C.Address2,'')    AS Address2,
      COALESCE(C.City,'')        AS City,
      COALESCE(C.State,'')       AS State,
      COALESCE(C.Zip,'')         AS Zip,
      COALESCE(C.Country,'')     AS Country
    FROM Order_No_Quote N
    LEFT JOIN Customers C ON C.Customer_ID = N.Customer_ID
    WHERE N.Order_No = @orderNo
  `, { orderNo });
  return rows[0] ?? null;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').trim();
}

export async function getQuoteItems(orderNo: number): Promise<QuoteItem[]> {
  const rows = await query<QuoteItem>(`
    SELECT Item_ID, Product_ID, Name, COALESCE(SKU,'') AS SKU,
           COALESCE(Options,'') AS Options, COALESCE(Addons,'') AS Addons,
           Price, COALESCE(OptPrice,0) AS OptPrice,
           COALESCE(AddonMultP,0) AS AddonMultP, COALESCE(DiscAmount,0) AS DiscAmount,
           Quantity
    FROM Order_Items_Quote
    WHERE Order_No = @orderNo
    ORDER BY Item_ID
  `, { orderNo });
  return rows.map(r => ({ ...r, Name: stripHtml(r.Name) }));
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function updateQuoteNotes(orderNo: number, notes: string): Promise<void> {
  await query(`
    UPDATE Order_No_Quote
    SET Notes = @notes, Admin_Updated = GETDATE()
    WHERE Order_No = @orderNo
  `, { orderNo, notes });
}

export async function updateQuoteTotals(
  orderNo: number,
  data: { shipping: number; tax: number; adminCredit: number; adminCreditText: string }
): Promise<void> {
  const { shipping, tax, adminCredit, adminCreditText } = data;
  await query(`
    UPDATE Order_No_Quote
    SET Shipping = @shipping, Tax = @tax,
        AdminCredit = @adminCredit, AdminCreditText = @adminCreditText,
        Admin_Updated = GETDATE()
    WHERE Order_No = @orderNo
  `, { orderNo, shipping, tax, adminCredit, adminCreditText });
}

export async function deleteQuote(orderNo: number): Promise<void> {
  await query(`DELETE FROM Order_Items_Quote WHERE Order_No = @orderNo`, { orderNo });
  await query(`DELETE FROM Order_No_Quote     WHERE Order_No = @orderNo`, { orderNo });
}

/** Copy the quote into Order_No + Order_Items, mark quote as Process=1. */
export async function convertQuoteToPending(orderNo: number): Promise<number> {
  // Insert into Order_No (copies all columns)
  await query(`
    INSERT INTO Order_No
      (ID_Tag, Customer_ID, User_ID, Card_ID, ShipTo, OriginalTotal, OrderTotal, Tax,
       Shipping, ShipType, Weight, Freight, Comments, AuthNumber, InvoiceNum, TransactNum,
       LastTransactNum, Notes, Abandoned, Affiliate, Referrer, Giftcard, Delivery, OrderDisc,
       Credits, AddonTotal, Coup_Code, Cert_Code, TermsUsed, IPAddress, Paid, Filled,
       Process, Void, Printed_Inv, Printed_Pack, CodesSent, InvDone, PayPalStatus, Reason,
       OfflinePayment, PO_Number, Source, AdminCredit, QB_export, Printed_quote, SettingID, DateOrdered)
    SELECT
      ID_Tag, Customer_ID, User_ID, Card_ID, ShipTo, OriginalTotal, OrderTotal, Tax,
      Shipping, ShipType, Weight, Freight, Comments, AuthNumber, InvoiceNum, TransactNum,
      LastTransactNum, CAST(Notes AS NVARCHAR(4000)) + ' Quote No: ' + CAST(@orderNo AS NVARCHAR(20)),
      Abandoned, Affiliate, Referrer, Giftcard, Delivery, OrderDisc,
      Credits, AddonTotal, Coup_Code, Cert_Code, TermsUsed, IPAddress, Paid, Filled,
      Process, Void, Printed_Inv, Printed_Pack, CodesSent, InvDone, PayPalStatus, Reason,
      OfflinePayment, PO_Number, Source, AdminCredit, QB_export, Printed_quote, SettingID, DateOrdered
    FROM Order_No_Quote
    WHERE Order_No = @orderNo
  `, { orderNo });

  const newOrderRows = await query<{ newOrderNo: number }>(
    `SELECT CAST(SCOPE_IDENTITY() AS INT) AS newOrderNo`, {}
  );
  const newOrderNo = newOrderRows[0]?.newOrderNo ?? 0;

  // Copy items
  await query(`
    INSERT INTO Order_Items
      (Item_ID, Order_No, Product_ID, Name, UPC, ALU, SKU, Options, OptionID_List, ChoiceID_list,
       Addons, AddonMultP, AddonNonMultP, Price, Quantity, Quantity_shipped,
       DiscAmount, Disc_Code, PromoAmount, PromoQuant, Promo_Code,
       OptQuant, OptChoice, OptPrice, Per_Item_Weight)
    SELECT
      Item_ID, @newOrderNo, Product_ID, Name, UPC, ALU, SKU, Options, OptionID_List, ChoiceID_list,
      Addons, AddonMultP, AddonNonMultP, Price, Quantity, Quantity_shipped,
      DiscAmount, Disc_Code, PromoAmount, PromoQuant, Promo_Code,
      OptQuant, OptChoice, OptPrice, Per_Item_Weight
    FROM Order_Items_Quote
    WHERE Order_No = @orderNo
  `, { orderNo, newOrderNo });

  // Mark quote as processed (hide from list)
  await query(`UPDATE Order_No_Quote SET Process = 1 WHERE Order_No = @orderNo`, { orderNo });

  return newOrderNo;
}

// ── Line item edits ───────────────────────────────────────────────────────────

async function recalcQuoteTotal(orderNo: number): Promise<void> {
  await query(`
    UPDATE Order_No_Quote SET OrderTotal =
      ISNULL((SELECT SUM((OI.Price + ISNULL(OI.OptPrice,0) + ISNULL(OI.AddonMultP,0) - ISNULL(OI.DiscAmount,0)) * OI.Quantity)
              FROM Order_Items_Quote OI WHERE OI.Order_No = Order_No_Quote.Order_No), 0)
      + Order_No_Quote.Shipping
      + ISNULL(Order_No_Quote.Tax, 0)
      - ISNULL(Order_No_Quote.AdminCredit, 0)
    WHERE Order_No = @orderNo
  `, { orderNo });
}

export async function updateQuoteItem(
  itemId: number,
  data: { Quantity: number; Price: number; OptPrice: number; AddonMultP: number; DiscAmount: number; Options: string; Addons: string }
): Promise<void> {
  await query(`
    UPDATE Order_Items_Quote
    SET Quantity = @Quantity, Price = @Price, OptPrice = @OptPrice,
        AddonMultP = @AddonMultP, DiscAmount = @DiscAmount,
        Options = @Options, Addons = @Addons
    WHERE Item_ID = @itemId
  `, { itemId, ...data } as Record<string, string | number>);
}

export async function deleteQuoteItem(itemId: number): Promise<void> {
  // Need orderNo for recalc — fetch it first
  const rows = await query<{ Order_No: number }>(`SELECT Order_No FROM Order_Items_Quote WHERE Item_ID = @itemId`, { itemId });
  await query(`DELETE FROM Order_Items_Quote WHERE Item_ID = @itemId`, { itemId });
  if (rows[0]) await recalcQuoteTotal(rows[0].Order_No);
}

export async function updateQuoteOrderTotals(
  orderNo: number,
  data: { ShipType: string; Shipping: number; Tax: number; AdminCredit: number; AdminCreditText: string }
): Promise<void> {
  await query(`
    UPDATE Order_No_Quote
    SET ShipType = @ShipType, Shipping = @Shipping, Tax = @Tax,
        AdminCredit = @AdminCredit, AdminCreditText = @AdminCreditText,
        Admin_Updated = GETDATE()
    WHERE Order_No = @orderNo
  `, { orderNo, ...data } as Record<string, string | number>);
  await recalcQuoteTotal(orderNo);
}

export async function addProductToQuote(
  orderNo: number,
  data: { Product_ID: number; Name: string; SKU: string | null; Quantity: number; Price: number }
): Promise<void> {
  await query(`
    INSERT INTO Order_Items_Quote (Item_ID, Order_No, Product_ID, Name, SKU, Quantity, Price, OptPrice, AddonMultP, DiscAmount)
    VALUES (
      ISNULL((SELECT MAX(Item_ID) FROM Order_Items_Quote), 0) + 1,
      @orderNo, @Product_ID, @Name, @SKU, @Quantity, @Price, 0, 0, 0
    )
  `, { orderNo, ...data } as Record<string, string | number | null>);
  await recalcQuoteTotal(orderNo);
}
