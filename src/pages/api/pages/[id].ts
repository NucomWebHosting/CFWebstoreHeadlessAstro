export const prerender = false;
import type { APIRoute } from "astro";
import { getPageById } from "../../../lib/queries/pages";

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const page = await getPageById(id);
  if (!page) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify(page), { headers: { "Content-Type": "application/json" } });
};
