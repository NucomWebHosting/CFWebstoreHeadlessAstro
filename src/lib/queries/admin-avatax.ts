import { query } from "../db";

export interface AvataxSettings {
  AccountID: string | null;
  APIkey: string | null;
  CompanyCode: string | null;
  CustomerCode: string | null;
  APIURL: string | null;
  TaxShipping: boolean;
  TaxAddress: string | null;
  nucomServicesURL: string | null;
  NucomClientKey: string | null;
  NucomClientSecret: string | null;
  NucomAPIKey: string | null;
  CFWebstoreURL: string | null;
  NucomAccessToken: string | null;
}

export interface AvataxStateRow {
  Abb: string;
  Name: string;
  active: boolean;
}

export async function getAvataxSettings(): Promise<AvataxSettings | null> {
  const rows = await query<AvataxSettings>(
    `SELECT AccountID, APIkey, CompanyCode, CustomerCode, APIURL,
            TaxShipping, TaxAddress,
            nucomServicesURL, NucomClientKey, NucomClientSecret,
            NucomAPIKey, CFWebstoreURL, NucomAccessToken
     FROM Avatax_Settings`,
    {}
  );
  return rows[0] ?? null;
}

/** All states with a flag indicating whether they're active in Avatax_State */
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

/** Save Avatax-only fields (always saved) */
export async function saveAvataxKeys(data: {
  AccountID: string;
  APIkey: string;
  CompanyCode: string;
  CustomerCode: string;
  APIURL: string;
  TaxShipping: boolean;
  TaxAddress: string;
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

/** Save Nucom fields + access token (only called when token exchange succeeds) */
export async function saveNucomKeys(data: {
  nucomServicesURL: string;
  NucomClientKey: string;
  NucomClientSecret: string;
  NucomAPIKey: string;
  CFWebstoreURL: string;
  NucomAccessToken: string;
}): Promise<void> {
  await query(
    `UPDATE Avatax_Settings SET
       nucomServicesURL  = @nucomServicesURL,
       NucomClientKey    = @NucomClientKey,
       NucomClientSecret = @NucomClientSecret,
       NucomAPIKey       = @NucomAPIKey,
       CFWebstoreURL     = @CFWebstoreURL,
       NucomAccessToken  = @NucomAccessToken`,
    data
  );
}

/** Replace active states: truncate then insert checked ones */
export async function saveAvataxStates(stateCodes: string[]): Promise<void> {
  await query(`DELETE FROM Avatax_State`, {});
  for (const code of stateCodes) {
    await query(
      `INSERT INTO Avatax_State (StateCode, bActive) VALUES (@code, 1)`,
      { code }
    );
  }
}

/** Try to exchange Nucom credentials for an access token */
export async function fetchNucomToken(
  nucomServicesURL: string,
  nucomClientKey: string,
  nucomClientSecret: string,
  nucomAPIKey: string,
  cfWebstoreURL: string
): Promise<string | null> {
  try {
    const credentials = Buffer.from(`${nucomClientKey}:${nucomClientSecret}`).toString("base64");
    const body = new URLSearchParams({ NucomAPIKey: nucomAPIKey });
    const res = await fetch(`${nucomServicesURL}/rest/apis/nucom/auth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        CfwebstoreURL: cfWebstoreURL,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (!res.ok) return null;
    const json = await res.json() as { access_token?: string };
    return json.access_token ?? null;
  } catch {
    return null;
  }
}
