export const prerender = false;
import type { APIRoute } from "astro";
import { getCategoryById, getSubcategories } from "../../../lib/queries/categories";

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const [category, subcategories] = await Promise.all([
    getCategoryById(id),
    getSubcategories(id),
  ]);
  if (!category) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ ...category, subcategories }), {
    headers: { "Content-Type": "application/json" },
  });
};
