export const prerender = false;
import type { APIRoute } from "astro";
import { searchProductsForOrder } from "../../../../lib/queries/admin-orders";

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get("q") ?? "";
  if (q.length < 2) return new Response("[]", { headers: { "Content-Type": "application/json" } });
  const results = await searchProductsForOrder(q);
  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
};
