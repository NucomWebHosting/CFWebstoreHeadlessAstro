import { query } from "../db";
import type { PageRow } from "../types";

export async function getPageById(pageId: number): Promise<PageRow | null> {
  const rows = await query<PageRow>(
    "SELECT * FROM Pages WHERE Page_ID = @page_id AND Display = 1",
    { page_id: pageId }
  );
  return rows[0] ?? null;
}

export async function getPageByPermalink(permalink: string): Promise<PageRow | null> {
  const rows = await query<PageRow>(
    "SELECT * FROM Pages WHERE Permalink = @permalink AND Display = 1",
    { permalink }
  );
  return rows[0] ?? null;
}

export async function getPageByUrl(pageUrl: string): Promise<PageRow | null> {
  const rows = await query<PageRow>(
    "SELECT * FROM Pages WHERE Page_URL = @page_url AND Display = 1",
    { page_url: pageUrl }
  );
  return rows[0] ?? null;
}
