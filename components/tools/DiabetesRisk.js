"use client";
import { useState } from "react";

// Scoring adapted from the American Diabetes Association's Type 2 Diabetes Risk Test.
// The ADA test uses a height/weight chart; we use the equivalent BMI bands.
export default function DiabetesRisk() {
  const [a, setA] = useState({ age: "45", sex: "f", gdm: "n", family: "n", bp: "n", active: "y", height: "165", weight: "75" });
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const age = parseFloat(a.age), h = parseFloat(a.height) / 100, w = parseFloat(a.weight);
  const bmi = h > 0 && w > 0 ? w / (h * h) : null;

  let score = 0;
  if (age >= 60) score += 3; else if (age >= 50) score += 2; else if (age >= 40) score += 1;
  if (a.sex === "m") score += 1;
  if (a.sex === "f" && a.gdm === "y") score += 1;
  if (a.family === "y") score += 1;
  if (a.bp === "y") score += 1;
  if (a.active === "n") score += 1;
  if (bmi >= 40) score += 3; else if (bmi >= 30) score += 2; else if (bmi >= 25) score += 1;
  const high = score >= 5;

  const yn = (k, label) => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      <select id={k} value={a[k]} onChange={(e) => set(k, e.target.value)}><option value="n">No</option><option value="y">Yes</option></select>
    </div>
  );

  return (
    <>
      <div className="tool-panel">
        <div className="field-row">
          <div className="field"><label htmlFor="age">Age</label><input id="age" type="number" min="18" max="110" value={a.age} onChange={(e) => set("age", e.target.value)} /></div>
          <div className="field"><label htmlFor="sex">Sex</label><select id="sex" value={a.sex} onChange={(e) => set("sex", e.target.value)}><option value="f">Female</option><option value="m">Male</option></select></div>
          {a.sex === "f" && yn("gdm", "Ever had gestational diabetes?")}
          {yn("family", "Parent or sibling with diabetes?")}
          {yn("bp", "Ever told you have high blood pressure?")}
          <div className="field"><label htmlFor="active">Physically active?</label><select id="active" value={a.active} onChange={(e) => set("active", e.target.value)}><option value="y">Yes</option><option value="n">No</option></select></div>
          <div className="field"><label htmlFor="height">Height (cm)</label><input id="height" type="number" min="100" max="250" value={a.height} onChange={(e) => set("height", e.target.value)} /></div>
          <div className="field"><label htmlFor="weight">Weight (kg)</label><input id="weight" type="number" min="30" max="350" value={a.weight} onChange={(e) => set("weight", e.target.value)} /></div>
        </div>
      </div>
      <section aria-live="polite">
        <div className={`result ${high ? "avoid" : score >= 3 ? "caution" : "ok"}`}>
          <h3>Score: {score} {high ? "· Higher risk" : "· Lower risk"}</h3>
          <p>
            {high
              ? "A score of 5 or more means you may be at increased risk of type 2 diabetes. Ask your doctor about an HbA1c or fasting glucose test."
              : "Your score suggests lower risk. Risk rises with age and weight, so recheck every few years."}
            {bmi && ` Your BMI is ${bmi.toFixed(1)}.`}
          </p>
        </div>
        <p className="small muted">
          This screening tool doesn&apos;t diagnose diabetes. BMI bands may not suit everyone; some groups, including people of Asian descent,
          develop diabetes at lower BMIs. Supplements are not a substitute for diagnosis or treatment.
        </p>
      </section>
    </>
  );
}
