import { NextResponse } from "next/server";
import { dbEnabled, stripeEnabled, stripeLive } from "@/lib/shop/config";
import { createOrder, setProviderRef } from "@/lib/shop/orders";
import { CartError, priceCart } from "@/lib/shop/products";
import { createCheckoutSession } from "@/lib/shop/stripe";

export async function POST(req) {
  if (!stripeEnabled() || !dbEnabled()) {
    return NextResponse.json({ error: "Card payments are not available right now." }, { status: 503 });
  }
  try {
    const { items } = await req.json();
    const priced = await priceCart(items, { allowSamples: !stripeLive() });
    const order = await createOrder({ provider: "stripe", priced });
    const session = await createCheckoutSession(order, priced);
    await setProviderRef(order.id, session.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof CartError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("[stripe] checkout failed:", e);
    return NextResponse.json({ error: "We couldn't start checkout. Please try again." }, { status: 500 });
  }
}
