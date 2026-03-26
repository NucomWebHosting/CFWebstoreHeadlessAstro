import { query } from "../db";

export interface CustomField {
  Custom_ID: number;
  Custom_Name: string | null;
  Custom_Display: boolean;
  Google_Use: boolean;
  Google_Code: string | null;
}

export async function getCustomFields(): Promise<CustomField[]> {
  return query<CustomField>(
    `SELECT Custom_ID, Custom_Name, Custom_Display, Google_Use, Google_Code
     FROM   Prod_CustomFields
     ORDER  BY Custom_ID`
  );
}

export interface CustomFieldRow {
  id?: number;       // undefined = new
  name: string;
  display: boolean;
  googleUse: boolean;
  googleCode: string;
  delete?: boolean;
}

export async function saveCustomFields(rows: CustomFieldRow[]): Promise<void> {
  for (const row of rows) {
    if (row.delete && row.id) {
      await query(`DELETE FROM Prod_CustInfo      WHERE Custom_ID = @id`, { id: row.id });
      await query(`DELETE FROM Prod_CustomFields  WHERE Custom_ID = @id`, { id: row.id });
    } else if (row.delete) {
      // new row marked for delete — nothing to do
    } else if (row.id) {
      await query(
        `UPDATE Prod_CustomFields
         SET    Custom_Name    = @name,
                Custom_Display = @display,
                Google_Use     = @googleUse,
                Google_Code    = @googleCode
         WHERE  Custom_ID = @id`,
        { id: row.id, name: row.name, display: row.display ? 1 : 0, googleUse: row.googleUse ? 1 : 0, googleCode: row.googleCode }
      );
    } else {
      await query(
        `INSERT INTO Prod_CustomFields (Custom_Name, Custom_Display, Google_Use, Google_Code)
         VALUES (@name, @display, @googleUse, @googleCode)`,
        { name: row.name, display: row.display ? 1 : 0, googleUse: row.googleUse ? 1 : 0, googleCode: row.googleCode }
      );
    }
  }
}
