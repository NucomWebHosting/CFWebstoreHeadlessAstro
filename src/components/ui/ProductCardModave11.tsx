import type { ProductRow } from "../../lib/types";
import { resolveImg } from "../../lib/image-utils";

interface Props {
  product: ProductRow;
}

export default function ProductCardModave11({ product }: Props) {
  const href = product.slug ? `/${product.slug}` : `/product/${product.product_id}`;
  const image = resolveImg(product.sm_image ?? null);
  const hoverImage = resolveImg(product.sm_image_hover ?? null);
  const hasOldPrice = !!product.is_on_sale && !!product.price_retail && product.price_retail > product.price;
  const salePercent = hasOldPrice
    ? Math.round((1 - product.price / product.price_retail!) * 100)
    : 0;

  return (
    <div className={`card-product style-6${product.is_on_sale ? " on-sale" : ""}`}>
      <div className="card-product-wrapper">
        <a href={href} className="product-img">
          {image ? (
            <img
              className="lazyload img-product"
              src={image}
              alt={product.name}
              width={600}
              height={800}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50" style={{ aspectRatio: "3/4" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {hoverImage && (
            <img
              className="lazyload img-hover"
              src={hoverImage}
              alt={product.name}
              width={600}
              height={800}
              loading="lazy"
            />
          )}
        </a>

        {hasOldPrice && (
          <div className="on-sale-wrap">
            <span className="on-sale-item">-{salePercent}%</span>
          </div>
        )}
      </div>

      <div className="card-product-info">
        <a href={href} className="title link">
          {product.name}
        </a>
        <span className="price">
          {hasOldPrice && (
            <span className="old-price">${product.price_retail!.toFixed(2)}</span>
          )}{" "}
          ${Number(product.price).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
