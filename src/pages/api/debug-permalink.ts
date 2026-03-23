export const prerender = false;
import { query } from "../../lib/db";

export async function GET() {
  const rows = await query(
    "SELECT TOP 10 Product_ID, Name, Permalink FROM Products WHERE Display=1 AND Permalink IS NOT NULL ORDER BY Product_ID DESC"
  );
  return new Response(JSON.stringify(rows, null, 2), {
    headers: { "content-type": "application/json" }
  });
}
