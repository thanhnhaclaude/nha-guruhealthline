"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart/" className="sh-icon cart-link" aria-label={`Cart, ${ready ? count : 0} items`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6L5 3H2" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      {ready && count > 0 && <span className="cart-count">{count}</span>}
    </Link>
  );
}
