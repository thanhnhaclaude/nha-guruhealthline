import mysql from "mysql2/promise";
import { DATABASE_URL, dbEnabled } from "./config";

// One pool per server process (kept on globalThis so dev hot reloads reuse it).
const g = globalThis;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    number VARCHAR(32) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    provider VARCHAR(10) NOT NULL,
    provider_ref VARCHAR(255) NULL,
    payment_ref VARCHAR(255) NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    subtotal_cents INT NOT NULL,
    shipping_cents INT NOT NULL,
    tax_cents INT NOT NULL DEFAULT 0,
    total_cents INT NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(40) NULL,
    name VARCHAR(255) NULL,
    shipping_address TEXT NULL,
    items TEXT NOT NULL,
    fulfillment_status VARCHAR(20) NOT NULL DEFAULT 'none',
    fulfillment_ref VARCHAR(255) NULL,
    fulfillment_error TEXT NULL,
    tracking_number VARCHAR(100) NULL,
    tracking_carrier VARCHAR(50) NULL,
    tracking_url VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME NULL,
    shipped_at DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_status (status),
    INDEX idx_orders_provider_ref (provider_ref)
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS order_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    type VARCHAR(40) NOT NULL,
    message TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_events_order (order_id)
  ) DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS product_settings (
    slug VARCHAR(120) PRIMARY KEY,
    price_cents INT NULL,
    compare_at_cents INT NULL,
    active TINYINT(1) NULL,
    shopify_variant_id VARCHAR(100) NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) DEFAULT CHARSET=utf8mb4`,
  // Webhook deliveries already handled (Stripe, Shopify retry on timeouts).
  `CREATE TABLE IF NOT EXISTS webhook_events (
    id VARCHAR(255) PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) DEFAULT CHARSET=utf8mb4`,
];

export async function getDb() {
  if (!dbEnabled()) throw new Error("DATABASE_URL is not set");
  if (!g.__ghPool) {
    g.__ghPool = mysql.createPool({ uri: DATABASE_URL, connectionLimit: 5, dateStrings: true, timezone: "Z" });
    // Store and show every timestamp in UTC, whatever the server's own time zone.
    g.__ghPool.pool.on("connection", (conn) => conn.query("SET time_zone = '+00:00'"));
    g.__ghSchema = (async () => {
      for (const sql of SCHEMA) await g.__ghPool.query(sql);
    })().catch((e) => {
      g.__ghPool = null;
      throw e;
    });
  }
  await g.__ghSchema;
  return g.__ghPool;
}

export async function query(sql, params = []) {
  const db = await getDb();
  const [rows] = await db.execute(sql, params);
  return rows;
}

// Returns false when the id was seen before (duplicate webhook delivery).
export async function claimWebhookEvent(id) {
  try {
    await query("INSERT INTO webhook_events (id) VALUES (?)", [id]);
    return true;
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return false;
    throw e;
  }
}

export async function releaseWebhookEvent(id) {
  await query("DELETE FROM webhook_events WHERE id = ?", [id]);
}
