import type { APIRoute } from "astro";
import { mkdir, rmdir, readdir } from "node:fs/promises";
import { join, resolve, sep } from "node:path";

export const prerender = false;

const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "images"));

function safeDir(folder: string): string | null {
  if (!folder) return UPLOAD_DIR;
  const parts = folder
    .replace(/\\/g, "/")
    .split("/")
    .filter(p => p.length > 0 && p !== "." && p !== "..");
  if (!parts.length) return UPLOAD_DIR;
  const target = resolve(UPLOAD_DIR, parts.join("/"));
  if (target !== UPLOAD_DIR && !target.startsWith(UPLOAD_DIR + sep)) return null;
  return target;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// POST /api/admin/folders  body: JSON { folder: "path/to/new" }
export const POST: APIRoute = async ({ request }) => {
  let body: { folder?: string };
  try { body = await request.json(); }
  catch { return json({ error: "Invalid JSON" }, 400); }

  const folder = (body.folder ?? "").trim();
  if (!folder) return json({ error: "folder required" }, 400);

  const dirPath = safeDir(folder);
  if (!dirPath || dirPath === UPLOAD_DIR) {
    return json({ error: "Invalid folder path" }, 400);
  }

  try {
    await mkdir(dirPath, { recursive: true });
    return json({ success: true });
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EEXIST") return json({ error: "Folder already exists" }, 409);
    return json({ error: "Failed to create folder" }, 500);
  }
};

// DELETE /api/admin/folders?folder=path/to/remove  — only removes empty folders
export const DELETE: APIRoute = async ({ request }) => {
  const url    = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "";

  if (!folder) return json({ error: "folder required" }, 400);

  const dirPath = safeDir(folder);
  if (!dirPath || dirPath === UPLOAD_DIR) {
    return json({ error: "Invalid folder path" }, 400);
  }

  // Check for files before attempting removal
  let entries: import("node:fs").Dirent[];
  try {
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return json({ error: "Folder not found" }, 404);
  }

  if (entries.length > 0) {
    return json({ error: "Folder is not empty — move or delete its contents first" }, 422);
  }

  try {
    await rmdir(dirPath); // non-recursive: will throw ENOTEMPTY if race-condition adds files
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTEMPTY") return json({ error: "Folder is not empty" }, 422);
    return json({ error: "Failed to delete folder" }, 500);
  }

  // Clean up mirrored thumbs subfolder if it exists
  try {
    const thumbsDir = safeDir(`thumbs/${folder}`);
    if (thumbsDir) await rmdir(thumbsDir);
  } catch { /* no thumbs subfolder — that's fine */ }

  return json({ success: true });
};
