import LoginForm from "./LoginForm";
import { adminConfigured } from "@/lib/shop/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign-in", robots: { index: false, follow: false } };

export default function AdminLogin() {
  return (
    <div className="container page-head admin" style={{ maxWidth: 420 }}>
      <h1>Store admin</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="shop-note">Set ADMIN_PASSWORD (at least 12 characters) in the environment variables to enable the admin.</p>
      )}
    </div>
  );
}
