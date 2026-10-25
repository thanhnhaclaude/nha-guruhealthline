import Stripe from "stripe";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { CURRENCY, SHIP_COUNTRIES, SHIPPING, STRIPE } from "./config";

let client;
export function stripe() {
  if (!client) client = new Stripe(STRIPE.secretKey, { appInfo: { name: SITE_NAME } });
  return client;
}

/** Stripe-hosted Checkout: card details never touch this server (PCI SAQ A). */
export async function createCheckoutSession(order, priced) {
  return stripe().checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: order.id,
      metadata: { order_id: order.id, order_number: order.number },
      payment_intent_data: { metadata: { order_id: order.id, order_number: order.number }, description: `${SITE_NAME} order ${order.number}` },
      line_items: priced.items.map((i) => ({
        quantity: i.qty,
        price_data: { currency: CURRENCY, unit_amount: i.unitCents, product_data: { name: i.name, metadata: { slug: i.slug } } },
      })),
      shipping_address_collection: { allowed_countries: SHIP_COUNTRIES },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: priced.shippingCents === 0 ? "Free standard shipping" : SHIPPING.label,
            fixed_amount: { amount: priced.shippingCents, currency: CURRENCY },
            delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 7 } },
          },
        },
      ],
      // Supliful declines orders without a phone number.
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: STRIPE.automaticTax },
      success_url: `${absoluteUrl("/checkout/success/")}?order=${order.id}`,
      cancel_url: absoluteUrl("/cart/"),
    },
    { idempotencyKey: `checkout-${order.id}` },
  );
}

/** Normalizes a completed Checkout Session into our order fields. */
export function sessionDetails(session) {
  const ship = session.collected_information?.shipping_details || session.shipping_details || null;
  const cust = session.customer_details || {};
  const a = ship?.address || cust.address || {};
  return {
    email: cust.email,
    phone: cust.phone,
    name: ship?.name || cust.name,
    address: { name: ship?.name || cust.name, line1: a.line1, line2: a.line2, city: a.city, state: a.state, postal_code: a.postal_code, country: a.country, phone: cust.phone },
    taxCents: session.total_details?.amount_tax || 0,
    totalCents: session.amount_total,
    paymentRef: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || session.id,
  };
}
