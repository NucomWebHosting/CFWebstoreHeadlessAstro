import type { APIRoute } from "astro";
import { writeFile, mkdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";

export const prerender = false;

const UPLOAD_DIR =
  process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "images");
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL ?? "/images";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/heic",
  "image/heif",
]);

const HEIC_TYPES  = new Set(["image/heic", "image/heif"]);
const HEIC_EXTS   = new Set([".heic", ".heif"]);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// Images wider than this are resized on upload to save disk space
const MAX_DIMENSION = 2400;
const THUMB_SIZE = 400;
const SVG_TYPE = "image/svg+xml";
const GIF_TYPE = "image/gif";

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ success: false, data: { messages: ["Invalid request"] } }, 400);
  }

  const uploaded: string[] = [];
  const errors: string[] = [];

  let i = 0;
  while (true) {
    const file = formData.get(`files[${i}]`);
    if (!file) break;
    if (!(file instanceof File)) { i++; continue; }

    // Browsers (especially non-Apple) often send HEIC files with a blank or
    // generic MIME type — fall back to extension detection in that case.
    const fileExt = extname(file.name).toLowerCase();
    const isHeic  = HEIC_TYPES.has(file.type) || HEIC_EXTS.has(fileExt);
    const mimeOk  = ALLOWED_TYPES.has(file.type) || isHeic;

    if (!mimeOk) {
      errors.push(`${file.name}: unsupported file type`);
      i++;
      continue;
    }
    if (file.size > MAX_SIZE) {
      errors.push(`${file.name}: exceeds 10 MB limit`);
      i++;
      continue;
    }
    const ext = isHeic ? ".webp" : (fileExt || ".jpg");
    const stem = `${Date.now()}-${randomBytes(6).toString("hex")}`;
    const filename = `${stem}${ext}`;
    const filePath = join(UPLOAD_DIR, filename);

    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());

      const isSvg = file.type === SVG_TYPE || fileExt === ".svg";
      const isGif = file.type === GIF_TYPE || fileExt === ".gif";
      const canProcessWithSharp = !isSvg && !isGif;

      if (canProcessWithSharp) {
        // Read dimensions from a fresh instance, then build the output pipeline
        const meta = await sharp(buffer).metadata();
        const needsResize = (meta.width ?? 0) > MAX_DIMENSION;
        let pipeline = sharp(buffer);
        if (needsResize) pipeline = pipeline.resize(MAX_DIMENSION, undefined, { withoutEnlargement: true }) as typeof pipeline;
        if (isHeic) pipeline = pipeline.webp({ quality: 90 }) as typeof pipeline;
        await pipeline.toFile(filePath);

        // Generate thumbnail
        const thumbDir = join(UPLOAD_DIR, "thumbs");
        await mkdir(thumbDir, { recursive: true });
        const thumbFilename = `${stem}.jpg`;
        await sharp(filePath)
          .resize(THUMB_SIZE, THUMB_SIZE, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(join(thumbDir, thumbFilename));
      } else {
        // SVG / GIF — write as-is, no thumb
        await writeFile(filePath, buffer);
      }

      uploaded.push(`${IMAGE_BASE_URL}/${filename}`);
    } catch (err) {
      errors.push(`${file.name}: write failed`);
    }

    i++;
  }

  if (uploaded.length === 0 && errors.length > 0) {
    return json({ success: false, data: { messages: errors } }, 422);
  }

  return json({
    success: true,
    data: {
      messages: errors,
      files: uploaded,
      isImages: uploaded.map(() => true),
      baseurl: "",
    },
  });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
