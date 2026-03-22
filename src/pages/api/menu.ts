export const prerender = false;
import type { APIRoute } from "astro";
import { getNavTree } from "../../lib/queries/menu";

export const GET: APIRoute = async () => {
  const nav = await getNavTree();
  return new Response(JSON.stringify(nav), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
};
