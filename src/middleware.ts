import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ url, session, redirect }, next) => {
  if (!url.pathname.startsWith("/admin")) return next();
  if (url.pathname === "/admin/login" || url.pathname === "/admin/logout") return next();
  const user = await session?.get("user");
  if (!user) return redirect("/admin/login");
  return next();
});
