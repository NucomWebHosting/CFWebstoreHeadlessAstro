import { useState } from "react";
import type { ProductImageRow } from "../../lib/types";

const placeholderSvg = (
  <div className="w-full h-full flex items-center justify-center text-gray-300">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

interface Props {
  images: ProductImageRow[];
  productName: string;
  imageBaseUrl: string;
}

function resolveImg(filename: string | null | undefined, baseUrl: string): string | null {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${baseUrl.replace(/\/$/, "")}/${filename}`;
}

export default function ProductGallery({ images, productName, imageBaseUrl }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">{placeholderSvg}</div>;
  }

  const active = images[activeIndex];
  const mainSrc = resolveImg(active.Md_image ?? active.Sm_image, imageBaseUrl);
  const lgSrc = resolveImg(active.Lg_image ?? active.Md_image ?? active.Sm_image, imageBaseUrl);

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
        {mainSrc ? (
          <a href={lgSrc ?? mainSrc} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img
              src={mainSrc}
              alt={productName}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </a>
        ) : placeholderSvg}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => {
            const thumb = resolveImg(img.Sm_image ?? img.Th_image, imageBaseUrl);
            return (
              <button
                key={img.Product_Image_ID}
                onClick={() => setActiveIndex(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                  i === activeIndex
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={`${productName} view ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
