import { query } from "../db";

export interface AvataxSettings {
  AccountID:    string | null;
  APIkey:       string | null;
  CompanyCode:  string | null;
  CustomerCode: string | null;
  APIURL:       string | null;
  TaxShipping:  boolean;
  TaxAddress:   string | null;
}

export interface AvataxStateRow {
  Abb:    string;
  Name:   string;
  active: boolean;
}

export async function getAvataxSettings(): Promise<AvataxSettings | null> {
  const rows = await query<AvataxSettings>(
    `SELECT AccountID, APIkey, CompanyCode, CustomerCode, APIURL, TaxShipping, TaxAddress
     FROM Avatax_Settings`,
    {}
  );
  return rows[0] ?? null;
}

export async function getAvataxStates(): Promise<AvataxStateRow[]> {
  return query<AvataxStateRow>(
    `SELECT s.Abb, s.Name,
            CASE WHEN a.StateCode IS NOT NULL THEN 1 ELSE 0 END AS active
     FROM States s
     LEFT JOIN Avatax_State a ON a.StateCode = s.Abb
     ORDER BY s.Name ASC`,
    {}
  );
}

export async function saveAvataxSettings(data: {
  AccountID:    string;
  APIkey:       string;
  CompanyCode:  string;
  CustomerCode: string;
  APIURL:       string;
  TaxShipping:  boolean;
  TaxAddress:   string;
}): Promise<void> {
  await query(
    `UPDATE Avatax_Settings SET
       AccountID    = @AccountID,
       APIkey       = @APIkey,
       CompanyCode  = @CompanyCode,
       CustomerCode = @CustomerCode,
       APIURL       = @APIURL,
       TaxShipping  = @TaxShipping,
       TaxAddress   = @TaxAddress`,
    data
  );
}

export async function saveAvataxStates(stateCodes: string[]): Promise<void> {
  await query(`DELETE FROM Avatax_State`, {});
  for (const code of stateCodes) {
    await query(
      `INSERT INTO Avatax_State (StateCode, bActive) VALUES (@code, 1)`,
      { code }
    );
  }
}
