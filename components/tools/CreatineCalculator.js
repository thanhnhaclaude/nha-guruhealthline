"use client";
import { useState } from "react";

const round = (n, step = 0.5) => Math.round(n / step) * step;

export default function CreatineCalculator() {
  const [weight, setWeight] = useState("75");
  const [unit, setUnit] = useState("kg");
  const kg = unit === "kg" ? parseFloat(weight) : parseFloat(weight) * 0.4536;
  const valid = kg > 30 && kg < 250;

  // ISSN position stand: ~0.03 g/kg/day maintenance (3–5 g typical), loading ~0.3 g/kg/day for 5–7 days.
  const maintenance = valid ? Math.min(10, Math.max(3, round(kg * 0.03))) : null;
  const loading = valid ? round(kg * 0.3, 1) : null;

  return (
    <>
      <div className="tool-panel">
        <div className="field-row">
          <div className="field">
            <label htmlFor="w">Body weight</label>
            <input id="w" type="number" inputMode="decimal" min="30" max="500" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="u">Unit</label>
            <select id="u" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>
        {!valid && <p className="hint" role="alert">Enter a body weight between 30 and 250 kg (66–550 lb).</p>}
      </div>

      {valid && (
        <div className="field-row" aria-live="polite">
          <div className="tool-panel" style={{ margin: 0 }}>
            <p className="muted" style={{ margin: 0 }}>Daily maintenance dose</p>
            <p className="big-number" style={{ margin: "4px 0" }}>{maintenance} g</p>
            <p className="small muted" style={{ margin: 0 }}>Creatine monohydrate, every day including rest days. Saturates muscle in about 3–4 weeks.</p>
          </div>
          <div className="tool-panel" style={{ margin: 0 }}>
            <p className="muted" style={{ margin: 0 }}>Optional loading phase</p>
            <p className="big-number" style={{ margin: "4px 0" }}>{loading} g/day</p>
            <p className="small muted" style={{ margin: 0 }}>
              For 5–7 days, split into 4 doses of about {round(loading / 4)} g, then switch to {maintenance} g/day.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
