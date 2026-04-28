import { useState } from "react";

interface Props {
  productId: number;
  inStock: boolean;
  variantId?: string | null;
  price?: number;
}

export default function AddToCartButton({ productId, inStock, variantId, price }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleAddToCart() {
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity, variant_id: variantId ?? undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback(data.error || "Failed to add to cart");
        return;
      }

      setFeedback("Added to cart!");
      setTimeout(() => setFeedback(null), 3000);

      // Notify header badge and cart drawer
      window.dispatchEvent(
        new CustomEvent("cart-updated", {
          detail: { open: true, count: data.cartItemCount },
        })
      );
    } catch {
      setFeedback("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!inStock) {
    return null;
  }

  const total = price != null ? (price * quantity).toFixed(2) : null;

  return (
    <div className="tf-product-info-by-btn mt-6">
      {/* Quantity selector — Modave wg-quantity */}
      <div className="wg-quantity mb_10">
        <span
          className="btn-quantity btn-decrease"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          role="button"
          tabIndex={0}
        >
          -
        </span>
        <input
          className="quantity-product"
          type="number"
          name="number"
          min={1}
          value={quantity}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v > 0) setQuantity(v);
          }}
        />
        <span
          className="btn-quantity btn-increase"
          onClick={() => setQuantity(q => q + 1)}
          role="button"
          tabIndex={0}
        >
          +
        </span>
      </div>

      {/* Add to Cart button — Modave btn-style-2 */}
      <a
        onClick={handleAddToCart}
        className={`btn-style-2 flex-grow-1 text-btn-uppercase font-semibold btn-add-to-cart${loading ? " opacity-50 pointer-events-none" : ""}`}
        role="button"
        tabIndex={0}
      >
        <span>{loading ? "ADDING..." : "ADD TO CART"}{total ? " –" : ""}</span>
        {total && (
          <span className="tf-qty-price total-price">${total}</span>
        )}
      </a>

      {/* Feedback message */}
      {feedback && (
        <p
          className={`text-sm font-medium mt-2 ${
            feedback === "Added to cart!" ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
