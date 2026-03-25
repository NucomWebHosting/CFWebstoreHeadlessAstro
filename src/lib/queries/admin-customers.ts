import { query } from "../db";

export const PAGE_SIZE = 40;

// ── Reference data ─────────────────────────────────────────────────────────

export interface StateRow { Abb: string; Name: string; }
export interface CountryRow { Abbrev: string; Country: string; }

export async function getStates(): Promise<StateRow[]> {
  return query<StateRow>(`SELECT Abb, Name FROM States ORDER BY Name`, {});
}

export async function getCountries(): Promise<CountryRow[]> {
  return query<CountryRow>(
    `SELECT Abbrev, Country FROM Countries ORDER BY Country`,
    {}
  );
}

// ── List ───────────────────────────────────────────────────────────────────

export interface CustomerListRow {
  Customer_ID: number;
  User_ID: number | null;
  Firstname: string;
  LastName: string;
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
  LastUsed: Date | null;
  Username: string | null;
  // bill-to / ship-to badges
  BillTo: number | null;   // Users.Customer_ID
  ShipTo: number | null;   // Users.ShipTo
}

export interface CustomerListOptions {
  un?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  location?: string; // address/city/state/zip/country
  phone?: string;
  email?: string;
  lastused?: string; // date string "last used after"
  show?: string;     // "recent" | "all"
  page?: number;
}

export async function getCustomers(
  opts: CustomerListOptions
): Promise<{ rows: CustomerListRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const params: Record<string, unknown> = {};

  // Default: recent = last 7 days
  if ((opts.show ?? "recent") === "recent") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    conditions.push(`C.LastUsed >= @recentCutoff`);
    params.recentCutoff = weekAgo;
  }

  if (opts.un?.trim()) {
    conditions.push(`U.Username LIKE @un`);
    params.un = `%${opts.un.trim()}%`;
  }
  if (opts.firstname?.trim()) {
    conditions.push(`C.Firstname LIKE @firstname`);
    params.firstname = `%${opts.firstname.trim()}%`;
  }
  if (opts.lastname?.trim()) {
    conditions.push(`C.LastName LIKE @lastname`);
    params.lastname = `%${opts.lastname.trim()}%`;
  }
  if (opts.company?.trim()) {
    conditions.push(`C.Company LIKE @company`);
    params.company = `%${opts.company.trim()}%`;
  }
  if (opts.location?.trim()) {
    const loc = `%${opts.location.trim()}%`;
    conditions.push(
      `(C.Address1 LIKE @loc OR C.Address2 LIKE @loc OR C.City LIKE @loc ` +
      `OR C.County LIKE @loc OR C.State LIKE @loc OR C.State2 LIKE @loc ` +
      `OR C.Zip LIKE @loc OR C.Country LIKE @loc)`
    );
    params.loc = loc;
  }
  if (opts.phone?.trim()) {
    conditions.push(`C.Phone LIKE @phone`);
    params.phone = `%${opts.phone.trim()}%`;
  }
  if (opts.email?.trim()) {
    conditions.push(`C.Email LIKE @email`);
    params.email = `%${opts.email.trim()}%`;
  }
  if (opts.lastused?.trim()) {
    const d = new Date(opts.lastused.trim());
    if (!isNaN(d.getTime())) {
      conditions.push(`C.LastUsed > @lastused`);
      params.lastused = d;
    }
  }

  const where = conditions.join(" AND ");

  const countRows = await query<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt
     FROM Customers C
     LEFT JOIN Users U ON C.User_ID = U.User_ID
     WHERE ${where}`,
    params
  );
  const total = countRows[0]?.cnt ?? 0;

  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await query<CustomerListRow>(
    `SELECT C.Customer_ID, C.User_ID, C.Firstname, C.LastName, C.Company,
            C.Address1, C.Address2, C.City, C.State, C.State2, C.Zip,
            C.Country, C.Phone, C.Email, C.LastUsed,
            U.Username, U.Customer_ID AS BillTo, U.ShipTo
     FROM Customers C
     LEFT JOIN Users U ON C.User_ID = U.User_ID
     WHERE ${where}
     ORDER BY C.Customer_ID DESC
     OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`,
    params
  );

  return { rows, total };
}

// ── Detail ─────────────────────────────────────────────────────────────────

export interface CustomerDetail {
  Customer_ID: number;
  User_ID: number | null;
  Firstname: string;
  LastName: string;
  Company: string | null;
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  County: string | null;
  State: string | null;
  State2: string | null;
  Zip: string | null;
  Country: string | null;
  Phone: string | null;
  Phone2: string | null;
  Fax: string | null;
  Email: string | null;
  Residence: boolean;
  LastUsed: Date | null;
  Username: string | null;
}

export async function getCustomer(id: number): Promise<CustomerDetail | null> {
  const rows = await query<CustomerDetail>(
    `SELECT C.Customer_ID, C.User_ID, C.Firstname, C.LastName, C.Company,
            C.Address1, C.Address2, C.City, C.County, C.State, C.State2,
            C.Zip, C.Country, C.Phone, C.Phone2, C.Fax, C.Email,
            C.Residence, C.LastUsed, U.Username
     FROM Customers C
     LEFT JOIN Users U ON C.User_ID = U.User_ID
     WHERE C.Customer_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

// ── Lookup username → User_ID ──────────────────────────────────────────────

export async function findUserByUsername(
  username: string
): Promise<number | null> {
  if (!username.trim()) return 0;
  const rows = await query<{ User_ID: number }>(
    `SELECT User_ID FROM Users WHERE Username = @username`,
    { username: username.trim() }
  );
  return rows[0]?.User_ID ?? null;
}

// ── Create ─────────────────────────────────────────────────────────────────

export interface CustomerData {
  User_ID: number;
  Firstname: string;
  LastName: string;
  Company: string;
  Address1: string;
  Address2: string;
  City: string;
  County: string;
  State: string;
  State2: string;
  Zip: string;
  Country: string;
  Phone: string;
  Phone2: string;
  Fax: string;
  Email: string;
  Residence: boolean;
}

export async function createCustomer(data: CustomerData): Promise<number> {
  const rows = await query<{ Customer_ID: number }>(
    `INSERT INTO Customers
       (User_ID, Firstname, LastName, Company, Address1, Address2, City, County,
        State, State2, Zip, Country, Phone, Phone2, Fax, Email, Residence, LastUsed)
     OUTPUT INSERTED.Customer_ID
     VALUES
       (@User_ID, @Firstname, @LastName, @Company, @Address1, @Address2, @City, @County,
        @State, @State2, @Zip, @Country, @Phone, @Phone2, @Fax, @Email, @Residence, GETDATE())`,
    data
  );
  return rows[0]?.Customer_ID ?? 0;
}

// ── Update ─────────────────────────────────────────────────────────────────

export async function updateCustomer(id: number, data: CustomerData): Promise<void> {
  await query(
    `UPDATE Customers SET
       User_ID   = @User_ID,
       Firstname = @Firstname,
       LastName  = @LastName,
       Company   = @Company,
       Address1  = @Address1,
       Address2  = @Address2,
       City      = @City,
       County    = @County,
       State     = @State,
       State2    = @State2,
       Zip       = @Zip,
       Country   = @Country,
       Phone     = @Phone,
       Phone2    = @Phone2,
       Fax       = @Fax,
       Email     = @Email,
       Residence = @Residence
     WHERE Customer_ID = @id`,
    { id, ...data }
  );
}

// ── Delete ─────────────────────────────────────────────────────────────────

/** Returns order numbers if customer is referenced, or null if safe to delete. */
export async function checkCustomerInUse(id: number): Promise<string | null> {
  const rows = await query<{ Order_No: number }>(
    `SELECT TOP 5 Order_No FROM Order_No WHERE Customer_ID = @id OR ShipTo = @id`,
    { id }
  );
  if (rows.length === 0) return null;
  return `Used in order(s): ${rows.map((r) => r.Order_No).join(", ")}`;
}

export async function deleteCustomer(id: number): Promise<void> {
  // Clear foreign key references, then delete
  await query(`UPDATE Users SET Customer_ID = 0 WHERE Customer_ID = @id`, { id });
  await query(`UPDATE Users SET ShipTo = 0 WHERE ShipTo = @id`, { id });
  await query(`UPDATE Account SET Customer_ID = 0 WHERE Customer_ID = @id`, { id });
  await query(`DELETE FROM Customers WHERE Customer_ID = @id`, { id });
}
