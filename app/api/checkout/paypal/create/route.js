import { NextResponse } from "next/server";
import { PAYPAL, dbEnabled, paypalEnabled } from "@/lib/shop/config";
import { createOrder, setProviderRef } from "@/lib/shop/orders";
import { createPaypalOrder } from "@/lib/shop/paypal";
import { CartError, priceCart } from "@/lib/shop/products";

export async function POST(req) {
  if (!paypalEnabled() || !dbEnabled()) {
    return NextResponse.json({ error: "PayPal is not available right now." }, { status: 503 });
  }
  try {
    const { items, phone } = await req.json();
    // PayPal doesn't always share the buyer's phone, and Supliful requires one.
    const digits = String(phone || "").replace(/\D/g, "");
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) {
      return NextResponse.json({ error: "Please enter a valid US phone number for delivery updates." }, { status: 400 });
    }
    const priced = await priceCart(items, { allowSamples: !PAYPAL.live });
    const order = await createOrder({ provider: "paypal", priced, phone: digits.slice(-10) });
    const pp = await createPaypalOrder(order, priced);
    await setProviderRef(order.id, pp.id);
    return NextResponse.json({ id: pp.id });
  } catch (e) {
    if (e instanceof CartError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("[paypal] create failed:", e);
    return NextResponse.json({ error: "We couldn't start PayPal checkout. Please try again." }, { status: 500 });
  }
}
