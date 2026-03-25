import { query } from "../db";

export interface SystemTextRow {
  SystemText_ID: number;
  Text_Name: string;
  CallAction: string | null;
  Display: boolean;
}

export interface SystemTextDetail {
  SystemText_ID: number;
  Text_Name: string;
  CallAction: string | null;
  System_Text: string | null;
  MergeCodes: string | null;
  Display: boolean;
}

export async function getSystemTexts(name?: string): Promise<SystemTextRow[]> {
  const conditions = ["1=1"];
  const params: Record<string, unknown> = {};
  if (name?.trim()) {
    conditions.push("Text_Name LIKE @name");
    params.name = `%${name.trim()}%`;
  }
  return query<SystemTextRow>(
    `SELECT SystemText_ID, Text_Name, CallAction, Display
     FROM SystemText
     WHERE ${conditions.join(" AND ")}
     ORDER BY SystemText_ID ASC`,
    params
  );
}

export async function getSystemText(id: number): Promise<SystemTextDetail | null> {
  const rows = await query<SystemTextDetail>(
    `SELECT SystemText_ID, Text_Name, CallAction, System_Text, MergeCodes, Display
     FROM SystemText WHERE SystemText_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createSystemText(data: {
  Text_Name: string;
  CallAction: string;
  System_Text: string;
  Display: boolean;
}): Promise<number> {
  const rows = await query<{ SystemText_ID: number }>(
    `INSERT INTO SystemText (Text_Name, CallAction, System_Text, MergeCodes, Display)
     OUTPUT INSERTED.SystemText_ID
     VALUES (@Text_Name, @CallAction, @System_Text, NULL, @Display)`,
    data
  );
  return rows[0]?.SystemText_ID ?? 0;
}

export async function updateSystemText(id: number, data: {
  Text_Name: string;
  CallAction: string;
  System_Text: string;
  Display: boolean;
}): Promise<void> {
  await query(
    `UPDATE SystemText
     SET Text_Name   = @Text_Name,
         CallAction  = @CallAction,
         System_Text = @System_Text,
         Display     = @Display
     WHERE SystemText_ID = @id`,
    { id, ...data }
  );
}

export async function deleteSystemText(id: number): Promise<void> {
  await query(`DELETE FROM SystemText WHERE SystemText_ID = @id`, { id });
}
