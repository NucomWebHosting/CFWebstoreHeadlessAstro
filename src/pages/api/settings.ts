export const prerender = false;
import type { APIRoute } from "astro";
import { getSettings } from "../../lib/queries/settings";

export const GET: APIRoute = async () => {
  const settings = await getSettings();
  return new Response(JSON.stringify(settings ?? {}), {
    headers: { "Content-Type": "application/json" },
  });
};
