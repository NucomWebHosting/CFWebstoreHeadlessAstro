import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ url, session, redirect }, next) => {
  if (!url.pathname.startsWith("/admin")) return next();

  // Never cache admin responses (prevents Cloudflare from serving stale auth state)
  const response = await (async () => {
    if (url.pathname === "/admin/login" || url.pathname === "/admin/logout") return next();
    const user = await session?.get("user");
    if (!user) return redirect("/admin/login");
    return next();
  })();

  if (response instanceof Response) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }
  return response;
});
