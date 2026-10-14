import { buildStoreUrl, storeLabel } from "@/lib/affiliate";

export default function ProductPicks({ products }) {
  if (!products?.length) return null;
  return (
    <section className="picks" aria-label="Where to buy">
      {products.map((p) => (
        <div className="pick" key={p.name}>
          <div>
            {p.badge && <span className="badge">{p.badge}</span>}
            <h3>{p.name}</h3>
            <p>{p.why}</p>
          </div>
          <a
            className="btn btn-accent"
            href={buildStoreUrl(p)}
            target="_blank"
            rel="sponsored nofollow noopener"
          >
            Check options on {storeLabel(p)}
          </a>
        </div>
      ))}
    </section>
  );
}
