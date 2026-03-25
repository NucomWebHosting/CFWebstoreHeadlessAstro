import type { APIRoute } from "astro";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, resolve, sep } from "node:path";
import sharp from "sharp";

export const prerender = false;

const UPLOAD_DIR    = resolve(process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "images"));
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL ?? "/images";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif", ".heic", ".heif"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov", ".avi"]);
const DOC_EXTS   = new Set([".pdf", ".xlsx", ".xls", ".docx", ".doc", ".txt", ".csv"]);
const ALL_EXTS   = new Set([...IMAGE_EXTS, ...VIDEO_EXTS, ...DOC_EXTS]);

export type MediaType = "image" | "video" | "doc";

function getMediaType(ext: string): MediaType {
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VIDEO_EXTS.has(ext)) return "video";
  return "doc";
}

/** Resolve a user-supplied relative folder path safely within UPLOAD_DIR.
 *  Returns null if the path would escape UPLOAD_DIR. */
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

export interface MediaFile {
  filename: string;
  url: string;
  thumbUrl: string | null;
  size: number;
  mediaType: MediaType;
  width: number | null;
  height: number | null;
  created: string;
}

export interface MediaFolder {
  name: string;
  path: string; // relative to UPLOAD_DIR
}

/** @deprecated Use MediaFile instead */
export interface ImageItem {
  filename: string;
  url: string;
  thumbUrl: string | null;
  size: number;
  width: number | null;
  height: number | null;
  created: string;
}

export const GET: APIRoute = async ({ request }) => {
  const url    = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "";
  const dirPath = safeDir(folder);

  if (!dirPath) return json({ files: [], folders: [], images: [] }, 400);

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    const folders: MediaFolder[] = entries
      .filter(e => e.isDirectory() && e.name !== "thumbs")
      .map(e => ({
        name: e.name,
        path: folder ? `${folder}/${e.name}` : e.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const fileEntries = entries.filter(
      e => e.isFile() && ALL_EXTS.has(extname(e.name).toLowerCase())
    );

    const files: MediaFile[] = await Promise.all(
      fileEntries.map(async (e): Promise<MediaFile> => {
        const filePath = join(dirPath, e.name);
        const s        = await stat(filePath);
        const ext      = extname(e.name).toLowerCase();
        const mType    = getMediaType(ext);

        let width: number | null  = null;
        let height: number | null = null;
        if (mType === "image" && ext !== ".svg" && ext !== ".gif") {
          try {
            const meta = await sharp(filePath).metadata();
            width  = meta.width  ?? null;
            height = meta.height ?? null;
          } catch { /* non-fatal */ }
        }

        const stem = e.name.replace(/\.[^.]+$/, "");
        let thumbUrl: string | null = null;
        if (mType === "image") {
          const thumbPath = join(UPLOAD_DIR, "thumbs", folder, `${stem}.jpg`);
          try {
            await stat(thumbPath);
            thumbUrl = `${IMAGE_BASE_URL}/thumbs/${folder ? folder + "/" : ""}${stem}.jpg`;
          } catch { /* no thumb */ }
        }

        return {
          filename: e.name,
          url: `${IMAGE_BASE_URL}/${folder ? folder + "/" : ""}${e.name}`,
          thumbUrl,
          size: s.size,
          mediaType: mType,
          width,
          height,
          created: s.birthtime.toISOString(),
        };
      })
    );

    files.sort((a, b) => b.created.localeCompare(a.created));

    // `images` key kept for backwards compat with ImagePickerInput
    const images: ImageItem[] = files
      .filter(f => f.mediaType === "image")
      .map(({ filename, url, thumbUrl, size, width, height, created }) => ({
        filename, url, thumbUrl, size, width, height, created,
      }));

    return json({ files, folders, images });
  } catch {
    return json({ files: [], folders: [], images: [] });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const url      = new URL(request.url);
  const filename = url.searchParams.get("filename");
  const folder   = url.searchParams.get("folder") ?? "";

  if (!filename || filename.includes("/") || filename.includes("..")) {
    return json({ error: "Invalid filename" }, 400);
  }

  const ext = extname(filename).toLowerCase();
  if (!ALL_EXTS.has(ext)) {
    return json({ error: "Unsupported file type" }, 400);
  }

  const dirPath = safeDir(folder);
  if (!dirPath) return json({ error: "Invalid folder" }, 400);

  try { await unlink(join(dirPath, filename)); } catch { /* already gone */ }

  if (IMAGE_EXTS.has(ext)) {
    try {
      const stem = filename.replace(/\.[^.]+$/, "");
      await unlink(join(UPLOAD_DIR, "thumbs", folder, `${stem}.jpg`));
    } catch { /* no thumb */ }
  }

  return json({ success: true });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
