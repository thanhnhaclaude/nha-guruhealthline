"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Bottle from "./Bottle";
import { usd, useCart } from "./CartContext";

const payload = (items) => items.map((i) => ({ slug: i.slug, qty: i.qty }));

export default function CartView({ stripeOn, paypalClientId, freeFromCents, flatCents }) {
  const { items, ready, subtotalCents, setQty, remove, MAX_QTY } = useCart();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState("");

  if (!ready) return <p className="muted">Loading your cart…</p>;
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty.</p>
        <Link href="/shop/" className="btn btn-primary">Browse the shop</Link>
      </div>
    );
  }

  const shippingCents = subtotalCents >= freeFromCents ? 0 : flatCents;
  const toFree = freeFromCents - subtotalCents;

  async function payWithCard() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout/stripe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload(items) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="cart">
      <ul className="cart-items">
        {items.map((i) => (
          <li key={i.slug} className="cart-item">
            <Link href={`/shop/${i.slug}/`} className="cart-thumb" tabIndex={-1} aria-hidden="true">
              <Bottle product={{ ...i, shortName: i.shortName || i.name }} size={84} />
            </Link>
            <div className="cart-item-info">
              <Link href={`/shop/${i.slug}/`} className="cart-item-name">{i.name}</Link>
              <span className="muted small">{usd(i.priceCents)} each</span>
              <button type="button" className="linklike small" onClick={() => remove(i.slug)}>Remove</button>
            </div>
            <label className="qty">
              <span className="sr-only">Quantity of {i.name}</span>
              <button type="button" onClick={() => setQty(i.slug, i.qty - 1)} aria-label={`Decrease ${i.name}`}>−</button>
              <input type="number" min="0" max={MAX_QTY} value={i.qty} onChange={(e) => setQty(i.slug, Number(e.target.value) || 0)} />
              <button type="button" onClick={() => setQty(i.slug, i.qty + 1)} aria-label={`Increase ${i.name}`}>+</button>
            </label>
            <strong className="cart-line">{usd(i.priceCents * i.qty)}</strong>
          </li>
        ))}
      </ul>

      <aside className="cart-summary" aria-label="Order summary">
        <h2>Order summary</h2>
        <dl>
          <div><dt>Subtotal</dt><dd>{usd(subtotalCents)}</dd></div>
          <div><dt>Shipping (US)</dt><dd>{shippingCents === 0 ? "Free" : usd(shippingCents)}</dd></div>
          <div className="cart-total"><dt>Estimated total</dt><dd>{usd(subtotalCents + shippingCents)}</dd></div>
        </dl>
        {toFree > 0 && <p className="ship-hint">Add {usd(toFree)} more for free shipping.</p>}
        <p className="muted small">We ship to US addresses only. Sales tax, if any, is calculated at checkout.</p>

        {error && <p className="form-error" role="alert">{error}</p>}

        {stripeOn && (
          <button type="button" className="btn btn-primary pay-btn" onClick={payWithCard} disabled={busy}>
            {busy ? "Opening secure checkout…" : "Pay with card"}
          </button>
        )}
        {stripeOn && <p className="pay-sub">Card, Apple Pay and Google Pay through Stripe</p>}

        {paypalClientId && (
          <div className="paypal-box">
            {stripeOn && <div className="or"><span>or</span></div>}
            <label className="field">
              <span>Phone for delivery updates (required for PayPal)</span>
              <input type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 555-1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <PayPalButtons clientId={paypalClientId} items={items} phone={phone} onError={setError} />
          </div>
        )}

        {!stripeOn && !paypalClientId && <p className="shop-note">Checkout is not open yet. Please check back soon.</p>}
        <p className="muted small secure">🔒 Payments are processed by Stripe and PayPal. We never see or store your card number.</p>
      </aside>
    </div>
  );
}

function PayPalButtons({ clientId, items, phone, onError }) {
  const ref = useRef(null);
  const state = useRef({ items, phone });
  state.current = { items, phone };
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const id = "paypal-sdk";
    const render = () => {
      if (cancelled || !window.paypal || !ref.current) return;
      ref.current.innerHTML = "";
      window.paypal
        .Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal", height: 45 },
          onClick: (_data, actions) => {
            const digits = state.current.phone.replace(/\D/g, "");
            if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) {
              onError("Please enter a valid US phone number before paying with PayPal.");
              return actions.reject();
            }
            onError("");
            return actions.resolve();
          },
          createOrder: async () => {
            const res = await fetch("/api/checkout/paypal/create/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: payload(state.current.items), phone: state.current.phone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "PayPal checkout failed.");
            return data.id;
          },
          onShippingAddressChange: (data, actions) => {
            if (data.shippingAddress?.countryCode !== "US") return actions.reject(data.errors?.COUNTRY_ERROR);
          },
          onApprove: async (data, actions) => {
            const res = await fetch("/api/checkout/paypal/capture/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paypalOrderId: data.orderID }),
            });
            const out = await res.json();
            if (out.restart) return actions.restart();
            if (!res.ok) return onError(out.error || "Payment failed.");
            router.push(`/checkout/success/?order=${out.orderId}`);
          },
          onError: (err) => onError(err?.message || "PayPal checkout failed. Please try again."),
        })
        .render(ref.current);
    };
    if (window.paypal) render();
    else if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons&disable-funding=paylater,card`;
      s.onload = render;
      document.body.appendChild(s);
    } else document.getElementById(id).addEventListener("load", render);
    return () => {
      cancelled = true;
    };
  }, [clientId, onError, router]);

  return <div ref={ref} className="paypal-buttons" />;
}
