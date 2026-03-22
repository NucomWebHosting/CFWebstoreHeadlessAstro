import { query } from "../db";
import type { SettingsRow } from "../types";

// Cached in memory — resets on server restart (i.e. each deploy)
let cache: SettingsRow | null = null;

export async function getSettings(): Promise<SettingsRow | null> {
  if (cache) return cache;
  const rows = await query<SettingsRow>("SELECT TOP 1 * FROM Settings");
  cache = rows[0] ?? null;
  return cache;
}
