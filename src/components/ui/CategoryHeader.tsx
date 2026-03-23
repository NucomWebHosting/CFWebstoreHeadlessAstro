// Mirrors dsp_catheader.cfm — handles image positioning and show/hide description.
//
// Lg_image_position:
//   0 = image LEFT,  text right
//   1 = image RIGHT, text left
//   2 = image TOP,   text below
//   (no Lg_image)  = text only

import type { CategoryRow } from "../../lib/types";
import RichText from "./RichText";

interface Props {
  category: CategoryRow;
  imageBaseUrl?: string;
}

const LONG_DESC_THRESHOLD = 400;

function resolveImage(filename: string | null, baseUrl: string): string | null {
  if (!filename) return null;
  // Cloudinary or any absolute URL — use as-is
  if (filename.startsWith("http")) return filename;
  return `${baseUrl.replace(/\/$/, "")}/${filename}`;
}

function CategoryTitle({ name, titleImage, baseUrl }: { name: string; titleImage: string | null; baseUrl: string }) {
  const resolved = resolveImage(titleImage, baseUrl);
  if (resolved) {
    return <img src={resolved} alt={name} className="max-h-16 w-auto" />;
  }
  return <h1 className="text-3xl font-bold text-gray-900">{name}</h1>;
}

function LongDescription({ html }: { html: string }) {
  const isLong = html.length > LONG_DESC_THRESHOLD;

  if (!isLong) {
    return <RichText html={html} className="mt-4" />;
  }

  // Show/hide via native <details> — no JavaScript needed
  return (
    <details className="mt-4 group">
      <summary className="cursor-pointer text-blue-600 hover:underline text-sm font-medium list-none flex items-center gap-1">
        <span className="group-open:hidden">Show description ▼</span>
        <span className="hidden group-open:inline">Hide description ▲</span>
      </summary>
      <div className="mt-3">
        <RichText html={html} />
      </div>
    </details>
  );
}

export default function CategoryHeader({ category, imageBaseUrl = "" }: Props) {
  if (!category.ShowCatHeader) return null;

  const lgImage = resolveImage(category.Lg_image, imageBaseUrl);
  const hasImage = !!lgImage;
  const pos = category.Lg_image_position ?? 0;

  const titleBlock = (
    <CategoryTitle
      name={category.Name}
      titleImage={category.Lg_Title}
      baseUrl={imageBaseUrl}
    />
  );

  const descBlock = category.Long_Desc ? (
    <LongDescription html={category.Long_Desc} />
  ) : null;

  // ── No large image ────────────────────────────────────────────────────────
  if (!hasImage) {
    return (
      <div className="mb-6">
        {titleBlock}
        {descBlock}
      </div>
    );
  }

  const imageEl = (
    <img
      src={lgImage!}
      alt={category.Name}
      className="w-full h-auto rounded-lg object-cover"
      loading="lazy"
    />
  );

  // ── Image TOP ─────────────────────────────────────────────────────────────
  if (pos === 2) {
    return (
      <div className="mb-6">
        <div className="mb-4">{imageEl}</div>
        {titleBlock}
        {descBlock}
      </div>
    );
  }

  // ── Image LEFT (0) or RIGHT (1) ───────────────────────────────────────────
  return (
    <div className={`flex flex-col md:flex-row gap-6 mb-6 ${pos === 1 ? "md:flex-row-reverse" : ""}`}>
      <div className="md:w-2/5 flex-shrink-0">{imageEl}</div>
      <div className="flex-1">
        {titleBlock}
        {descBlock}
      </div>
    </div>
  );
}
