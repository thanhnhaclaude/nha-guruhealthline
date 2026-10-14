"use client";
import { useState } from "react";
import { bestGrade, findEvidence } from "@/lib/evidence";

const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const start = [
  { name: "Multivitamin", cost: "18", ingredients: "vitamin D, zinc, magnesium, vitamin C" },
  { name: "Vitamin D3 2000 IU", cost: "9", ingredients: "vitamin D" },
  { name: "Garcinia fat burner", cost: "45", ingredients: "garcinia, green tea extract" },
];

export default function SpendingAudit() {
  const [rows, setRows] = useState(start);
  const update = (i, k, v) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const add = () => setRows((r) => [...r, { name: "", cost: "", ingredients: "" }]);
  const remove = (i) => setRows((r) => r.filter((_, j) => j !== i));

  const monthly = rows.reduce((s, r) => s + (parseFloat(r.cost) || 0), 0);
  const seen = {};
  rows.forEach((r, i) => r.ingredients.split(",").map((x) => x.trim()).filter(Boolean).forEach((ing) => {
    const ev = findEvidence(ing);
    const key = ev ? ev.name : ing.toLowerCase();
    (seen[key] ||= new Set()).add(r.name || `Product ${i + 1}`);
  }));
  const dupes = Object.entries(seen).filter(([, s]) => s.size > 1);
  const weak = rows.filter((r) => r.ingredients.split(",").some((x) => { const e = findEvidence(x); return e && bestGrade(e) === "D"; }));

  return (
    <>
      <div className="tool-panel">
        {rows.map((r, i) => (
          <div className="field-row" key={i} style={{ alignItems: "end", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
            <div className="field"><label htmlFor={`n${i}`}>Product</label><input id={`n${i}`} value={r.name} onChange={(e) => update(i, "name", e.target.value)} /></div>
            <div className="field"><label htmlFor={`c${i}`}>Cost per month ($)</label><input id={`c${i}`} type="number" min="0" inputMode="decimal" value={r.cost} onChange={(e) => update(i, "cost", e.target.value)} /></div>
            <div className="field"><label htmlFor={`i${i}`}>Key ingredients (comma separated)</label><input id={`i${i}`} value={r.ingredients} onChange={(e) => update(i, "ingredients", e.target.value)} /></div>
            <div className="field"><button type="button" className="btn btn-outline" onClick={() => remove(i)} aria-label={`Remove ${r.name || "product"}`}>Remove</button></div>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={add}>+ Add product</button>
      </div>
      <section aria-live="polite">
        <div className="field-row">
          <div className="tool-panel" style={{ margin: 0 }}><p className="muted" style={{ margin: 0 }}>Per month</p><p className="big-number" style={{ margin: 0 }}>{money(monthly)}</p></div>
          <div className="tool-panel" style={{ margin: 0 }}><p className="muted" style={{ margin: 0 }}>Per year</p><p className="big-number" style={{ margin: 0 }}>{money(monthly * 12)}</p></div>
        </div>
        {dupes.map(([ing, s]) => (
          <div className="result caution" key={ing}><h3>Duplicate: {ing}</h3><p>Found in {[...s].join(", ")}. Check the combined dose stays under the upper limit, or drop one source.</p></div>
        ))}
        {weak.map((r) => (
          <div className="result avoid" key={r.name}><h3>Low evidence: {r.name}</h3><p>Contains ingredients graded D in our evidence database. Consider whether it&apos;s worth {money((parseFloat(r.cost) || 0) * 12)} a year.</p></div>
        ))}
        {!dupes.length && !weak.length && <p className="muted">No duplicates or low-evidence products detected.</p>}
      </section>
    </>
  );
}
