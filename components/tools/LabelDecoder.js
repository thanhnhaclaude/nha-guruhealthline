"use client";
import Link from "next/link";
import { useState } from "react";
import { GRADE_LABEL, bestGrade, findEvidence } from "@/lib/evidence";

// Adult upper limits for flagging (NIH ODS). Units must match the label line.
const LIMITS = [
  { re: /vitamin d|cholecalciferol/i, iu: 4000, mcg: 100, note: "4,000 IU (100 mcg) from all sources" },
  { re: /\bzinc\b/i, mg: 40, note: "40 mg from all sources" },
  { re: /magnesium/i, mg: 350, note: "350 mg from supplements" },
  { re: /\biron\b|ferrous/i, mg: 45, note: "45 mg" },
  { re: /vitamin c|ascorbic/i, mg: 2000, note: "2,000 mg" },
  { re: /vitamin b6|pyridoxine/i, mg: 100, note: "100 mg" },
  { re: /vitamin a\b|retinyl|retinol/i, mcg: 3000, iu: 10000, note: "3,000 mcg RAE (preformed)" },
  { re: /selenium/i, mcg: 400, note: "400 mcg" },
  { re: /niacin|nicotinic/i, mg: 35, note: "35 mg (supplemental)" },
  { re: /folic acid/i, mcg: 1000, note: "1,000 mcg" },
  { re: /calcium/i, mg: 2500, note: "2,000–2,500 mg depending on age" },
  { re: /iodine/i, mcg: 1100, note: "1,100 mcg" },
];

const SAMPLE = `Vitamin D3 (as cholecalciferol) 125 mcg
Zinc (as zinc picolinate) 50 mg
Magnesium (as magnesium glycinate) 200 mg
Proprietary Energy Blend 500 mg
Garcinia cambogia extract 300 mg
Ashwagandha root extract 300 mg`;

function parse(line) {
  const m = line.match(/([\d.,]+)\s*(mg|mcg|µg|iu|g)\b/i);
  return m ? { amount: parseFloat(m[1].replace(/,/g, "")), unit: m[2].toLowerCase().replace("µg", "mcg") } : null;
}

export default function LabelDecoder() {
  const [text, setText] = useState(SAMPLE);
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <>
      <div className="tool-panel">
        <div className="field">
          <label htmlFor="label">Supplement Facts (one ingredient per line)</label>
          <textarea id="label" rows={8} value={text} onChange={(e) => setText(e.target.value)} style={{ font: "inherit", padding: 12, border: "1px solid var(--border)", borderRadius: 8 }} />
          <span className="hint">Example label loaded. Include the amount and unit, e.g. &quot;Zinc 25 mg&quot;.</span>
        </div>
      </div>
      <section aria-live="polite">
        {lines.map((line) => {
          const ev = findEvidence(line);
          const dose = parse(line);
          const limit = LIMITS.find((l) => l.re.test(line));
          const over = limit && dose && limit[dose.unit] && dose.amount > limit[dose.unit];
          const blend = /proprietary|blend|complex|matrix/i.test(line);
          const g = ev ? bestGrade(ev) : null;
          const level = over || blend || g === "D" ? "avoid" : g === "C" || !ev ? "caution" : "ok";
          return (
            <div className={`result ${level}`} key={line}>
              <h3>{line}</h3>
              <p>
                {ev ? (
                  <>Best-supported use: {ev.uses.find((u) => u[1] === g)?.[0]} (<strong>grade {g}</strong>, {GRADE_LABEL[g].toLowerCase()}).{" "}
                    {ev.link && <Link href={ev.link}>Details</Link>}</>
                ) : blend ? null : "Not in our evidence database yet."}
                {over && <><br />⚠ Above the adult upper limit of {limit.note}.</>}
                {blend && <><br />⚠ Proprietary blend: individual ingredient doses are hidden, so you can&apos;t compare them with research doses.</>}
                {ev?.warning && <><br />⚠ {ev.warning}</>}
              </p>
            </div>
          );
        })}
        <p className="small muted">Upper limits apply to adults and often include food. This tool reads text only; always check the actual label and ask a pharmacist if unsure.</p>
      </section>
    </>
  );
}
