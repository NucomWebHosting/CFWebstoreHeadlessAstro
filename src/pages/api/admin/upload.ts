import type { APIRoute } from "astro";
import { writeFile, mkdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { randomBytes } from "node:crypto";

export const prerender = false;

// In production set UPLOAD_DIR env var to an absolute path outside dist/
// e.g. UPLOAD_DIR=/var/www/frontend.nucomwebhosting.com/images
// In dev, falls back to public/images/ which Astro serves at /images/
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
]);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export const POST: APIRoute = async ({ request }) => {
  // Auth check — require a valid session
  // (session check relies on middleware having already guarded /admin/* routes;
  //  this endpoint is under /api/admin so middleware covers it too)

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ success: false, data: { messages: ["Invalid request"] } }, 400);
  }

  // Jodit sends files as files[0], files[1], …
  const uploaded: string[] = [];
  const errors: string[] = [];

  let i = 0;
  while (true) {
    const file = formData.get(`files[${i}]`);
    if (!file) break;
    if (!(file instanceof File)) { i++; continue; }

    if (!ALLOWED_TYPES.has(file.type)) {
      errors.push(`${file.name}: unsupported file type`);
      i++;
      continue;
    }
    if (file.size > MAX_SIZE) {
      errors.push(`${file.name}: exceeds 10 MB limit`);
      i++;
      continue;
    }

    const ext = extname(file.name).toLowerCase() || ".jpg";
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;

    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(join(UPLOAD_DIR, filename), buffer);
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
