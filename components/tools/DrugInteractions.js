"use client";
import { useState } from "react";
import { ALL_MEDICATIONS, INTERACTIONS } from "@/lib/tooldata";

const LABEL = { avoid: "Avoid combining", caution: "Use caution", ok: "Good to know" };
const ORDER = { avoid: 0, caution: 1, ok: 2 };

export default function DrugInteractions() {
  const [drug, setDrug] = useState("Warfarin");
  const hits = INTERACTIONS.filter((i) => i.a === drug || i.b === drug).sort((x, y) => ORDER[x.level] - ORDER[y.level]);
  return (
    <>
      <div className="tool-panel">
        <div className="field" style={{ maxWidth: 520 }}>
          <label htmlFor="drug">Your medication</label>
          <select id="drug" value={drug} onChange={(e) => setDrug(e.target.value)}>
            {ALL_MEDICATIONS.map((m) => <option key={m}>{m}</option>)}
          </select>
          <span className="hint">Don&apos;t see yours? Ask your pharmacist; our list covers well-documented interactions only.</span>
        </div>
      </div>
      <section aria-live="polite">
        <h2 style={{ marginTop: 0 }}>{hits.length} supplement interaction{hits.length === 1 ? "" : "s"} with {drug}</h2>
        {hits.map((h) => {
          const supp = h.a === drug ? h.b : h.a;
          return (
            <div className={`result ${h.level}`} key={supp}>
              <h3>{supp} <span className="sev">{LABEL[h.level]}</span></h3>
              <p>{h.text}</p>
            </div>
          );
        })}
        {hits.length === 0 && <p className="muted">No interactions in our database. That doesn&apos;t prove a combination is safe.</p>}
      </section>
    </>
  );
}
