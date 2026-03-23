import type { ProductRow } from "../../lib/types";

interface Props {
  product: ProductRow;
  imageBaseUrl?: string;
}

function resolveImage(filename: string | null | undefined, baseUrl: string): string | null {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${baseUrl.replace(/\/$/, "")}/${filename}`;
}

export default function ProductCard({ product, imageBaseUrl = "" }: Props) {
  const href = product.Permalink
    ? `/${product.Permalink}`
    : `/product/${product.Product_ID}`;

  // Products may have a Sm_image column directly on the row (denormalized)
  const image = resolveImage((product as any).Sm_image ?? null, imageBaseUrl);

  return (
    <a
      href={href}
      className="group flex flex-col rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden bg-white"
    >
      {/* Product image */}
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.Name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 flex-1 leading-snug">
          {product.Name}
        </h3>
        {product.SKU && (
          <p className="text-xs text-gray-400 mt-1">SKU: {product.SKU}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-gray-900">
            ${product.Base_Price.toFixed(2)}
          </span>
          <div className="flex gap-1">
            {product.Sale && (
              <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Sale</span>
            )}
            {product.Hot && (
              <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">Hot</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
