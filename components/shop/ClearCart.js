"use client";

import { useEffect } from "react";
import { useCart } from "./CartContext";

/** Empties the cart once the order is paid. */
export default function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
