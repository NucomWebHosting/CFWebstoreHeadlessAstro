export const prerender = false;
import type { APIRoute } from "astro";
import { getProductById, getProductImages } from "../../../lib/queries/products";

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const [product, images] = await Promise.all([
    getProductById(id),
    getProductImages(id),
  ]);
  if (!product) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ ...product, images }), {
    headers: { "Content-Type": "application/json" },
  });
};
