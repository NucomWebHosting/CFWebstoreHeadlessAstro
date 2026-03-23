export const prerender = false;

export function GET({ params }: { params: { slug: string } }) {
  return new Response(JSON.stringify({ slug: params.slug, length: params.slug?.length, endsWithSlash: params.slug?.endsWith("/") }), {
    headers: { "content-type": "application/json" }
  });
}
