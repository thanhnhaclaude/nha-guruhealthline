"use client";
import { useState } from "react";

const blank = (name, price, servings, amount) => ({ name, price, servings, amount });
const money = (n) => (Number.isFinite(n) ? n.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "–");

function calc(p, target) {
  const price = parseFloat(p.price), servings = parseFloat(p.servings), amount = parseFloat(p.amount), t = parseFloat(target);
  if (!(price > 0 && servings > 0 && amount > 0 && t > 0)) return null;
  const perServing = price / servings;
  const servingsPerDay = t / amount;
  const perDay = perServing * servingsPerDay;
  return { perDay, perMonth: perDay * 30, servingsPerDay, lasts: servings / servingsPerDay };
}

export default function CostPerDose() {
  const [target, setTarget] = useState("200");
  const [items, setItems] = useState([
    blank("Product A", "24.99", "60", "200"),
    blank("Product B", "14.99", "120", "100"),
  ]);
  const update = (i, k, v) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const results = items.map((p) => calc(p, target));
  const best = results.reduce((b, r, i) => (r && (b < 0 || r.perDay < results[b].perDay) ? i : b), -1);

  return (
    <>
      <div className="tool-panel">
        <div className="field" style={{ maxWidth: 320 }}>
          <label htmlFor="target">Dose you want per day (mg, mcg or IU of the active ingredient)</label>
          <input id="target" type="number" inputMode="decimal" min="0" value={target} onChange={(e) => setTarget(e.target.value)} />
          <span className="hint">Use the elemental or active amount on the Supplement Facts label.</span>
        </div>
      </div>
      <div className="field-row">
        {items.map((p, i) => (
          <div className="tool-panel" style={{ margin: 0 }} key={i}>
            <div className="field">
              <label htmlFor={`n${i}`}>Product name</label>
              <input id={`n${i}`} value={p.name} onChange={(e) => update(i, "name", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`p${i}`}>Price ($)</label>
              <input id={`p${i}`} type="number" inputMode="decimal" min="0" value={p.price} onChange={(e) => update(i, "price", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`s${i}`}>Servings per container</label>
              <input id={`s${i}`} type="number" inputMode="decimal" min="0" value={p.servings} onChange={(e) => update(i, "servings", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`a${i}`}>Active amount per serving</label>
              <input id={`a${i}`} type="number" inputMode="decimal" min="0" value={p.amount} onChange={(e) => update(i, "amount", e.target.value)} />
            </div>
            <div aria-live="polite">
              {results[i] ? (
                <>
                  <p className="big-number" style={{ margin: 0 }}>{money(results[i].perDay)}<span className="muted small"> /day</span></p>
                  <p className="small muted" style={{ margin: 0 }}>
                    {money(results[i].perMonth)} per month · {results[i].servingsPerDay.toFixed(2)} servings/day · lasts{" "}
                    {Math.floor(results[i].lasts)} days
                  </p>
                  {best === i && <p className="chip" style={{ display: "inline-block", marginTop: 8 }}>Best value</p>}
                </>
              ) : (
                <p className="hint">Fill in all fields with numbers above zero.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
