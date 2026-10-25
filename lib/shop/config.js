// Store settings. Secrets live only in environment variables (hPanel → Node.js
// app → Environment variables, or .env.local for development) — never in git.

const env = (k, d = "") => (process.env[k] ?? d).trim();
const money = (k, d) => Math.round(Number(env(k, String(d))) * 100);

export const CURRENCY = "usd";
export const SHIP_COUNTRIES = ["US"];

// Shipping: flat rate below the threshold, free at or above it.
export const SHIPPING = {
  flatCents: money("SHIPPING_FLAT_USD", 5.95),
  freeFromCents: money("FREE_SHIPPING_FROM_USD", 50),
  label: "Standard shipping (3–7 business days)",
};

export const STRIPE = {
  secretKey: env("STRIPE_SECRET_KEY"),
  webhookSecret: env("STRIPE_WEBHOOK_SECRET"),
  // Stripe Tax must be activated in the Stripe Dashboard before turning this on.
  automaticTax: env("STRIPE_AUTOMATIC_TAX") === "true",
};
export const stripeEnabled = () => Boolean(STRIPE.secretKey);
export const stripeLive = () => STRIPE.secretKey.startsWith("sk_live_") || STRIPE.secretKey.startsWith("rk_live_");

export const PAYPAL = {
  clientId: env("PAYPAL_CLIENT_ID"),
  clientSecret: env("PAYPAL_CLIENT_SECRET"),
  live: env("PAYPAL_ENV", "sandbox") === "live",
};
PAYPAL.apiBase = PAYPAL.live ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
export const paypalEnabled = () => Boolean(PAYPAL.clientId && PAYPAL.clientSecret);

// Fulfillment through Supliful. Supliful's documented route for custom
// storefronts is a Shopify store used only as a headless order backend
// (help.supliful.com: "Connect your custom app to Supliful using Shopify Admin API").
export const SHOPIFY = {
  domain: env("SHOPIFY_STORE_DOMAIN"), // your-store.myshopify.com
  token: env("SHOPIFY_ADMIN_TOKEN"),
  webhookSecret: env("SHOPIFY_WEBHOOK_SECRET"),
  apiVersion: env("SHOPIFY_API_VERSION", "2025-07"),
};
export const shopifyEnabled = () => Boolean(SHOPIFY.domain && SHOPIFY.token);

export const MAIL = {
  host: env("SMTP_HOST", "smtp.hostinger.com"),
  port: Number(env("SMTP_PORT", "465")),
  user: env("SMTP_USER"),
  pass: env("SMTP_PASS"),
  from: env("MAIL_FROM") || env("SMTP_USER"),
  notify: env("ORDER_NOTIFY_EMAIL") || env("SMTP_USER"),
};
export const mailEnabled = () => Boolean(MAIL.user && MAIL.pass);

export const ADMIN = {
  password: env("ADMIN_PASSWORD"),
  secret: env("ADMIN_SESSION_SECRET"),
};

export const DATABASE_URL = env("DATABASE_URL");
export const dbEnabled = () => Boolean(DATABASE_URL);

export const MAX_QTY = 10;

export const formatUsd = (cents) => `$${(cents / 100).toFixed(2)}`;
