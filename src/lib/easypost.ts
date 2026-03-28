import type { EasypostSettings } from "./queries/admin-shipping-easypost";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NucomAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
}

export interface VerifyResult {
  verified: boolean;
  address: NucomAddress;
  errors: string[];
}

export interface Rate {
  rate_id: string;
  ep_shipment_id: string;
  parcel_id: string;
  carrier: string;
  service: string;
  rate: number;
  delivery_days: number | null;
  delivery_date: string | null;
}

export interface LabelResult {
  label_url: string;
  tracking_code: string;
  carrier: string;
  service: string;
  rate: number;
  weight: number;
}

// ── Shared fetch helper ───────────────────────────────────────────────────────

function nucomHeaders(s: EasypostSettings) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${s.nucomAccessToken}`,
  };
}

function nucomBase(s: EasypostSettings) {
  return s.NucomServicesURL.replace(/\/$/, "");
}

function baseBody(s: EasypostSettings) {
  return {
    EasyPostAPIKey: s.EasyPostApiKey,
    EasyPostUrl:    s.EasyPostCallURL,
  };
}

// ── Address verification ──────────────────────────────────────────────────────

export async function nucomVerifyAddress(
  s: EasypostSettings,
  addr: NucomAddress
): Promise<VerifyResult> {
  const res = await fetch(
    `${nucomBase(s)}/rest/apis/nucom/easypost/verifyAddress`,
    {
      method: "POST",
      headers: nucomHeaders(s),
      body: JSON.stringify({ ...baseBody(s), ...addr }),
    }
  );
  const json = await res.json() as Record<string, unknown>;
  if (json.error) throw new Error(String((json.error as Record<string,unknown>).message ?? json.error));
  const a = (json.address ?? addr) as NucomAddress;
  const errors = (json.verifications as Record<string,unknown>)?.delivery
    ? (((json.verifications as Record<string,unknown>).delivery as Record<string,unknown>).errors as string[] ?? [])
    : [];
  return { verified: errors.length === 0, address: a, errors };
}

// ── Shipment rates ────────────────────────────────────────────────────────────

export interface RatesInput {
  from_address: NucomAddress;
  to_address: NucomAddress;
  weight_oz: number;
  length?: number;
  width?: number;
  height?: number;
}

export async function nucomGetRates(
  s: EasypostSettings,
  p: RatesInput
): Promise<Rate[]> {
  const res = await fetch(
    `${nucomBase(s)}/rest/apis/nucom/easypost/shipmentRates`,
    {
      method: "POST",
      headers: nucomHeaders(s),
      body: JSON.stringify({ ...baseBody(s), ...p }),
    }
  );
  const json = await res.json() as Record<string, unknown>;
  if (json.error) throw new Error(String((json.error as Record<string,unknown>).message ?? json.error));
  return (json.rates as Rate[]) ?? [];
}

// ── Buy label ─────────────────────────────────────────────────────────────────

export interface LabelInput {
  ep_shipment_id: string;
  rate_id: string;
}

export async function nucomBuyLabel(
  s: EasypostSettings,
  p: LabelInput
): Promise<LabelResult> {
  const res = await fetch(
    `${nucomBase(s)}/rest/apis/nucom/easypost/postageLabel`,
    {
      method: "POST",
      headers: nucomHeaders(s),
      body: JSON.stringify({ ...baseBody(s), ...p }),
    }
  );
  const json = await res.json() as Record<string, unknown>;
  if (json.error) throw new Error(String((json.error as Record<string,unknown>).message ?? json.error));
  return json as unknown as LabelResult;
}

// ── Refund / void label ───────────────────────────────────────────────────────

export async function nucomRefund(
  s: EasypostSettings,
  easypostShipmentId: string
): Promise<void> {
  const res = await fetch(
    `${nucomBase(s)}/rest/apis/nucom/easypost/refund`,
    {
      method: "POST",
      headers: nucomHeaders(s),
      body: JSON.stringify({ ...baseBody(s), shippingId: easypostShipmentId }),
    }
  );
  const json = await res.json() as Record<string, unknown>;
  if (json.error) throw new Error(String((json.error as Record<string,unknown>).message ?? json.error));
}
