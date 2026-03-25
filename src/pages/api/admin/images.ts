import type { APIRoute } from "astro";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

export const prerender = false;

const UPLOAD_DIR =
  process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "images");
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL ?? "/images";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"]);

export interface ImageItem {
  filename: string;
  url: string;
  thumbUrl: string | null;
  size: number;
  width: number | null;
  height: number | null;
  created: string;
}

export const GET: APIRoute = async () => {
  try {
    const entries = await readdir(UPLOAD_DIR, { withFileTypes: true });
    const files = entries.filter(
      (e) => e.isFile() && IMAGE_EXTS.has(extname(e.name).toLowerCase())
    );

    const items: ImageItem[] = await Promise.all(
      files.map(async (e): Promise<ImageItem> => {
        const filePath = join(UPLOAD_DIR, e.name);
        const s = await stat(filePath);

        let width: number | null = null;
        let height: number | null = null;
        const ext = extname(e.name).toLowerCase();
        if (ext !== ".svg" && ext !== ".gif") {
          try {
            const meta = await sharp(filePath).metadata();
            width = meta.width ?? null;
            height = meta.height ?? null;
          } catch { /* non-fatal */ }
        }

        const stem = e.name.replace(/\.[^.]+$/, "");
        const thumbPath = join(UPLOAD_DIR, "thumbs", `${stem}.jpg`);
        let thumbUrl: string | null = null;
        try {
          await stat(thumbPath);
          thumbUrl = `${IMAGE_BASE_URL}/thumbs/${stem}.jpg`;
        } catch { /* no thumb */ }

        return {
          filename: e.name,
          url: `${IMAGE_BASE_URL}/${e.name}`,
          thumbUrl,
          size: s.size,
          width,
          height,
          created: s.birthtime.toISOString(),
        };
      })
    );

    // Newest first
    items.sort((a, b) => b.created.localeCompare(a.created));

    return new Response(JSON.stringify({ images: items }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ images: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filename = url.searchParams.get("filename");

  if (!filename || filename.includes("/") || filename.includes("..")) {
    return new Response(JSON.stringify({ error: "Invalid filename" }), { status: 400 });
  }

  const ext = extname(filename).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) {
    return new Response(JSON.stringify({ error: "Not an image" }), { status: 400 });
  }

  try {
    await unlink(join(UPLOAD_DIR, filename));
  } catch { /* already gone */ }

  // Remove thumbnail if it exists
  try {
    const stem = filename.replace(/\.[^.]+$/, "");
    await unlink(join(UPLOAD_DIR, "thumbs", `${stem}.jpg`));
  } catch { /* no thumb to remove */ }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
