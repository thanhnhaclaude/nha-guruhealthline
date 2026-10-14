"use client";
import Link from "next/link";
import { useState } from "react";

// Risk factors for common deficiencies, from NIH ODS "groups at risk" sections.
const FACTORS = [
  ["vegan", "I eat a vegan diet", { b12: 3, iron: 1, iodine: 1, vitd: 1 }],
  ["veg", "I eat a vegetarian diet (some dairy/eggs)", { b12: 2, iron: 1 }],
  ["age50", "I'm 50 or older", { b12: 2, vitd: 1 }],
  ["sun", "I rarely get midday sun, or live far from the equator", { vitd: 3 }],
  ["darkskin", "I have dark skin", { vitd: 2 }],
  ["periods", "I have heavy menstrual periods", { iron: 3 }],
  ["pregnant", "I'm pregnant or planning pregnancy", { iron: 2, folate: 3, iodine: 2 }],
  ["metformin", "I take metformin", { b12: 3 }],
  ["ppi", "I take an acid reducer (PPI or H2 blocker) long term", { b12: 2, mg: 2 }],
  ["diuretic", "I take a diuretic (water pill)", { mg: 2 }],
  ["gut", "I have Crohn's, celiac disease, or had weight-loss surgery", { b12: 2, iron: 2, vitd: 2, mg: 2, zinc: 2 }],
  ["diabetes", "I have type 2 diabetes", { mg: 2 }],
  ["alcohol", "I drink alcohol heavily", { mg: 2, folate: 2, zinc: 1 }],
  ["nodairy", "I eat little dairy and no fortified foods", { vitd: 1, iodine: 1 }],
  ["noiodized", "I don't use iodized salt or eat seafood/dairy", { iodine: 2 }],
];

const NUTRIENTS = {
  b12: { name: "Vitamin B12", test: "serum B12 (sometimes MMA)", link: "/ingredients/vitamin-b12/" },
  vitd: { name: "Vitamin D", test: "25-hydroxyvitamin D", link: "/vitamin-d-deficiency-symptoms/" },
  iron: { name: "Iron", test: "ferritin and complete blood count", link: "/ferrous-bisglycinate-vs-ferrous-sulfate/" },
  mg: { name: "Magnesium", test: "serum magnesium", link: "/magnesium-deficiency-symptoms/" },
  folate: { name: "Folate", test: "folate level; folic acid is advised before pregnancy", link: null },
  zinc: { name: "Zinc", test: "zinc level, interpreted with care", link: "/ingredients/zinc/" },
  iodine: { name: "Iodine", test: "usually assessed by diet; thyroid tests if symptoms", link: null },
};

export default function DeficiencyCheck() {
  const [sel, setSel] = useState(["age50", "sun"]);
  const toggle = (k) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const scores = {};
  FACTORS.filter((f) => sel.includes(f[0])).forEach(([, , w]) => Object.entries(w).forEach(([n, v]) => (scores[n] = (scores[n] || 0) + v)));
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <div className="tool-panel">
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend>Tick everything that applies</legend>
          <div className="check-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {FACTORS.map(([k, label]) => (
              <label key={k}><input type="checkbox" checked={sel.includes(k)} onChange={() => toggle(k)} /> {label}</label>
            ))}
          </div>
        </fieldset>
      </div>
      <section aria-live="polite">
        <h2 style={{ marginTop: 0 }}>Nutrients worth discussing with your doctor</h2>
        {ranked.length === 0 && <p className="muted">No common risk factors selected.</p>}
        {ranked.map(([n, s]) => {
          const info = NUTRIENTS[n];
          const level = s >= 3 ? "avoid" : s >= 2 ? "caution" : "ok";
          return (
            <div className={`result ${level}`} key={n}>
              <h3>{info.name} <span className="sev">{s >= 3 ? "Higher risk" : s >= 2 ? "Moderate risk" : "Some risk"}</span></h3>
              <p>Test: {info.test}. {info.link && <Link href={info.link}>Learn more</Link>}</p>
            </div>
          );
        })}
        <p className="small muted">This checks risk factors only; it can&apos;t tell you whether you&apos;re deficient. Symptoms overlap with many conditions, so a blood test and your doctor&apos;s advice come first.</p>
      </section>
    </>
  );
}
