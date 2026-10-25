// Drawn product placeholder until real Supliful product photos are added.
export default function Bottle({ product, size = 220 }) {
  const c = product.color || "#1a7a4a";
  const pouch = product.form === "Powder";
  return (
    <svg className="bottle" width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`${product.name} ${product.form?.toLowerCase() || ""}`.trim()}>
      <rect width="200" height="200" rx="16" fill={c} fillOpacity="0.08" />
      {pouch ? (
        <>
          <path d="M58 40h84l8 130a10 10 0 0 1-10 10H60a10 10 0 0 1-10-10z" fill="#fff" stroke={c} strokeWidth="3" />
          <rect x="58" y="40" width="84" height="12" fill={c} />
        </>
      ) : (
        <>
          <rect x="74" y="26" width="52" height="22" rx="5" fill={c} />
          <rect x="56" y="46" width="88" height="132" rx="16" fill="#fff" stroke={c} strokeWidth="3" />
        </>
      )}
      <rect x="60" y="84" width="80" height="62" rx="6" fill={c} />
      <text x="100" y="102" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing=".4">GURUHEALTHLINE</text>
      <text
        x="100"
        y="121"
        textAnchor="middle"
        fill="#fff"
        fontSize={product.shortName.length > 16 ? 7 : product.shortName.length > 11 ? 8.5 : 11}
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        {product.shortName}
      </text>
      <text x="100" y="137" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="Arial, sans-serif" opacity=".9">{product.form}</text>
    </svg>
  );
}
