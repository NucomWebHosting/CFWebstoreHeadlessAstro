import type { APIRoute } from "astro";
import { writeFile, mkdir } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";

export const prerender = false;

const UPLOAD_DIR    = resolve(process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "images"));
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL ?? "/images";

// ── MIME type sets ────────────────────────────────────────────────────────
const IMAGE_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "image/svg+xml", "image/avif", "image/heic", "image/heif",
]);
const VIDEO_TYPES = new Set([
  "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska",
]);
const DOC_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "text/csv",
  "application/csv",
]);

// ── Extension sets (fallback when browser sends generic MIME type) ────────
const HEIC_EXTS  = new Set([".heic", ".heif"]);
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif", ".heic", ".heif"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov", ".avi", ".mkv"]);
const DOC_EXTS   = new Set([".pdf", ".xlsx", ".xls", ".docx", ".doc", ".txt", ".csv"]);

// ── Size limits ───────────────────────────────────────────────────────────
const IMAGE_MAX = 20  * 1024 * 1024;  // 20 MB
const VIDEO_MAX = 200 * 1024 * 1024;  // 200 MB
const DOC_MAX   = 20  * 1024 * 1024;  // 20 MB

const MAX_DIMENSION = 2400;
const THUMB_SIZE    = 400;

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

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ success: false, data: { messages: ["Invalid request"] } }, 400);
  }

  const rawFolder = ((formData.get("folder") as string) ?? "").trim();
  const destDir   = safeDir(rawFolder);
  if (!destDir) {
    return json({ success: false, data: { messages: ["Invalid folder"] } }, 400);
  }

  const uploaded: string[] = [];
  const errors:   string[] = [];

  let i = 0;
  while (true) {
    const file = formData.get(`files[${i}]`);
    if (!file) break;
    if (!(file instanceof File)) { i++; continue; }

    const fileExt = extname(file.name).toLowerCase();

    // Detect type by MIME + extension fallback (browsers often send generic MIME for HEIC, MOV, etc.)
    const isHeic  = HEIC_EXTS.has(fileExt)  || new Set(["image/heic", "image/heif"]).has(file.type);
    const isVideo = VIDEO_EXTS.has(fileExt) || VIDEO_TYPES.has(file.type);
    const isDoc   = DOC_EXTS.has(fileExt)   || DOC_TYPES.has(file.type);
    const isImage = IMAGE_EXTS.has(fileExt) || IMAGE_TYPES.has(file.type) || isHeic;

    if (!isImage && !isVideo && !isDoc) {
      errors.push(`${file.name}: unsupported file type`);
      i++;
      continue;
    }

    const maxSize = isVideo ? VIDEO_MAX : isDoc ? DOC_MAX : IMAGE_MAX;
    if (file.size > maxSize) {
      const mb = Math.round(maxSize / (1024 * 1024));
      errors.push(`${file.name}: exceeds ${mb} MB limit`);
      i++;
      continue;
    }

    const ext      = isHeic ? ".webp" : (fileExt || ".jpg");
    const stem     = `${Date.now()}-${randomBytes(6).toString("hex")}`;
    const filename = `${stem}${ext}`;
    const filePath = join(destDir, filename);

    try {
      await mkdir(destDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());

      const isSvg = file.type === "image/svg+xml" || fileExt === ".svg";
      const isGif = file.type === "image/gif"     || fileExt === ".gif";

      if (isImage && !isSvg && !isGif) {
        // Sharp processing: resize if needed, convert HEIC → WebP
        const meta       = await sharp(buffer).metadata();
        const needResize = (meta.width ?? 0) > MAX_DIMENSION;
        let pipeline     = sharp(buffer);
        if (needResize) pipeline = pipeline.resize(MAX_DIMENSION, undefined, { withoutEnlargement: true }) as typeof pipeline;
        if (isHeic)     pipeline = pipeline.webp({ quality: 90 }) as typeof pipeline;
        await pipeline.toFile(filePath);

        // Thumbnail — mirrored under thumbs/{folder}/
        const thumbDir = join(UPLOAD_DIR, "thumbs", rawFolder);
        await mkdir(thumbDir, { recursive: true });
        await sharp(filePath)
          .resize(THUMB_SIZE, THUMB_SIZE, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(join(thumbDir, `${stem}.jpg`));
      } else {
        // Videos, docs, SVG, GIF — write as-is
        await writeFile(filePath, buffer);
      }

      const urlFolder = rawFolder ? `${rawFolder}/` : "";
      uploaded.push(`${IMAGE_BASE_URL}/${urlFolder}${filename}`);
    } catch {
      errors.push(`${file.name}: write failed`);
    }

    i++;
  }

  if (uploaded.length === 0 && errors.length > 0) {
    return json({ success: false, data: { messages: errors } }, 422);
  }

  return json({
    success: true,
    data: { messages: errors, files: uploaded, isImages: uploaded.map(() => true), baseurl: "" },
  });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
