"use client";
import { useMemo, useState } from "react";
import { INTERACTIONS, MEDICATIONS, SUPPLEMENTS } from "@/lib/tooldata";

const LABEL = { avoid: "Avoid combining", caution: "Use caution", ok: "Works well together" };
const ORDER = { avoid: 0, caution: 1, ok: 2 };

export default function InteractionChecker() {
  const [picked, setPicked] = useState(["Calcium", "Iron", "Vitamin D"]);
  const toggle = (name) =>
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));

  const results = useMemo(
    () =>
      INTERACTIONS.filter((i) => picked.includes(i.a) && picked.includes(i.b)).sort(
        (x, y) => ORDER[x.level] - ORDER[y.level],
      ),
    [picked],
  );

  return (
    <>
      <div className="tool-panel">
        <fieldset className="field" style={{ border: 0, padding: 0, margin: "0 0 16px" }}>
          <legend>Supplements you take</legend>
          <div className="check-grid">
            {SUPPLEMENTS.map((s) => (
              <label key={s}>
                <input type="checkbox" checked={picked.includes(s)} onChange={() => toggle(s)} /> {s}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend>Medications (optional)</legend>
          <div className="check-grid">
            {MEDICATIONS.map((s) => (
              <label key={s}>
                <input type="checkbox" checked={picked.includes(s)} onChange={() => toggle(s)} /> {s}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <section aria-live="polite">
        <h2 style={{ marginTop: 0 }}>Results for {picked.length} selected</h2>
        {picked.length < 2 && <p className="muted">Select at least two items to check combinations.</p>}
        {picked.length >= 2 && results.length === 0 && (
          <div className="result">
            <h3>No interactions in our database</h3>
            <p>
              That doesn&apos;t prove the combination is safe. Our list covers well-documented interactions only. Ask your
              pharmacist to review everything you take.
            </p>
          </div>
        )}
        {results.map((r) => (
          <div className={`result ${r.level}`} key={r.a + r.b}>
            <h3>
              {r.a} + {r.b} <span className="sev">{LABEL[r.level]}</span>
            </h3>
            <p>{r.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
