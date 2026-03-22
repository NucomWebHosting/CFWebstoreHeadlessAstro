import type { ProductRow } from "../../lib/types";
import ProductCard from "./ProductCard";

interface Props {
  products: ProductRow[];
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.Product_ID} product={p} />
      ))}
    </div>
  );
}
