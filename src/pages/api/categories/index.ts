export const prerender = false;
import type { APIRoute } from "astro";
import { getTopLevelCategories } from "../../../lib/queries/categories";

export const GET: APIRoute = async () => {
  const categories = await getTopLevelCategories();
  return new Response(JSON.stringify(categories), {
    headers: { "Content-Type": "application/json" },
  });
};
