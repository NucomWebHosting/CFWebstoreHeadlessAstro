import { query } from "../db";

export const PAGE_SIZE = 50;

// ── Geocoding ──────────────────────────────────────────────────────────────

export async function geocodeAddress(
  address1: string, city: string, state: string, zip: string,
  apiKey: string
): Promise<{ lat: string; lng: string; error?: string }> {
  if (!apiKey) return { lat: "", lng: "", error: "No Google API key configured." };

  const addr = encodeURIComponent(`${address1} ${city} ${state} ${zip}`);
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=${apiKey}`
    );
    const json = await res.json() as {
      status: string;
      error_message?: string;
      results?: Array<{ geometry: { location: { lat: number; lng: number } } }>;
    };
    if (json.status === "OK" && json.results?.[0]) {
      const loc = json.results[0].geometry.location;
      return { lat: String(loc.lat), lng: String(loc.lng) };
    }
    return { lat: "", lng: "", error: json.error_message ?? json.status };
  } catch {
    return { lat: "", lng: "", error: "Geocoding connection failure." };
  }
}

// ── Settings ───────────────────────────────────────────────────────────────

export interface DealerSettings {
  GoogleAPIKey: string | null;
  show_country_search: boolean;
  Show_Category: boolean;
  Show_Google: boolean;
  Show_AllPoints: boolean;
}

export async function getDealerSettings(): Promise<DealerSettings | null> {
  const rows = await query<DealerSettings>(
    `SELECT GoogleAPIKey, show_country_search, Show_Category, Show_Google, Show_AllPoints
     FROM Dealer_Settings WHERE ID = 1`,
    {}
  );
  return rows[0] ?? null;
}

export async function saveDealerSettings(s: {
  GoogleAPIKey: string;
  show_country_search: boolean;
  Show_Category: boolean;
  Show_Google: boolean;
  Show_AllPoints: boolean;
}): Promise<void> {
  await query(
    `UPDATE Dealer_Settings SET
       Map_style           = 0,
       GoogleAPIKey        = @GoogleAPIKey,
       show_country_search = @show_country_search,
       Show_Category       = @Show_Category,
       Show_Google         = @Show_Google,
       Show_AllPoints      = @Show_AllPoints
     WHERE ID = 1`,
    s
  );
}

// ── Categories ─────────────────────────────────────────────────────────────

export interface DealerCategory {
  category_ID: number;
  name: string;
  priority: number;
}

export async function getDealerCategories(): Promise<DealerCategory[]> {
  return query<DealerCategory>(
    `SELECT category_ID, name, priority FROM Dealer_Categories ORDER BY priority, name DESC`,
    {}
  );
}

export async function getDealerCategory(id: number): Promise<DealerCategory | null> {
  const rows = await query<DealerCategory>(
    `SELECT category_ID, name, priority FROM Dealer_Categories WHERE category_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createDealerCategory(name: string, priority: number): Promise<void> {
  const p = priority === 0 ? 9999 : priority;
  await query(
    `INSERT INTO Dealer_Categories (name, priority) VALUES (@name, @priority)`,
    { name, priority: p }
  );
}

export async function updateDealerCategory(id: number, name: string, priority: number): Promise<void> {
  const p = priority === 0 ? 9999 : priority;
  await query(
    `UPDATE Dealer_Categories SET name = @name, priority = @priority WHERE category_ID = @id`,
    { id, name, priority: p }
  );
}

export async function deleteDealerCategory(id: number): Promise<void> {
  // Clear category from any dealers first
  await query(`UPDATE Dealer SET category_id = 0 WHERE category_id = @id`, { id });
  await query(`DELETE FROM Dealer_Categories WHERE category_ID = @id`, { id });
}

// ── Dealer list ────────────────────────────────────────────────────────────

export interface DealerListRow {
  dealer_ID: number;
  name: string;
  account_id: number | null;
  contact: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  state: string | null;
  country: string | null;
  dealer_latitude: string | null;
}

export interface DealerListOptions {
  name?: string;
  contact?: string;
  state?: string;
  country?: string;
  page?: number;
}

export async function getDealers(
  opts: DealerListOptions
): Promise<{ rows: DealerListRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const params: Record<string, unknown> = {};

  if (opts.name?.trim()) {
    conditions.push(`name LIKE @name`);
    params.name = `%${opts.name.trim()}%`;
  }
  if (opts.contact?.trim()) {
    conditions.push(`contact LIKE @contact`);
    params.contact = `%${opts.contact.trim()}%`;
  }
  if (opts.state?.trim()) {
    conditions.push(`state = @state`);
    params.state = opts.state.trim();
  }
  if (opts.country?.trim()) {
    conditions.push(`country = @country`);
    params.country = opts.country.trim();
  }

  const where = conditions.join(" AND ");

  const countRows = await query<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt FROM Dealer WHERE ${where}`,
    params
  );
  const total = countRows[0]?.cnt ?? 0;

  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await query<DealerListRow>(
    `SELECT dealer_ID, name, account_id, contact, phone, email, website,
            state, country, dealer_latitude
     FROM Dealer
     WHERE ${where}
     ORDER BY name ASC
     OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`,
    params
  );

  return { rows, total };
}

// ── Dealer detail ──────────────────────────────────────────────────────────

export interface DealerDetail {
  dealer_ID: number;
  name: string;
  logo: string | null;
  website: string | null;
  priority: number;
  contact: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  category_id: number | null;
  short_desc: string | null;
  display: boolean;
  account_id: number | null;
  dealer_latitude: string | null;
  dealer_longitude: string | null;
  start_date: Date | null;
}

export async function getDealer(id: number): Promise<DealerDetail | null> {
  const rows = await query<DealerDetail>(
    `SELECT dealer_ID, name, logo, website, priority, contact, address1, address2,
            city, state, zip, country, phone, fax, email, category_id, short_desc,
            display, account_id, dealer_latitude, dealer_longitude, start_date
     FROM Dealer WHERE dealer_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

// ── Create ─────────────────────────────────────────────────────────────────

export interface DealerData {
  name: string; logo: string; website: string; priority: number;
  contact: string; address1: string; address2: string; city: string;
  state: string; zip: string; country: string; phone: string; fax: string;
  email: string; category_id: number; short_desc: string; display: boolean;
  account_id: number; dealer_latitude: string; dealer_longitude: string;
}

export async function createDealer(data: DealerData): Promise<number> {
  const rows = await query<{ dealer_ID: number }>(
    `INSERT INTO Dealer
       (name, logo, website, priority, contact, address1, address2, city, state, zip,
        country, phone, fax, email, category_id, short_desc, display, account_id,
        dealer_latitude, dealer_longitude, start_date)
     OUTPUT INSERTED.dealer_ID
     VALUES
       (@name, @logo, @website, @priority, @contact, @address1, @address2, @city,
        @state, @zip, @country, @phone, @fax, @email, @category_id, @short_desc,
        @display, @account_id, @dealer_latitude, @dealer_longitude, GETDATE())`,
    data
  );
  return rows[0]?.dealer_ID ?? 0;
}

// ── Update ─────────────────────────────────────────────────────────────────

export async function updateDealer(id: number, data: DealerData): Promise<void> {
  await query(
    `UPDATE Dealer SET
       name             = @name,
       logo             = @logo,
       website          = @website,
       priority         = @priority,
       contact          = @contact,
       address1         = @address1,
       address2         = @address2,
       city             = @city,
       state            = @state,
       zip              = @zip,
       country          = @country,
       phone            = @phone,
       fax              = @fax,
       email            = @email,
       category_id      = @category_id,
       short_desc       = @short_desc,
       display          = @display,
       account_id       = @account_id,
       dealer_latitude  = @dealer_latitude,
       dealer_longitude = @dealer_longitude
     WHERE dealer_ID = @id`,
    { id, ...data }
  );
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteDealer(id: number): Promise<void> {
  await query(`DELETE FROM Dealer WHERE dealer_ID = @id`, { id });
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Strip protocol/trailing slash from website URL for storage */
export function normalizeWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "").trim();
}

/** Priority: 0 in form means 9999 in DB */
export function normalizePriority(val: string): number {
  const n = parseInt(val) || 0;
  return n === 0 ? 9999 : n;
}

/** Display priority: 9999 shows as 0 */
export function displayPriority(p: number): number {
  return p >= 9999 ? 0 : p;
}
