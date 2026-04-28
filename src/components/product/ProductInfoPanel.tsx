import { useState, useCallback } from "react";
import ProductOptions from "./ProductOptions";
import type { SelectedVariantInfo } from "./ProductOptions";
import AddToCartButton from "../cart/AddToCartButton";

interface Props {
  productId: number;
  price: number;
  priceRetail: number | null;
  isSale: boolean;
  isHot: boolean;
  onSale: boolean;
  shortDesc: string | null;
}

export default function ProductInfoPanel({
  productId,
  price,
  priceRetail,
  isSale,
  isHot,
  onSale,
  shortDesc,
}: Props) {
  const [selectedVariant, setSelectedVariant] =
    useState<SelectedVariantInfo | null>(null);
  const [hasVariants, setHasVariants] = useState<boolean | null>(null);

  const handleHasVariants = useCallback((v: boolean) => setHasVariants(v), []);

  const displayPrice = selectedVariant ? Number(selectedVariant.price) : price;
  const displaySku = selectedVariant?.sku ?? null;

  // Stock is determined entirely by variants now.
  // Before a variant is selected, assume available.
  const inStock = selectedVariant
    ? selectedVariant.in_stock
    : true;

  // Only show crossed-out retail price when on sale and no variant override
  const showRetailStrike = onSale && !selectedVariant && priceRetail != null;

  return (
    <div>
      {/* SKU */}
      {displaySku && (
        <p className="text-sm text-gray-400 mb-4">SKU: {displaySku}</p>
      )}

      {/* Badges */}
      {(isSale || isHot) && (
        <div className="flex gap-2 mb-4">
          {isSale && (
            <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide">
              Sale
            </span>
          )}
          {isHot && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide">
              Hot
            </span>
          )}
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-3xl font-bold text-gray-900">
          ${displayPrice.toFixed(2)}
        </span>
        {showRetailStrike && (
          <span className="text-lg text-gray-400 line-through">
            ${priceRetail!.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock status */}
      {inStock ? (
        <p className="text-sm text-green-600 font-medium mb-4">
          &#10003; In Stock
        </p>
      ) : (
        <div className="bg-red-700 text-white text-center font-bold text-2xl rounded-lg px-6 py-5 mb-6">
          Out of Stock
        </div>
      )}

      {/* Variant selector */}
      <ProductOptions
        productId={productId}
        price={price}
        showPrice={false}
        onVariantSelected={setSelectedVariant}
        onHasVariants={handleHasVariants}
      />

      {/* Add to Cart */}
      <AddToCartButton
        productId={productId}
        inStock={inStock}
        variantId={selectedVariant?.variant_id}
        price={displayPrice}
      />

      {/* Short description */}
      {shortDesc && (
        <div className="text-sm text-gray-600 border-t border-gray-100 pt-4 mt-4">
          <div dangerouslySetInnerHTML={{ __html: shortDesc }} />
        </div>
      )}
    </div>
  );
}
