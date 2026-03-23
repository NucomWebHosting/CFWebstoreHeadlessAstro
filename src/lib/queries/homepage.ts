import { query } from "../db";
import type { HomepageRow, TestimonialRow } from "../types";

let cache: HomepageRow | null = null;

export async function getHomepage(): Promise<HomepageRow | null> {
  if (cache) return cache;
  const rows = await query<HomepageRow>("SELECT TOP 1 * FROM Homepage");
  cache = rows[0] ?? null;
  return cache;
}

export async function getTestimonials(): Promise<TestimonialRow[]> {
  return query<TestimonialRow>(
    "SELECT * FROM Testimonials WHERE Display = 1 ORDER BY Posted DESC"
  );
}
