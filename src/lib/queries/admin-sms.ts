import { query } from "../db";

// ── Twilio Settings ─────────────────────────────────────────────────────────

export interface TwilioSettings {
  PhoneNumber: string;
  Account_SID: string;
  Auth_token:  string;
}

export async function getTwilioSettings(): Promise<TwilioSettings | null> {
  const rows = await query<TwilioSettings>(
    `SELECT TOP 1 PhoneNumber, Account_SID, Auth_token FROM Twilio_Settings`,
    {}
  );
  return rows[0] ?? null;
}

export async function saveTwilioSettings(data: TwilioSettings): Promise<void> {
  const existing = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM Twilio_Settings`, {});
  if ((existing[0]?.n ?? 0) > 0) {
    await query(
      `UPDATE Twilio_Settings SET
         PhoneNumber = @PhoneNumber,
         Account_SID = @Account_SID,
         Auth_token  = @Auth_token`,
      data
    );
  } else {
    await query(
      `INSERT INTO Twilio_Settings (PhoneNumber, Account_SID, Auth_token)
       VALUES (@PhoneNumber, @Account_SID, @Auth_token)`,
      data
    );
  }
}

// ── Send SMS ─────────────────────────────────────────────────────────────────

export async function sendSms(
  toPhone: string,
  text: string,
  settings: TwilioSettings
): Promise<string> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${settings.Account_SID}/Messages.json`;

  const credentials = Buffer.from(
    `${settings.Account_SID}:${settings.Auth_token}`
  ).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type":  "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      From: `+${settings.PhoneNumber.replace(/\D/g, "")}`,
      To:   `+${toPhone.replace(/\D/g, "")}`,
      Body: text,
    }).toString(),
  });

  const json = await res.json() as { error_message?: string; status?: string };
  if (!res.ok) return json.error_message ?? `Twilio error ${res.status}`;
  return "";
}

// ── SMS Templates ────────────────────────────────────────────────────────────

export interface SmsText {
  SMSText_ID:      number;
  SMSText_Name:    string;
  SMSText_Message: string;
  Subscribe_SMS:   boolean;
}

export async function getSmsTexts(): Promise<SmsText[]> {
  return query<SmsText>(
    `SELECT SMSText_ID, SMSText_Name, SMSText_Message, CAST(Subscribe_SMS AS BIT) AS Subscribe_SMS
     FROM SMSTexts
     ORDER BY SMSText_Name`,
    {}
  );
}

export async function getSmsText(id: number): Promise<SmsText | null> {
  const rows = await query<SmsText>(
    `SELECT SMSText_ID, SMSText_Name, SMSText_Message, CAST(Subscribe_SMS AS BIT) AS Subscribe_SMS
     FROM SMSTexts WHERE SMSText_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createSmsText(data: {
  SMSText_Name: string;
  SMSText_Message: string;
  Subscribe_SMS: number;
}): Promise<number> {
  await query(
    `INSERT INTO SMSTexts (SMSText_Name, SMSText_Message, Subscribe_SMS)
     VALUES (@SMSText_Name, @SMSText_Message, @Subscribe_SMS)`,
    data
  );
  const rows = await query<{ newId: number }>(
    `SELECT CAST(SCOPE_IDENTITY() AS INT) AS newId`, {}
  );
  return rows[0]?.newId ?? 0;
}

export async function updateSmsText(
  id: number,
  data: { SMSText_Name: string; SMSText_Message: string; Subscribe_SMS: number }
): Promise<void> {
  await query(
    `UPDATE SMSTexts
     SET SMSText_Name = @SMSText_Name, SMSText_Message = @SMSText_Message, Subscribe_SMS = @Subscribe_SMS
     WHERE SMSText_ID = @id`,
    { id, ...data }
  );
}

export async function deleteSmsText(id: number): Promise<void> {
  await query(`DELETE FROM SMSTexts WHERE SMSText_ID = @id`, { id });
}
