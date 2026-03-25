import { query } from "../db";

export const PAGE_SIZE = 40;

// ── List ──────────────────────────────────────────────────────────────────

export interface AccountListRow {
  Account_ID: number;
  User_ID: number | null;
  Customer_ID: number | null;
  Account_Name: string;
  Type1: string | null;
  Directory_Live: boolean;
  Username: string | null;
}

export interface AccountListOptions {
  un?: string;
  account_name?: string;
  customer_id?: string;
  type1?: string;
  directory_live?: string; // "0", "1", or ""
  page?: number;
}

export async function getAccounts(
  opts: AccountListOptions
): Promise<{ rows: AccountListRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const params: Record<string, unknown> = {};

  if (opts.un?.trim()) {
    conditions.push(`U.Username LIKE @un`);
    params.un = `%${opts.un.trim()}%`;
  }
  if (opts.account_name?.trim()) {
    conditions.push(`A.Account_Name LIKE @account_name`);
    params.account_name = `%${opts.account_name.trim()}%`;
  }
  if (opts.customer_id?.trim() && /^\d+$/.test(opts.customer_id.trim())) {
    conditions.push(`A.Customer_ID = @customer_id`);
    params.customer_id = parseInt(opts.customer_id.trim());
  }
  if (opts.type1?.trim()) {
    conditions.push(`A.Type1 = @type1`);
    params.type1 = opts.type1.trim();
  }
  if (opts.directory_live === "0" || opts.directory_live === "1") {
    conditions.push(`A.Directory_Live = @directory_live`);
    params.directory_live = parseInt(opts.directory_live);
  }

  const where = conditions.join(" AND ");

  const countRows = await query<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt
     FROM Account A
     LEFT JOIN Users U ON A.User_ID = U.User_ID
     WHERE ${where}`,
    params
  );
  const total = countRows[0]?.cnt ?? 0;

  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await query<AccountListRow>(
    `SELECT A.Account_ID, A.User_ID, A.Customer_ID, A.Account_Name,
            A.Type1, A.Directory_Live, U.Username
     FROM Account A
     LEFT JOIN Users U ON A.User_ID = U.User_ID
     WHERE ${where}
     ORDER BY A.Account_ID DESC
     OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`,
    params
  );

  return { rows, total };
}

// ── Detail ────────────────────────────────────────────────────────────────

export interface AccountDetail {
  Account_ID: number;
  User_ID: number | null;
  Customer_ID: number | null;
  Account_Name: string;
  Type1: string | null;
  Description: string | null;
  Policy: string | null;
  Logo: string | null;
  Rep: string | null;
  Web_url: string | null;
  Map_url: string | null;
  Terms: string | null;
  Dropship_email: string | null;
  PO_text: string | null;
  Directory_Live: boolean;
  Hold_map: boolean;
  Sold_by_Amazon: boolean;
  Sold_by_manufactorer_on_amazon: boolean;
  LTSPManfID: number | null;
  Easypost_Carrier_Account_id: string | null;
  Username: string | null;
}

export async function getAccount(id: number): Promise<AccountDetail | null> {
  const rows = await query<AccountDetail>(
    `SELECT A.Account_ID, A.User_ID, A.Customer_ID, A.Account_Name, A.Type1,
            A.Description, A.Policy, A.Logo, A.Rep, A.Web_url, A.Map_url,
            A.Terms, A.Dropship_email, A.PO_text, A.Directory_Live,
            A.Hold_map, A.Sold_by_Amazon, A.Sold_by_manufactorer_on_amazon,
            A.LTSPManfID, A.Easypost_Carrier_Account_id,
            U.Username
     FROM Account A
     LEFT JOIN Users U ON A.User_ID = U.User_ID
     WHERE A.Account_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

// ── Lookup username → User_ID ─────────────────────────────────────────────

export async function findUserByUsername(
  username: string
): Promise<number | null> {
  if (!username.trim()) return 0; // blank username = User_ID 0
  const rows = await query<{ User_ID: number }>(
    `SELECT User_ID FROM Users WHERE Username = @username`,
    { username: username.trim() }
  );
  return rows[0]?.User_ID ?? null; // null = not found
}

// ── Create ────────────────────────────────────────────────────────────────

export async function createAccount(data: {
  User_ID: number;
  Customer_ID: number;
  Account_Name: string;
  Type1: string;
  Description: string;
  Policy: string;
  Logo: string;
  Rep: string;
  Web_url: string;
  Map_url: string;
  Terms: string;
  Dropship_email: string;
  PO_text: string;
  Directory_Live: boolean;
  Hold_map: boolean;
  Sold_by_Amazon: boolean;
  Sold_by_manufactorer_on_amazon: boolean;
  LTSPManfID: number;
  Easypost_Carrier_Account_id: string;
}): Promise<number> {
  const rows = await query<{ Account_ID: number }>(
    `INSERT INTO Account
       (User_ID, Customer_ID, Account_Name, Type1, Description, Policy, Logo, Rep,
        Web_url, Map_url, Terms, Dropship_email, PO_text, Directory_Live,
        Hold_map, Sold_by_Amazon, Sold_by_manufactorer_on_amazon,
        LTSPManfID, Easypost_Carrier_Account_id)
     OUTPUT INSERTED.Account_ID
     VALUES
       (@User_ID, @Customer_ID, @Account_Name, @Type1, @Description, @Policy, @Logo, @Rep,
        @Web_url, @Map_url, @Terms, @Dropship_email, @PO_text, @Directory_Live,
        @Hold_map, @Sold_by_Amazon, @Sold_by_manufactorer_on_amazon,
        @LTSPManfID, @Easypost_Carrier_Account_id)`,
    data
  );
  return rows[0]?.Account_ID ?? 0;
}

// ── Update ────────────────────────────────────────────────────────────────

export async function updateAccount(
  id: number,
  data: {
    User_ID: number;
    Customer_ID: number;
    Account_Name: string;
    Type1: string;
    Description: string;
    Policy: string;
    Logo: string;
    Rep: string;
    Web_url: string;
    Map_url: string;
    Terms: string;
    Dropship_email: string;
    PO_text: string;
    Directory_Live: boolean;
    Hold_map: boolean;
    Sold_by_Amazon: boolean;
    Sold_by_manufactorer_on_amazon: boolean;
    LTSPManfID: number;
    Easypost_Carrier_Account_id: string;
  }
): Promise<void> {
  await query(
    `UPDATE Account SET
       User_ID = @User_ID,
       Customer_ID = @Customer_ID,
       Account_Name = @Account_Name,
       Type1 = @Type1,
       Description = @Description,
       Policy = @Policy,
       Logo = @Logo,
       Rep = @Rep,
       Web_url = @Web_url,
       Map_url = @Map_url,
       Terms = @Terms,
       Dropship_email = @Dropship_email,
       PO_text = @PO_text,
       Directory_Live = @Directory_Live,
       Hold_map = @Hold_map,
       Sold_by_Amazon = @Sold_by_Amazon,
       Sold_by_manufactorer_on_amazon = @Sold_by_manufactorer_on_amazon,
       LTSPManfID = @LTSPManfID,
       Easypost_Carrier_Account_id = @Easypost_Carrier_Account_id
     WHERE Account_ID = @id`,
    { id, ...data }
  );
}

// ── Delete ────────────────────────────────────────────────────────────────

/** Returns an error string if the account is in use, or null if safe to delete. */
export async function checkAccountInUse(id: number): Promise<string | null> {
  const [orderRows, poRows] = await Promise.all([
    query<{ Order_No: string }>(
      `SELECT TOP 5 Order_No FROM Order_Items WHERE Dropship_Account_ID = @id`,
      { id }
    ),
    query<{ PO_No: string }>(
      `SELECT TOP 5 PO_No FROM Order_PO WHERE Account_ID = @id`,
      { id }
    ),
  ]);

  const msgs: string[] = [];
  if (orderRows.length > 0) {
    msgs.push(
      `Used as dropshipper on order(s): ${orderRows.map((r) => r.Order_No).join(", ")}`
    );
  }
  if (poRows.length > 0) {
    msgs.push(
      `Used in purchase order(s): ${poRows.map((r) => r.PO_No).join(", ")}`
    );
  }
  return msgs.length > 0 ? msgs.join(" | ") : null;
}

export async function deleteAccount(id: number): Promise<void> {
  // NULL out product references first, then delete
  await query(
    `UPDATE Products SET Mfg_Account_ID = NULL WHERE Mfg_Account_ID = @id`,
    { id }
  );
  await query(
    `UPDATE Products SET Account_ID = NULL WHERE Account_ID = @id`,
    { id }
  );
  await query(`DELETE FROM Account WHERE Account_ID = @id`, { id });
}
