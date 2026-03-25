import { query } from "../db";

// ── List ───────────────────────────────────────────────────────────────────────

export interface UserListRow {
  User_ID: number;
  Username: string;
  Email: string;
  FirstName: string | null;
  LastName: string | null;
  Created: Date | null;
  LastLogin: Date | null;
  Group_ID: number | null;
  GroupName: string | null;
  Customer_ID: number | null;
  ShipTo: number | null;
  Allow_PO: boolean;
  Disable: boolean;
  EmailIsBad: boolean;
  EmailLock: string | null;
  Accounts: number;
}

export interface UserListOptions {
  show?: string;      // "recent" | "all"
  un?: string;        // username or numeric UID
  email?: string;
  firstname?: string;
  lastname?: string;
  gid?: string;
  allow_po?: string;  // "1" | "0"
  page?: number;
  perPage?: number;
}

export async function getUsersAdmin(
  opts: UserListOptions = {}
): Promise<{ rows: UserListRow[]; total: number }> {
  const {
    show = "recent",
    un = "", email = "", firstname = "", lastname = "",
    gid = "", allow_po = "",
    page = 1, perPage = 40,
  } = opts;

  const conditions: string[] = ["1=1"];
  const params: Record<string, string | number | boolean | null> = {};

  // Default: recent = last 7 days
  if (show === "recent") {
    conditions.push("U.LastLogin >= DATEADD(day, -7, GETDATE())");
  }

  if (un.trim()) {
    if (/^\d+$/.test(un.trim())) {
      conditions.push("U.User_ID = @uid");
      params.uid = parseInt(un);
    } else {
      conditions.push("U.Username LIKE '%' + @un + '%'");
      params.un = un.trim();
    }
  }

  if (email.trim()) {
    conditions.push("U.Email LIKE '%' + @email + '%'");
    params.email = email.trim();
  }

  if (firstname.trim()) {
    conditions.push("C.FirstName LIKE '%' + @firstname + '%'");
    params.firstname = firstname.trim();
  }

  if (lastname.trim()) {
    conditions.push("C.LastName LIKE '%' + @lastname + '%'");
    params.lastname = lastname.trim();
  }

  if (gid !== "") {
    if (gid === "0") {
      conditions.push("(U.Group_ID IS NULL OR U.Group_ID = 0)");
    } else if (/^\d+$/.test(gid)) {
      conditions.push("U.Group_ID = @gid");
      params.gid = parseInt(gid);
    }
  }

  if (allow_po === "1") conditions.push("U.Allow_PO = 1");
  if (allow_po === "0") conditions.push("U.Allow_PO = 0");

  const where = conditions.join(" AND ");
  const offset = (page - 1) * perPage;
  const countParams = { ...params };
  params.offset = offset;
  params.perPage = perPage;

  const BASE_FROM = `
    FROM Users U
    LEFT JOIN Groups G ON U.Group_ID = G.Group_ID
    LEFT JOIN Customers C ON U.Customer_ID = C.Customer_ID
  `;

  const [rows, counts] = await Promise.all([
    query<UserListRow>(
      `SELECT U.User_ID, U.Username, U.Email, U.Created, U.LastLogin,
              U.Group_ID, G.Name AS GroupName,
              U.Customer_ID, U.ShipTo, U.Allow_PO, U.Disable,
              U.EmailIsBad, U.EmailLock,
              C.FirstName, C.LastName,
              (SELECT COUNT(*) FROM Account A WHERE A.User_ID = U.User_ID) AS Accounts
       ${BASE_FROM}
       WHERE ${where}
       ORDER BY U.Username ASC
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

// ── Groups list (for select box) ──────────────────────────────────────────────

export interface GroupRow {
  Group_ID: number;
  Name: string;
}

export async function getAllGroups(): Promise<GroupRow[]> {
  return query<GroupRow>("SELECT Group_ID, Name FROM Groups ORDER BY Name ASC");
}

// ── Single user ───────────────────────────────────────────────────────────────

export interface UserDetail {
  User_ID: number;
  Username: string;
  Email: string;
  Group_ID: number | null;
  GroupName: string | null;
  Customer_ID: number | null;
  ShipTo: number | null;
  Subscribe: boolean;
  Disable: boolean;
  EmailIsBad: boolean;
  EmailLock: string | null;
  Allow_PO: boolean;
  TaxExempt: boolean;
  TaxID: string | null;
  AdminNotes: string | null;
  LastLogin: Date | null;
  Created: Date | null;
  LoginsTotal: number | null;
  LoginsDay: number | null;
  FailedLogins: number | null;
}

export interface UserCustomerRow {
  Customer_ID: number;
  Address1: string | null;
  FirstName: string | null;
  LastName: string | null;
}

export async function getUserAdmin(userId: number): Promise<{
  user: UserDetail | null;
  customers: UserCustomerRow[];
}> {
  const [users, customers] = await Promise.all([
    query<UserDetail>(
      `SELECT U.User_ID, U.Username, U.Email, U.Group_ID, G.Name AS GroupName,
              U.Customer_ID, U.ShipTo, U.Subscribe, U.Disable,
              U.EmailIsBad, U.EmailLock, U.Allow_PO, U.TaxExempt, U.TaxID,
              U.AdminNotes, U.LastLogin, U.Created,
              U.LoginsTotal, U.LoginsDay, U.FailedLogins
       FROM Users U
       LEFT JOIN Groups G ON U.Group_ID = G.Group_ID
       WHERE U.User_ID = @userId`,
      { userId }
    ),
    query<UserCustomerRow>(
      `SELECT Customer_ID, Address1, FirstName, LastName
       FROM Customers
       WHERE User_ID = @userId
       ORDER BY Customer_ID ASC`,
      { userId }
    ),
  ]);

  return { user: users[0] ?? null, customers };
}

// ── Update user ───────────────────────────────────────────────────────────────

export interface UserUpdateData {
  Username: string;
  Email: string;
  Password?: string;
  Group_ID: number;
  Customer_ID: number;
  ShipTo: number;
  Subscribe: boolean;
  Disable: boolean;
  EmailIsBad: boolean;
  Allow_PO: boolean;
  AdminNotes: string;
}

export async function updateUser(userId: number, data: UserUpdateData): Promise<void> {
  if (data.Password) {
    // Hash the new password with SHA-256 (same as CF admin: Hash(pw, "SHA-256"))
    const { createHash } = await import("crypto");
    const hashed = createHash("sha256").update(data.Password).digest("hex").toUpperCase();
    await query(
      `UPDATE Users SET
         Username = @Username, Email = @Email, Password = @Password,
         Group_ID = @Group_ID, Customer_ID = @Customer_ID, ShipTo = @ShipTo,
         Subscribe = @Subscribe, Disable = @Disable, EmailIsBad = @EmailIsBad,
         Allow_PO = @Allow_PO, AdminNotes = @AdminNotes
       WHERE User_ID = @userId`,
      { ...data, Password: hashed, userId }
    );
  } else {
    await query(
      `UPDATE Users SET
         Username = @Username, Email = @Email,
         Group_ID = @Group_ID, Customer_ID = @Customer_ID, ShipTo = @ShipTo,
         Subscribe = @Subscribe, Disable = @Disable, EmailIsBad = @EmailIsBad,
         Allow_PO = @Allow_PO, AdminNotes = @AdminNotes
       WHERE User_ID = @userId`,
      { ...data, userId }
    );
  }
}
