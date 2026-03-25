/**
 * Amazon Selling Partner API (SP-API) client.
 *
 * Auth flow:
 *  1. Exchange REFRESH_TOKEN → short-lived access_token via LWA
 *  2. Sign every request with AWS Signature Version 4 (service: execute-api)
 *  3. Attach x-amz-access-token + signed Authorization header
 */

import crypto from "node:crypto";

const BASE_URL = "https://sellingpartnerapi-na.amazon.com";
const LWA_URL  = "https://api.amazon.com/auth/o2/token";
const REGION   = "us-east-1";
const SERVICE  = "execute-api";
const HOST     = "sellingpartnerapi-na.amazon.com";

// ── Crypto helpers ─────────────────────────────────────────────────────────

function sha256hex(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

function hmacBuf(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function hmacHex(key: Buffer | string, data: string): string {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest("hex");
}

function getSigningKey(secretKey: string, dateStamp: string): Buffer {
  const kDate    = hmacBuf("AWS4" + secretKey, dateStamp);
  const kRegion  = hmacBuf(kDate, REGION);
  const kService = hmacBuf(kRegion, SERVICE);
  return hmacBuf(kService, "aws4_request");
}

// ── LWA token exchange ─────────────────────────────────────────────────────

export async function getAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type:    "refresh_token",
    refresh_token: process.env.AMAZON_REFRESH_TOKEN ?? "",
    client_id:     process.env.AMAZON_LWS_CLIENT_ID ?? "",
    client_secret: process.env.AMAZON_LWS_CLIENT_SECRET ?? "",
  });

  const res = await fetch(LWA_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LWA token exchange failed (${res.status}): ${text}`);
  }

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// ── Signed request ─────────────────────────────────────────────────────────

export async function makeRequest<T>(
  method:  string,
  path:    string,
  query:   Record<string, string | string[]> = {},
  body?:   string,
): Promise<T> {
  const accessKey  = process.env.AMAZON_AWS_KEY ?? "";
  const secretKey  = process.env.AMAZON_SECRET_KEY ?? "";
  const accessToken = await getAccessToken();

  // Timestamps
  const now = new Date();
  const amzDate   = now.toISOString().replace(/[:-]/g, "").replace(/\.\d{3}/, "");
  const dateStamp = amzDate.slice(0, 8);

  // Canonical query string — array values become repeated params, all sorted
  const pairs: [string, string][] = [];
  for (const [k, v] of Object.entries(query)) {
    if (Array.isArray(v)) { for (const item of v) pairs.push([k, item]); }
    else pairs.push([k, v]);
  }
  const sortedQuery = pairs
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  // Canonical headers (lowercase, sorted, newline-terminated)
  const canonicalHeaders = `host:${HOST}\nx-amz-date:${amzDate}\n`;
  const signedHeaders    = "host;x-amz-date";
  const payloadHash      = sha256hex(body ?? "");

  const canonicalRequest = [
    method.toUpperCase(),
    path,
    sortedQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // String to sign
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256hex(canonicalRequest),
  ].join("\n");

  // Signature
  const signingKey  = getSigningKey(secretKey, dateStamp);
  const signature   = hmacHex(signingKey, stringToSign);
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const url = `${BASE_URL}${path}${sortedQuery ? "?" + sortedQuery : ""}`;

  const headers: Record<string, string> = {
    "host":               HOST,
    "x-amz-access-token": accessToken,
    "x-amz-date":         amzDate,
    "Authorization":      authorization,
    "Content-Type":       "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SP-API ${method} ${path} → ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ── Marketplace Participations ─────────────────────────────────────────────

export interface SPMarketplace {
  id:                  string;
  name:                string;
  countryCode:         string;
  defaultCurrencyCode: string;
  defaultLanguageCode: string;
  domainName:          string;
}

export interface SPParticipation {
  isParticipating:      boolean;
  hasSuspendedListings: boolean;
}

export interface MarketplaceParticipation {
  marketplace:   SPMarketplace;
  participation: SPParticipation;
}

interface MarketplaceParticipationsResponse {
  payload: MarketplaceParticipation[];
}

export async function getMarketplaceParticipations(): Promise<MarketplaceParticipation[]> {
  const res = await makeRequest<MarketplaceParticipationsResponse>(
    "GET",
    "/sellers/v1/marketplaceParticipations"
  );
  return res.payload ?? [];
}

// ── Orders ─────────────────────────────────────────────────────────────────

export interface SPMoney { CurrencyCode: string; Amount: string; }

export interface SPOrder {
  AmazonOrderId:          string;
  PurchaseDate:           string;
  LastUpdateDate:         string;
  OrderStatus:            string;
  FulfillmentChannel?:    string;
  SalesChannel?:          string;
  OrderType?:             string;
  ShipServiceLevel?:      string;
  NumberOfItemsShipped:   number;
  NumberOfItemsUnshipped: number;
  OrderTotal?:            SPMoney;
  BuyerInfo?: {
    BuyerEmail?: string;
    BuyerName?:  string;
  };
  ShippingAddress?: {
    Name?:            string;
    AddressLine1?:    string;
    AddressLine2?:    string;
    City?:            string;
    StateOrRegion?:   string;
    PostalCode?:      string;
    CountryCode?:     string;
  };
}

export interface SPOrderItem {
  ASIN:             string;
  OrderItemId:      string;
  SellerSKU?:       string;
  Title?:           string;
  QuantityOrdered:  number;
  QuantityShipped:  number;
  ItemPrice?:       SPMoney;
  ItemTax?:         SPMoney;
  ShippingPrice?:   SPMoney;
  ShippingTax?:     SPMoney;
  PromotionDiscount?: SPMoney;
}

export interface GetOrdersParams {
  lastUpdatedAfter?:  string; // ISO-8601
  lastUpdatedBefore?: string;
  orderStatuses?:     string[];
  nextToken?:         string;
}

export async function getOrders(params: GetOrdersParams = {}): Promise<{ orders: SPOrder[]; nextToken?: string }> {
  const query: Record<string, string | string[]> = {
    MarketplaceIds: [process.env.AMAZON_MARKETPLACE_ID ?? "ATVPDKIKX0DER"],
  };
  if (params.lastUpdatedAfter)    query.LastUpdatedAfter  = params.lastUpdatedAfter;
  if (params.lastUpdatedBefore)   query.LastUpdatedBefore = params.lastUpdatedBefore;
  if (params.orderStatuses?.length) query.OrderStatuses   = params.orderStatuses;
  if (params.nextToken)           query.NextToken         = params.nextToken;

  const res = await makeRequest<{ payload: { Orders: SPOrder[]; NextToken?: string } }>(
    "GET", "/orders/v0/orders", query
  );
  return { orders: res.payload.Orders ?? [], nextToken: res.payload.NextToken };
}

export async function getOrder(orderId: string): Promise<SPOrder> {
  const res = await makeRequest<{ payload: SPOrder }>("GET", `/orders/v0/orders/${orderId}`);
  return res.payload;
}

export async function getOrderItems(orderId: string): Promise<SPOrderItem[]> {
  const res = await makeRequest<{ payload: { OrderItems: SPOrderItem[]; AmazonOrderId: string } }>(
    "GET", `/orders/v0/orders/${orderId}/orderItems`
  );
  return res.payload.OrderItems ?? [];
}
