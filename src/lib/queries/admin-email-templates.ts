import { query } from "../db";

export interface MailText {
  MailText_ID: number;
  MailText_Name: string;
  MailText_Subject: string;
  MailText_Message: string;
  System: boolean;
  MailAction: string;
}

export async function getMailTexts(): Promise<MailText[]> {
  return query<MailText>(
    `SELECT MailText_ID, MailText_Name, MailText_Subject, MailText_Message,
            CAST(System AS BIT) AS System, MailAction
     FROM MailText
     ORDER BY System DESC, MailAction`,
    {}
  );
}

export async function getMailText(id: number): Promise<MailText | null> {
  const rows = await query<MailText>(
    `SELECT MailText_ID, MailText_Name, MailText_Subject, MailText_Message,
            CAST(System AS BIT) AS System, MailAction
     FROM MailText
     WHERE MailText_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createMailText(data: {
  MailText_Name: string;
  MailText_Subject: string;
  MailText_Message: string;
  MailAction: string;
}): Promise<number> {
  await query(
    `INSERT INTO MailText (MailText_Name, MailText_Subject, MailText_Message, MailAction, System)
     VALUES (@MailText_Name, @MailText_Subject, @MailText_Message, @MailAction, 0)`,
    data
  );
  const rows = await query<{ newId: number }>(
    `SELECT CAST(SCOPE_IDENTITY() AS INT) AS newId`,
    {}
  );
  return rows[0]?.newId ?? 0;
}

export async function updateMailText(
  id: number,
  data: {
    MailText_Name: string;
    MailText_Subject: string;
    MailText_Message: string;
    MailAction: string;
  }
): Promise<void> {
  await query(
    `UPDATE MailText
     SET MailText_Name = @MailText_Name,
         MailText_Subject = @MailText_Subject,
         MailText_Message = @MailText_Message,
         MailAction = @MailAction
     WHERE MailText_ID = @id`,
    { id, ...data }
  );
}

export async function deleteMailText(id: number): Promise<void> {
  await query(
    `DELETE FROM MailText WHERE MailText_ID = @id AND System = 0`,
    { id }
  );
}
