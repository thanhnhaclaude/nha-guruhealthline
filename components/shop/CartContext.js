"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// The cart lives in this browser only (localStorage). It stores a display
// snapshot; the server re-prices every item at checkout.
const KEY = "gh_cart_v1";
const MAX_QTY = 10;
const CartCtx = createContext(null);

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((i) => i && typeof i.slug === "string" && i.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
    const onStorage = (e) => e.key === KEY && setItems(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((product, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.slug === product.slug);
      if (found) return cur.map((i) => (i.slug === product.slug ? { ...i, ...product, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
      return [...cur, { ...product, qty: Math.min(MAX_QTY, qty) }];
    });
  }, []);
  const setQty = useCallback((slug, qty) => {
    setItems((cur) => (qty < 1 ? cur.filter((i) => i.slug !== slug) : cur.map((i) => (i.slug === slug ? { ...i, qty: Math.min(MAX_QTY, qty) } : i))));
  }, []);
  const remove = useCallback((slug) => setItems((cur) => cur.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotalCents = items.reduce((s, i) => s + i.qty * (i.priceCents || 0), 0);
    return { items, ready, count, subtotalCents, add, setQty, remove, clear, MAX_QTY };
  }, [items, ready, add, setQty, remove, clear]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export const usd = (cents) => `$${(cents / 100).toFixed(2)}`;
