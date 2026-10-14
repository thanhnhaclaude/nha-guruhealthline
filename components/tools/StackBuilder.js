"use client";
import Link from "next/link";
import { useState } from "react";
import { EVIDENCE } from "@/lib/evidence";
import { INTERACTIONS } from "@/lib/tooldata";

const SLOTS = [
  ["morning", "Morning, with breakfast"],
  ["meal", "With your largest meal"],
  ["any", "Any time (pick one and stay consistent)"],
  ["evening", "Evening, with dinner"],
  ["bedtime", "30–60 minutes before bed"],
];
// Map evidence ids to the names used in the interaction table.
const IX_NAME = { magnesium: "Magnesium", "vitamin-d": "Vitamin D", zinc: "Zinc", "omega-3": "Fish oil", iron: "Iron", calcium: "Calcium", "vitamin-c": "Vitamin C", "vitamin-k2": "Vitamin K", melatonin: "Melatonin", valerian: "Valerian", ashwagandha: "Ashwagandha", psyllium: "Psyllium fiber", "st-johns-wort": "St. John's wort", ginkgo: "Ginkgo", b12: "Vitamin B12", berberine: "Berberine", "red-yeast-rice": "Red yeast rice", potassium: "Potassium", curcumin: "Turmeric", coq10: "CoQ10", biotin: "Biotin", echinacea: "Echinacea" };
// Minerals that compete: keep them in different slots.
const SPREAD = [["iron", "calcium"], ["iron", "zinc"], ["calcium", "zinc"], ["psyllium", "iron"], ["psyllium", "calcium"]];

export default function StackBuilder() {
  const [picked, setPicked] = useState(["magnesium", "vitamin-d", "omega-3", "iron", "calcium"]);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const items = EVIDENCE.filter((e) => picked.includes(e.id));

  // Start from each item's preferred slot, then move competing minerals apart.
  const slotOf = Object.fromEntries(items.map((e) => [e.id, e.slot]));
  SPREAD.forEach(([a, b]) => {
    if (slotOf[a] && slotOf[b] && slotOf[a] === slotOf[b]) slotOf[b] = slotOf[a] === "morning" ? "evening" : "morning";
  });
  const names = items.map((e) => IX_NAME[e.id]).filter(Boolean);
  const warnings = INTERACTIONS.filter((i) => i.level !== "ok" && names.includes(i.a) && names.includes(i.b));

  return (
    <>
      <div className="tool-panel">
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend>What do you take?</legend>
          <div className="check-grid">
            {EVIDENCE.map((e) => (
              <label key={e.id}><input type="checkbox" checked={picked.includes(e.id)} onChange={() => toggle(e.id)} /> {e.name}</label>
            ))}
          </div>
        </fieldset>
      </div>
      <section aria-live="polite">
        <h2 style={{ marginTop: 0 }}>Your daily schedule</h2>
        {SLOTS.map(([slot, label]) => {
          const inSlot = items.filter((e) => slotOf[e.id] === slot);
          if (!inSlot.length) return null;
          return (
            <div className="result" key={slot}>
              <h3>{label}</h3>
              <p>{inSlot.map((e, i) => (
                <span key={e.id}>{i > 0 && ", "}{e.link ? <Link href={e.link}>{e.name}</Link> : e.name}</span>
              ))}</p>
            </div>
          );
        })}
        {warnings.map((w) => (
          <div className={`result ${w.level}`} key={w.a + w.b}>
            <h3>{w.a} + {w.b}</h3>
            <p>{w.text}</p>
          </div>
        ))}
        <p className="small muted">General scheduling guidance only. If you take prescription medicines, check timing with your pharmacist; see also the <Link href="/tools/supplement-drug-interactions/">drug interaction lookup</Link>.</p>
      </section>
    </>
  );
}
