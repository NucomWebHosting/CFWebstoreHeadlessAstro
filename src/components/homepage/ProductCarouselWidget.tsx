import type { ProductRow } from "../../lib/types";
import ProductCard from "../ui/ProductCard";

interface Props {
  products: ProductRow[];
  title?: string | null;
  imageBaseUrl?: string;
}

export default function ProductCarouselWidget({ products, title, imageBaseUrl = "" }: Props) {
  if (!products.length) return null;

  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">{title}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.Product_ID} product={p} imageBaseUrl={imageBaseUrl} />
          ))}
        </div>
      </div>
    </div>
  );
}
