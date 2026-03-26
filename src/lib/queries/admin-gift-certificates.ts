import crypto from "node:crypto";
import { query } from "../db";

export interface GiftCertificate {
  Cert_ID:       number;
  Cert_Code:     string;
  Cust_Name:     string | null;
  Recipient:     string | null;
  CertAmount:    number;
  InitialAmount: number;
  Order_No:      number | null;
  StartDate:     Date | null;
  EndDate:       Date | null;
  Valid:         boolean;
  Type:          string;
}

export interface CertTransaction {
  Trans_ID:      number;
  Cert_ID:       number;
  Cert_Code:     string;
  CertAmount:    number;
  InitialAmount: number;
  amount:        number;
  Order_No:      number | null;
  Action:        string;
  Source:        string;
  enterdate:     Date;
  notes:         string | null;
}

export interface CertFilters {
  code?:          string;
  order_no?:      string;
  recipient?:     string;
  cust_name?:     string;
  certAmount?:    string;
  initialAmount?: string;
  valid?:         string;
  current?:       string; // 'current' | 'scheduled' | 'expired'
  type?:          string;
}

export async function getCertificates(filters: CertFilters = {}): Promise<GiftCertificate[]> {
  const conditions: string[] = [];
  const params: Record<string, string | number> = {};

  if (filters.code) {
    conditions.push("Cert_Code LIKE @code");
    params.code = `%${filters.code}%`;
  }
  if (filters.order_no) {
    conditions.push("Order_No = @order_no");
    params.order_no = parseInt(filters.order_no) || 0;
  }
  if (filters.recipient) {
    conditions.push("Recipient LIKE @recipient");
    params.recipient = `%${filters.recipient}%`;
  }
  if (filters.cust_name) {
    conditions.push("Cust_Name LIKE @cust_name");
    params.cust_name = `%${filters.cust_name}%`;
  }
  if (filters.certAmount) {
    conditions.push("CertAmount = @certAmount");
    params.certAmount = parseFloat(filters.certAmount) || 0;
  }
  if (filters.initialAmount) {
    conditions.push("InitialAmount = @initialAmount");
    params.initialAmount = parseFloat(filters.initialAmount) || 0;
  }
  if (filters.valid === "1") {
    conditions.push("Valid = 1");
  } else if (filters.valid === "0") {
    conditions.push("Valid = 0");
  }
  if (filters.type) {
    conditions.push("Type = @type");
    params.type = filters.type;
  }
  const now = new Date().toISOString();
  if (filters.current === "current") {
    conditions.push("(StartDate IS NULL OR StartDate <= @now1) AND (EndDate IS NULL OR EndDate >= @now2)");
    params.now1 = now; params.now2 = now;
  } else if (filters.current === "scheduled") {
    conditions.push("StartDate > @now1");
    params.now1 = now;
  } else if (filters.current === "expired") {
    conditions.push("EndDate < @now1");
    params.now1 = now;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return query<GiftCertificate>(
    `SELECT Cert_ID, Cert_Code, Cust_Name, Recipient, CertAmount, InitialAmount,
            Order_No, StartDate, EndDate, Valid, Type
     FROM   Certificates ${where}
     ORDER  BY Cert_ID DESC`,
    params
  );
}

export async function getCertificate(id: number): Promise<GiftCertificate | null> {
  const rows = await query<GiftCertificate>(
    `SELECT Cert_ID, Cert_Code, Cust_Name, Recipient, CertAmount, InitialAmount,
            Order_No, StartDate, EndDate, Valid, Type
     FROM   Certificates WHERE Cert_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function getCertTransactions(certId: number): Promise<CertTransaction[]> {
  return query<CertTransaction>(
    `SELECT Cert_ID, Cert_Code, CertAmount, InitialAmount, amount,
            Order_No, Action, Source, enterdate, notes
     FROM   CertTransactions
     WHERE  Cert_ID = @certId
     ORDER  BY enterdate DESC`,
    { certId }
  );
}

// Generate a unique 15-char cert code (uppercase, no 0/O/1/I)
async function generateCertCode(): Promise<string> {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excludes 0,O,1,I
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = "";
    const bytes = crypto.randomBytes(15);
    for (const byte of bytes) {
      code += CHARS[byte % CHARS.length];
    }
    const existing = await query<{ Cert_ID: number }>(
      "SELECT Cert_ID FROM Certificates WHERE Cert_Code = @code",
      { code }
    );
    if (!existing.length) return code;
  }
  throw new Error("Failed to generate unique cert code after 10 attempts");
}

export async function createCertificate(data: {
  Cust_Name: string; Recipient: string; CertAmount: number;
  Order_No: number | null; StartDate: string; EndDate: string; Valid: number;
}): Promise<{ certId: number; certCode: string }> {
  const certCode = await generateCertCode();
  const now = new Date().toISOString();

  // Insert certificate
  const result = await query<{ Cert_ID: number }>(
    `INSERT INTO Certificates
       (Cert_Code, Cust_Name, Recipient, CertAmount, InitialAmount, Order_No, StartDate, EndDate, Valid, Type)
     OUTPUT INSERTED.Cert_ID
     VALUES (@certCode, @Cust_Name, @Recipient, @CertAmount, @CertAmount,
             @Order_No, @StartDate, @EndDate, @Valid, 'Certificate')`,
    {
      certCode,
      Cust_Name:  data.Cust_Name,
      Recipient:  data.Recipient,
      CertAmount: data.CertAmount,
      Order_No:   data.Order_No ?? null,
      StartDate:  data.StartDate || null,
      EndDate:    data.EndDate   || null,
      Valid:      data.Valid,
    } as Record<string, string | number | null>
  );

  const certId = result[0].Cert_ID;

  // Initial transaction log
  await query(
    `INSERT INTO CertTransactions
       (Cert_Id, Cert_Code, CertAmount, InitialAmount, amount, Order_No, Action, Source, enterdate)
     VALUES (@certId, @certCode, @CertAmount, @CertAmount, @CertAmount,
             @Order_No, 'Created - Manual', 'Offline', @now)`,
    {
      certId,
      certCode,
      CertAmount: data.CertAmount,
      Order_No:   data.Order_No ?? null,
      now,
    } as Record<string, string | number | null>
  );

  return { certId, certCode };
}

export async function updateCertificate(id: number, data: {
  Cust_Name: string; Recipient: string; Order_No: number | null;
  StartDate: string; EndDate: string; Valid: number;
}): Promise<void> {
  await query(
    `UPDATE Certificates
     SET Cust_Name=@Cust_Name, Recipient=@Recipient, Order_No=@Order_No,
         StartDate=@StartDate, EndDate=@EndDate, Valid=@Valid
     WHERE Cert_ID=@id`,
    {
      ...data,
      Order_No:  data.Order_No ?? null,
      StartDate: data.StartDate || null,
      EndDate:   data.EndDate   || null,
      id,
    } as Record<string, string | number | null>
  );
}

export async function adjustCertAmount(certId: number, data: {
  amount: number; action: "Add" | "Subtract"; orderNo: number | null; notes: string;
}): Promise<void> {
  const cert = await getCertificate(certId);
  if (!cert) throw new Error("Certificate not found");

  const newAmount = data.action === "Add"
    ? cert.CertAmount + data.amount
    : cert.CertAmount - data.amount;

  const actionLabel = data.action === "Add" ? "Amount Added" : "Redeemed - Offline";
  const now = new Date().toISOString();

  await query(
    `UPDATE Certificates SET CertAmount=@newAmount WHERE Cert_ID=@certId`,
    { newAmount, certId }
  );

  await query(
    `INSERT INTO CertTransactions
       (Cert_Id, Cert_Code, CertAmount, InitialAmount, amount, Order_No, Action, Source, enterdate, notes)
     VALUES (@certId, @certCode, @newAmount, @prevAmount, @amount, @orderNo, @action, 'Offline', @now, @notes)`,
    {
      certId,
      certCode:   cert.Cert_Code,
      newAmount,
      prevAmount: cert.CertAmount,
      amount:     data.amount,
      orderNo:    data.orderNo ?? null,
      action:     actionLabel,
      now,
      notes:      data.notes || null,
    } as Record<string, string | number | null>
  );
}

export async function deleteCertificate(id: number): Promise<void> {
  await query(`DELETE FROM CertTransactions WHERE Cert_ID = @id`, { id });
  await query(`DELETE FROM Certificates WHERE Cert_ID = @id`, { id });
}
