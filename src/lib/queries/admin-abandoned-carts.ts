import { query } from "../db";

// ── List ──────────────────────────────────────────────────────────────────

export interface CartListOptions {
  startDate?: string;
  toDate?: string;
  basketnum?: string;
  customer?: string;
  step?: string;      // "" = has email (default), "all" = all, or specific step
  abandoned?: string; // "0"=no, "1"=yes, "2"=all (default "0")
  contacted_by_phone?: string; // same pattern
  prodid?: string;
  affiliate?: string;
  page?: number;
}

export interface CartListRow {
  BasketNum: string;
  DateAdded: Date;
  Firstname: string;
  Lastname: string;
  Company: string | null;
  Country: string | null;
  step: string | null;
  Abandoned: boolean;
  Contacted_by_phone: boolean;
  OrderTotal: number | null;
  Affiliate: number | null;
  User_ID: number | null;
  TotalProds: number;
  TotalItems: number;
}

export const PAGE_SIZE = 40;

export async function getAbandonedCarts(opts: CartListOptions): Promise<{ rows: CartListRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const params: Record<string, unknown> = {};

  const abandoned = opts.abandoned ?? "0";
  if (abandoned !== "2") {
    conditions.push(`T.Abandoned = @abandoned`);
    params.abandoned = parseInt(abandoned);
  }

  const byPhone = opts.contacted_by_phone ?? "2";
  if (byPhone !== "2") {
    conditions.push(`T.Contacted_by_phone = @byPhone`);
    params.byPhone = parseInt(byPhone);
  }

  const step = opts.step ?? "";
  if (step === "all") {
    // no filter
  } else if (step) {
    conditions.push(`T.step = @step`);
    params.step = step;
  } else {
    // default: has name and not just in cart
    conditions.push(`T.Firstname <> ''`);
    conditions.push(`T.step <> 'cart'`);
  }

  if (opts.basketnum?.trim()) {
    conditions.push(`T.TempCust_ID = @basketnum`);
    params.basketnum = opts.basketnum.trim();
  }

  if (opts.customer?.trim()) {
    conditions.push(`(T.Firstname LIKE @cust OR T.Lastname LIKE @cust OR T.Company LIKE @cust)`);
    params.cust = `%${opts.customer.trim()}%`;
  }

  if (opts.affiliate?.trim() && /^\d+$/.test(opts.affiliate.trim())) {
    conditions.push(`O.Affiliate = @affiliate`);
    params.affiliate = parseInt(opts.affiliate.trim());
  }

  if (opts.startDate) {
    conditions.push(`T.DateAdded >= @startDate`);
    params.startDate = new Date(opts.startDate);
  }
  if (opts.toDate) {
    conditions.push(`T.DateAdded <= @toDate`);
    params.toDate = new Date(opts.toDate + "T23:59:59");
  }

  let prodJoin = "";
  if (opts.prodid?.trim() && /^\d+$/.test(opts.prodid.trim())) {
    prodJoin = `INNER JOIN TempBasket PB ON T.TempCust_ID = PB.BasketNum AND PB.Product_ID = @prodid`;
    params.prodid = parseInt(opts.prodid.trim());
  }

  const where = conditions.join(" AND ");

  const countRows = await query<{ cnt: number }>(
    `SELECT COUNT(DISTINCT T.TempCust_ID) AS cnt
     FROM TempCustomer T
     LEFT JOIN TempOrder O ON T.TempCust_ID = O.BasketNum
     LEFT JOIN Users U ON O.BasketNum = U.Basket
     ${prodJoin}
     WHERE ${where}`,
    params
  );
  const total = countRows[0]?.cnt ?? 0;

  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await query<CartListRow>(
    `SELECT T.TempCust_ID AS BasketNum, T.DateAdded, T.Firstname, T.Lastname, T.Company,
            T.Country, T.step, T.Abandoned, T.Contacted_by_phone,
            O.OrderTotal, O.Affiliate, U.User_ID,
            ISNULL(PC.TotalProds, 0) AS TotalProds,
            ISNULL(PC.TotalItems, 0) AS TotalItems
     FROM TempCustomer T
     LEFT JOIN TempOrder O ON T.TempCust_ID = O.BasketNum
     LEFT JOIN Users U ON O.BasketNum = U.Basket
     ${prodJoin}
     LEFT JOIN (
       SELECT BasketNum,
              COUNT(DISTINCT Product_ID) AS TotalProds,
              SUM(Quantity) AS TotalItems
       FROM TempBasket
       WHERE Product_ID > 0
       GROUP BY BasketNum
     ) PC ON T.TempCust_ID = PC.BasketNum
     WHERE ${where}
     ORDER BY T.DateAdded DESC
     OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`,
    params
  );

  return { rows, total };
}

// ── Detail ────────────────────────────────────────────────────────────────

export interface CartCustomer {
  TempCust_ID: string;
  DateAdded: Date;
  Firstname: string;
  Lastname: string;
  Company: string | null;
  Email: string | null;
  Phone: string | null;
  Phone2: string | null;
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  State: string | null;
  State2: string | null;
  Zip: string | null;
  County: string | null;
  Country: string | null;
  step: string | null;
  Abandoned: boolean;
  Contacted_by_phone: boolean;
  Notes: string | null;
}

export interface CartOrder {
  BasketNum: string;
  OrderTotal: number | null;
  Affiliate: number | null;
  ShipType: string | null;
  Shipping: number | null;
  Referrer: string | null;
  Comments: string | null;
  Giftcard: string | null;
  User_ID: number | null;
  Username: string | null;
}

export interface CartItem {
  Basket_ID: string;
  Product_ID: number;
  ProductName: string | null;
  SKU: string | null;
  Options: string | null;
  Addons: string | null;
  Price: number;
  OptPrice: number;
  Quantity: number;
  QuantDisc: number;
}

export interface CartShipTo {
  Firstname: string | null;
  Lastname: string | null;
  Company: string | null;
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  State: string | null;
  State2: string | null;
  Zip: string | null;
  Country: string | null;
  Phone: string | null;
  Email: string | null;
}

export async function getCartDetail(basketNum: string): Promise<{
  customer: CartCustomer | null;
  order: CartOrder | null;
  items: CartItem[];
  shipTo: CartShipTo | null;
}> {
  const [custRows, orderRows, itemRows, shipRows] = await Promise.all([
    query<CartCustomer>(
      `SELECT TempCust_ID, DateAdded, Firstname, Lastname, Company, Email, Phone, Phone2,
              Address1, Address2, City, State, State2, Zip, County, Country,
              step, Abandoned, Contacted_by_phone, Notes
       FROM TempCustomer WHERE TempCust_ID = @id`,
      { id: basketNum }
    ),
    query<CartOrder>(
      `SELECT O.BasketNum, O.OrderTotal, O.Affiliate, O.ShipType, O.Shipping,
              O.Referrer, O.Comments, O.Giftcard,
              U.User_ID, U.Username
       FROM TempOrder O
       LEFT JOIN Users U ON O.BasketNum = U.Basket
       WHERE O.BasketNum = @id`,
      { id: basketNum }
    ),
    query<CartItem>(
      `SELECT TB.Basket_ID, TB.Product_ID, P.Name AS ProductName, TB.SKU,
              TB.Options, TB.Addons, TB.Price, TB.OptPrice, TB.Quantity, TB.QuantDisc
       FROM TempBasket TB
       LEFT JOIN Products P ON TB.Product_ID = P.Product_ID
       WHERE TB.BasketNum = @id AND TB.Product_ID > 0
       ORDER BY TB.DateAdded`,
      { id: basketNum }
    ),
    query<CartShipTo>(
      `SELECT Firstname, Lastname, Company, Address1, Address2, City, State, State2,
              Zip, Country, Phone, Email
       FROM TempShipTo WHERE TempShip_ID = @id`,
      { id: basketNum }
    ),
  ]);

  return {
    customer: custRows[0] ?? null,
    order:    orderRows[0] ?? null,
    items:    itemRows,
    shipTo:   shipRows[0] ?? null,
  };
}

export async function updateCart(basketNum: string, data: {
  Contacted_by_phone: boolean;
  Notes: string;
}): Promise<void> {
  await query(
    `UPDATE TempCustomer SET
       Contacted_by_phone = @Contacted_by_phone,
       ${data.Contacted_by_phone ? "Abandoned = 1," : ""}
       Notes = @Notes
     WHERE TempCust_ID = @id`,
    { id: basketNum, ...data }
  );
}

export async function markAbandoned(basketNum: string): Promise<void> {
  await query(
    `UPDATE TempCustomer SET Abandoned = 1 WHERE TempCust_ID = @id`,
    { id: basketNum }
  );
}
