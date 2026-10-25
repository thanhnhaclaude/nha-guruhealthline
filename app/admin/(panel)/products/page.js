import Link from "next/link";
import { requireAdmin } from "@/lib/shop/admin-auth";
import { dbEnabled } from "@/lib/shop/config";
import { getProducts } from "@/lib/shop/products";
import { saveProduct } from "../../actions";

const dollars = (c) => (c == null ? "" : (c / 100).toFixed(2));

export default async function AdminProducts() {
  await requireAdmin();
  const products = await getProducts({ includeInactive: true });
  return (
    <>
      <h1>Products</h1>
      <p className="muted">
        Product text lives in <code>content/products/*.md</code>. Here you set the live price, availability and the Shopify variant ID that
        routes the order to Supliful (format <code>gid://shopify/ProductVariant/123</code>).
      </p>
      {!dbEnabled() && <p className="shop-note">Set DATABASE_URL to edit prices here.</p>}
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Product</th><th>Price $</th><th>Compare-at $</th><th>Active</th><th>Shopify variant ID</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug}>
                <td>
                  <Link href={`/shop/${p.slug}/`}>{p.name}</Link>
                  {p.sample && <><br /><span className="example-flag">Sample</span></>}
                </td>
                <td colSpan={5}>
                  <form action={saveProduct} className="admin-inline">
                    <input type="hidden" name="slug" value={p.slug} />
                    <input name="price" inputMode="decimal" defaultValue={dollars(p.priceCents)} aria-label={`Price for ${p.name}`} size={7} />
                    <input name="compare_at" inputMode="decimal" defaultValue={dollars(p.compareAtCents)} aria-label={`Compare-at price for ${p.name}`} size={7} />
                    <input type="checkbox" name="active" defaultChecked={p.active} aria-label={`${p.name} active`} />
                    <input name="shopify_variant_id" defaultValue={p.shopifyVariantId} placeholder="gid://shopify/ProductVariant/…" aria-label={`Shopify variant for ${p.name}`} />
                    <button className="btn btn-outline" disabled={!dbEnabled()}>Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
