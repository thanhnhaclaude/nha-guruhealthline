"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";

export default function AddToCart({ product, disabled }) {
  const { add, MAX_QTY } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (disabled) {
    return <p className="shop-note">This product is not available right now.</p>;
  }

  return (
    <div className="atc">
      <div className="atc-row">
        <label className="qty">
          <span className="sr-only">Quantity</span>
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <input type="number" min="1" max={MAX_QTY} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(MAX_QTY, Number(e.target.value) || 1)))} />
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} aria-label="Increase quantity">+</button>
        </label>
        <button
          type="button"
          className="btn btn-primary atc-btn"
          onClick={() => {
            add(product, qty);
            setAdded(true);
          }}
        >
          Add to cart
        </button>
      </div>
      <p className="atc-status" role="status" aria-live="polite">
        {added && (
          <>
            ✓ Added to your cart · <Link href="/cart/">View cart and check out</Link>
          </>
        )}
      </p>
    </div>
  );
}
