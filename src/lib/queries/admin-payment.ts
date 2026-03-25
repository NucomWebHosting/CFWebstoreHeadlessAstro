import { query } from "../db";

// ── Payment Options (OrderSettings + CreditCards) ─────────────────────────

export interface CreditCard {
  ID: number;
  CardName: string;
  Used: boolean;
}

export interface PaymentOptions {
  // Offline / PO / Quotes
  AllowOffline: boolean;
  OfflineMessage: string | null;
  AllowPO: number;        // 0=No, 1=Yes all, 2=Approved only
  AllowQuote: number;     // 0=No, 1=Payment option, 2=Basket & payment

  // PayPal Standard
  UsePayPal: boolean;
  PaypalClientID: string | null;
  PaypalSecret: string | null;
  PayPalServer: string | null;   // "sandbox" | "live"
  PayPalLog: boolean;

  // Credit Cards
  OnlyOffline: boolean;          // inverted: 0 = use CC, 1 = no CC
  CCProcess: string | null;
  UseCVV2: boolean;
  StoreCardInfo: boolean;

  // ACH
  UseACH: boolean;

  // Tax method (Avatax vs internal)
  TaxMethod: number;
}

export interface GatewaySettings {
  Username: string | null;
  Password: string | null;
  Transtype: string | null;
  Setting1: string | null;
  Setting2: string | null;
  Setting3: string | null;
  CCServer: string | null;
  Use_token: boolean;
  paymentgatewaylist: string | null;
  useApplePay: boolean;
  useGooglePay: boolean;
  useAfterPay: boolean;
  NucomClientKey: string | null;
  NucomClientSecret: string | null;
  NucomAPIKey: string | null;
  CFWebstoreURL: string | null;
  NucomServicesURL: string | null;
  NucomAccessToken: string | null;
}

export async function getPaymentOptions(): Promise<{ options: PaymentOptions | null; cards: CreditCard[] }> {
  const [optRows, cardRows] = await Promise.all([
    query<PaymentOptions>(
      `SELECT AllowOffline, OfflineMessage, AllowPO, AllowQuote,
              UsePayPal, PaypalClientID, PaypalSecret, PayPalServer, PayPalLog,
              OnlyOffline, CCProcess, UseCVV2, StoreCardInfo, UseACH, TaxMethod
       FROM OrderSettings`
    ),
    query<CreditCard>("SELECT ID, CardName, Used FROM CreditCards ORDER BY CardName"),
  ]);
  return { options: optRows[0] ?? null, cards: cardRows };
}

export async function savePaymentOptions(
  o: PaymentOptions,
  selectedCardIds: number[]
): Promise<void> {
  await Promise.all([
    query(
      `UPDATE OrderSettings SET
         AllowOffline  = @AllowOffline,  OfflineMessage = @OfflineMessage,
         AllowPO       = @AllowPO,       AllowQuote     = @AllowQuote,
         UsePayPal     = @UsePayPal,     PaypalClientID = @PaypalClientID,
         PaypalSecret  = @PaypalSecret,  PayPalServer   = @PayPalServer,
         PayPalLog     = @PayPalLog,
         OnlyOffline   = @OnlyOffline,   CCProcess      = @CCProcess,
         UseCVV2       = @UseCVV2,       StoreCardInfo  = @StoreCardInfo,
         UseACH        = @UseACH,        TaxMethod      = @TaxMethod`,
      o
    ),
    // Mark selected cards as Used=1
    selectedCardIds.length > 0
      ? query(
          `UPDATE CreditCards SET Used = 1 WHERE ID IN (${selectedCardIds.map((_, i) => `@id${i}`).join(",")})`,
          Object.fromEntries(selectedCardIds.map((id, i) => [`id${i}`, id]))
        )
      : Promise.resolve([]),
    // Mark unselected cards as Used=0
    query(
      selectedCardIds.length > 0
        ? `UPDATE CreditCards SET Used = 0 WHERE ID NOT IN (${selectedCardIds.map((_, i) => `@id${i}`).join(",")})`
        : `UPDATE CreditCards SET Used = 0`,
      selectedCardIds.length > 0
        ? Object.fromEntries(selectedCardIds.map((id, i) => [`id${i}`, id]))
        : undefined
    ),
  ]);
}

// ── Gateway Settings (CCProcess table, ID=1) ──────────────────────────────

export async function getGatewaySettings(): Promise<GatewaySettings | null> {
  const rows = await query<GatewaySettings>(
    `SELECT Username, Password, Transtype, Setting1, Setting2, Setting3, CCServer,
            Use_token, paymentgatewaylist,
            useApplePay, useGooglePay, useAfterPay,
            NucomClientKey, NucomClientSecret, NucomAPIKey,
            CFWebstoreURL, NucomServicesURL, NucomAccessToken
     FROM CCProcess WHERE ID = 1`
  );
  return rows[0] ?? null;
}

export async function saveGatewaySettings(g: GatewaySettings): Promise<void> {
  await query(
    `UPDATE CCProcess SET
       Username           = @Username,
       Password           = @Password,
       Transtype          = @Transtype,
       Setting1           = @Setting1,
       Setting2           = @Setting2,
       Setting3           = @Setting3,
       CCServer           = @CCServer,
       Use_token          = @Use_token,
       paymentgatewaylist = @paymentgatewaylist,
       useApplePay        = @useApplePay,
       useGooglePay       = @useGooglePay,
       useAfterPay        = @useAfterPay,
       NucomClientKey     = @NucomClientKey,
       NucomClientSecret  = @NucomClientSecret,
       NucomAPIKey        = @NucomAPIKey,
       CFWebstoreURL      = @CFWebstoreURL,
       NucomServicesURL   = @NucomServicesURL
     WHERE ID = 1`,
    g
  );
}
