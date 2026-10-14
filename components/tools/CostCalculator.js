"use client";
import { useState } from "react";

const money = (n) => (Number.isFinite(n) ? n.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "–");

function calc(p) {
  const price = parseFloat(p.price), count = parseFloat(p.count), perServing = parseFloat(p.perServing), perDay = parseFloat(p.perDay);
  if (!(price > 0 && count > 0 && perServing > 0 && perDay > 0)) return null;
  const servings = count / perServing;
  const day = (price / servings) * perDay;
  return { day, month: day * 30.4, year: day * 365, lasts: Math.floor(servings / perDay) };
}

export default function CostCalculator() {
  const [items, setItems] = useState([
    { name: "Brand A", price: "19.99", count: "120", perServing: "2", perDay: "1" },
    { name: "Brand B", price: "29.99", count: "90", perServing: "1", perDay: "1" },
  ]);
  const update = (i, k, v) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const res = items.map(calc);
  const best = res.reduce((b, r, i) => (r && (b < 0 || r.day < res[b].day) ? i : b), -1);

  return (
    <div className="field-row">
      {items.map((p, i) => (
        <div className="tool-panel" style={{ margin: 0 }} key={i}>
          <div className="field"><label htmlFor={`nm${i}`}>Product</label><input id={`nm${i}`} value={p.name} onChange={(e) => update(i, "name", e.target.value)} /></div>
          <div className="field"><label htmlFor={`pr${i}`}>Price ($)</label><input id={`pr${i}`} type="number" min="0" inputMode="decimal" value={p.price} onChange={(e) => update(i, "price", e.target.value)} /></div>
          <div className="field"><label htmlFor={`ct${i}`}>Capsules, tablets or scoops in the container</label><input id={`ct${i}`} type="number" min="0" inputMode="decimal" value={p.count} onChange={(e) => update(i, "count", e.target.value)} /></div>
          <div className="field"><label htmlFor={`ps${i}`}>Units per serving</label><input id={`ps${i}`} type="number" min="0" inputMode="decimal" value={p.perServing} onChange={(e) => update(i, "perServing", e.target.value)} /></div>
          <div className="field"><label htmlFor={`pd${i}`}>Servings you take per day</label><input id={`pd${i}`} type="number" min="0" inputMode="decimal" value={p.perDay} onChange={(e) => update(i, "perDay", e.target.value)} /></div>
          <div aria-live="polite">
            {res[i] ? (
              <>
                <p className="big-number" style={{ margin: 0 }}>{money(res[i].day)}<span className="small muted"> /day</span></p>
                <p className="small muted" style={{ margin: 0 }}>{money(res[i].month)} a month · {money(res[i].year)} a year · lasts {res[i].lasts} days</p>
                {best === i && <span className="chip" style={{ display: "inline-block", marginTop: 8 }}>Cheaper per day</span>}
              </>
            ) : <p className="hint">Fill in every field with a number above zero.</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
