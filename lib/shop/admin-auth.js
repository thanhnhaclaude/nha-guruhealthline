import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN } from "./config";

// Single-owner admin: one password from ADMIN_PASSWORD, and a signed,
// HttpOnly session cookie valid for 12 hours.
const COOKIE = "gh_admin";
const TTL_MS = 12 * 60 * 60 * 1000;

const secret = () => ADMIN.secret || crypto.createHash("sha256").update(`gh-admin:${ADMIN.password}`).digest("hex");
const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("base64url");

function safeEqual(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

export const adminConfigured = () => ADMIN.password.length >= 12;

export function passwordMatches(input) {
  return adminConfigured() && safeEqual(input, ADMIN.password);
}

export async function startSession() {
  const exp = String(Date.now() + TTL_MS);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value || "";
  const [exp, sig] = v.split(".");
  return Boolean(exp && sig && safeEqual(sig, sign(exp)) && Number(exp) > Date.now());
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login/");
}
