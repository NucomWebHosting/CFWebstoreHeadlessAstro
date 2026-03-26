import { query } from "../db";

export interface AmazonSettings {
  ID: number;
  Seller_ID:        string | null;
  Marketplace_ID:   string | null;
  AWS_Key:          string | null;
  Secret_Key:       string | null;
  lws_client_id:    string | null;
  lws_client_secret: string | null;
  Refresh_Token:    string | null;
  Application_ID:   string | null;
}

export async function getAmazonSettings(): Promise<AmazonSettings | null> {
  const rows = await query<AmazonSettings>(`
    SELECT ID, Seller_ID, Marketplace_ID, AWS_Key, Secret_Key,
           lws_client_id, lws_client_secret, Refresh_Token, Application_ID
    FROM   amazon_settings
    WHERE  ID = 1
  `);
  return rows[0] ?? null;
}

export async function saveRefreshToken(token: string): Promise<void> {
  await query(
    `UPDATE amazon_settings SET Refresh_Token = @token WHERE ID = 1`,
    { token }
  );
}
