import { query, getPool } from "../db";
import type { SettingsRow } from "../types";
import { createTransporter } from "../email";

export interface GroupRef { Group_ID: number; Name: string; }

export async function getAllGroupsSimple(): Promise<GroupRef[]> {
  return query<GroupRef>(`SELECT Group_ID, Name FROM Groups ORDER BY Name`, {});
}

export interface EmailFilters {
  verified?: string;       // "" | "0" | "1"
  subscribe?: string;      // "" | "0" | "1"
  un?: string;             // username
  gid?: string;            // group id or ""
  affiliate?: string;      // "" | "0" | "1"
  acct?: string;           // "" | "0" | "1"
  lastLogin?: string;      // ISO date or ""
  lastLogin_is?: string;   // "after" | "before" | "on"
  created?: string;        // ISO date or ""
  created_is?: string;
  member?: string;         // "1" if checked
  product_id?: string;
  sku?: string;
  dateOrdered?: string;
  dateOrdered_is?: string;
  dateFilled?: string;
  dateFilled_is?: string;
}

export interface EmailRecipient { email: string; User_ID: number; }

function isValidDate(s: string | undefined): boolean {
  return !!s && !isNaN(Date.parse(s));
}

export async function getEmailRecipients(f: EmailFilters): Promise<EmailRecipient[]> {
  const orderSearch =
    (f.product_id && f.product_id.trim() !== "") ||
    (f.sku && f.sku.trim() !== "") ||
    isValidDate(f.dateOrdered) ||
    isValidDate(f.dateFilled);

  const memberJoin = f.member === "1";
  const acctFilter = f.acct !== undefined && f.acct !== "";

  const params: Record<string, string | number | boolean | null> = {};

  let sql = `SELECT DISTINCT U.Email, U.User_ID FROM `;

  if (orderSearch) {
    sql += `((Order_Items O INNER JOIN Order_No N ON O.Order_No = N.Order_No) INNER JOIN Users U ON N.User_ID = U.User_ID)`;
  } else {
    sql += `Users U`;
  }

  if (memberJoin) {
    sql += ` INNER JOIN Memberships M ON M.User_ID = U.User_ID`;
  }

  if (acctFilter) {
    sql += ` LEFT JOIN Account A ON A.User_ID = U.User_ID`;
  }

  sql += ` WHERE U.EmailIsBad = 0`;

  if (f.un && f.un.trim()) {
    sql += ` AND U.Username = @un`;
    params.un = f.un.trim();
  }

  if (f.verified === "1") {
    sql += ` AND U.EmailLock = 'verified'`;
  } else if (f.verified === "0") {
    sql += ` AND U.EmailLock <> 'verified' AND U.EmailLock <> ''`;
  }

  if (f.subscribe === "1") {
    sql += ` AND U.Subscribe = 1`;
  } else if (f.subscribe === "0") {
    sql += ` AND U.Subscribe = 0`;
  }

  if (f.gid && f.gid.trim() !== "") {
    if (f.gid === "0") {
      sql += ` AND (U.Group_ID IS NULL OR U.Group_ID = 0)`;
    } else {
      sql += ` AND U.Group_ID = @gid`;
      params.gid = Number(f.gid);
    }
  }

  if (f.affiliate === "1") {
    sql += ` AND U.Affiliate_ID <> 0`;
  } else if (f.affiliate === "0") {
    sql += ` AND U.Affiliate_ID = 0`;
  }

  if (acctFilter) {
    if (f.acct === "1") {
      sql += ` AND A.Account_ID IS NOT NULL`;
    } else {
      sql += ` AND A.Account_ID IS NULL`;
    }
  }

  if (isValidDate(f.lastLogin)) {
    const op = f.lastLogin_is === "before" ? "<" : f.lastLogin_is === "on" ? "=" : ">";
    sql += ` AND U.LastLogin ${op} @lastLogin`;
    params.lastLogin = f.lastLogin!;
  }

  if (isValidDate(f.created)) {
    const op = f.created_is === "before" ? "<" : f.created_is === "on" ? "=" : ">";
    sql += ` AND U.Created ${op} @created`;
    params.created = f.created!;
  }

  if (memberJoin) {
    sql += ` AND (M.Start <= GETDATE() OR M.Start IS NULL)
             AND (M.Expire >= GETDATE() OR M.Expire IS NULL)
             AND (M.Suspend_Begin_Date IS NULL OR M.Suspend_Begin_Date >= GETDATE())`;
  }

  if (f.product_id && f.product_id.trim() !== "") {
    sql += ` AND O.Product_ID = @product_id`;
    params.product_id = Number(f.product_id);
  }

  if (f.sku && f.sku.trim() !== "") {
    sql += ` AND O.SKU = @sku`;
    params.sku = f.sku.trim();
  }

  if (isValidDate(f.dateOrdered)) {
    const op = f.dateOrdered_is === "before" ? "<" : f.dateOrdered_is === "on" ? "=" : ">";
    sql += ` AND N.DateOrdered ${op} @dateOrdered`;
    params.dateOrdered = f.dateOrdered!;
  }

  if (isValidDate(f.dateFilled)) {
    const op = f.dateFilled_is === "before" ? "<" : f.dateFilled_is === "on" ? "=" : ">";
    sql += ` AND N.DateFilled ${op} @dateFilled`;
    params.dateFilled = f.dateFilled!;
  }

  return query<EmailRecipient>(sql, params);
}

export async function sendBulkEmails(
  recipients: EmailRecipient[],
  subject: string,
  body: string,
  settings: SettingsRow | null,
  siteName: string,
  fromEmail: string
): Promise<{ sent: number; failed: number }> {
  const transporter = createTransporter(settings);
  if (!transporter) throw new Error("Email is not configured.");

  let sent = 0;
  let failed = 0;

  for (const r of recipients) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(r.email)) { failed++; continue; }
    try {
      await transporter.sendMail({
        from: `${siteName} <${fromEmail}>`,
        to: r.email,
        subject,
        html: body,
        replyTo: fromEmail,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed };
}
