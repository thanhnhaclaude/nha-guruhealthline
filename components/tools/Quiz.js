"use client";
import Link from "next/link";
import { useState } from "react";

const QUESTIONS = [
  {
    id: "goal",
    q: "What's your main goal right now?",
    options: [
      ["sleep", "Sleep better"],
      ["stress", "Handle stress"],
      ["energy", "More energy, less fatigue"],
      ["fitness", "Build strength and muscle"],
      ["heart", "Heart health"],
      ["bone", "Bone and joint health"],
      ["immune", "Fewer colds"],
      ["brain", "Focus and memory"],
    ],
  },
  { id: "diet", q: "How do you eat?", options: [["omni", "I eat meat and fish"], ["veg", "Vegetarian"], ["vegan", "Vegan"]] },
  { id: "fish", q: "How often do you eat oily fish (salmon, sardines, mackerel)?", options: [["often", "Twice a week or more"], ["rarely", "Rarely or never"]] },
  { id: "sun", q: "How much direct sun do you get most days?", options: [["lots", "30+ minutes, most of the year"], ["little", "Little, or I live far from the equator"]] },
  {
    id: "life",
    q: "Which describes you?",
    options: [["adult", "Adult under 50"], ["50", "50 or older"], ["preg", "Pregnant or trying to conceive"], ["meds", "I take prescription medication"]],
  },
];

// Each rule returns a recommendation; evidence labels mirror our A–D grades.
function recommend(a) {
  const recs = [];
  const add = (name, why, href, grade) => !recs.some((r) => r.name === name) && recs.push({ name, why, href, grade });

  if (a.life === "preg") {
    add("Folic acid (in a prenatal)", "400 mcg daily is recommended before and during early pregnancy to lower the risk of neural tube defects.", null, "A");
  }
  if (a.diet === "vegan") add("Vitamin B12", "B12 comes almost only from animal foods. Vegans need a supplement or fortified foods.", null, "A");
  if (a.diet === "veg" || a.life === "50") add("Vitamin B12", a.diet === "veg" ? "Vegetarians often get too little B12." : "Absorption of B12 from food falls with age; the NIH advises people over 50 to get most B12 from supplements or fortified foods.", null, "A");
  if (a.sun === "little" || a.life === "50") add("Vitamin D3", "Little sun exposure is the most common reason for low vitamin D. 600–2,000 IU a day covers most adults.", "/ingredients/vitamin-d3", "A");
  if (a.fish === "rarely" && (a.goal === "heart" || a.goal === "brain" || a.diet !== "omni"))
    add(a.diet === "omni" ? "Omega-3 (fish oil)" : "Omega-3 (algal oil)", "You get little EPA and DHA from your diet. Aim for 250–500 mg a day.", "/ingredients/omega-3", "B");

  const goal = {
    sleep: () => add("Magnesium glycinate", "Fills a common gap and may modestly help sleep, especially in older adults.", "/ingredients/magnesium", "C"),
    stress: () =>
      a.life === "preg"
        ? add("Magnesium", "A gentle option; ashwagandha isn't recommended during pregnancy.", "/ingredients/magnesium", "C")
        : add("Ashwagandha", "Small trials show lower stress scores after 6–8 weeks at 300–600 mg/day.", "/ingredients/ashwagandha", "B"),
    energy: () => add("Ask for a blood test first", "Fatigue is often due to low iron, B12 or vitamin D, or to sleep or thyroid problems. Test before you buy.", null, null),
    fitness: () => add("Creatine monohydrate", "The best-studied supplement for strength and lean mass: 3–5 g a day.", "/ingredients/creatine", "A"),
    heart: () => add("Omega-3 (EPA + DHA)", "Clearly lowers high triglycerides; broader heart benefits are mixed.", "/ingredients/omega-3", "B"),
    bone: () => add("Vitamin D3 + enough calcium from food", "Vitamin D helps you absorb calcium. Get calcium from food first; supplement only the gap.", "/ingredients/vitamin-d3", "B"),
    immune: () => add("Zinc lozenges (at the first sign of a cold)", "May shorten colds when started within 24 hours. Daily zinc for prevention isn't clearly proven.", "/ingredients/zinc", "B"),
    brain: () => add("Get the basics right first", "Sleep, B12 and omega-3 status matter more than most nootropics. Creatine shows early promise for memory.", "/ingredients/creatine", "C"),
  };
  goal[a.goal]?.();
  if (a.life === "preg") recs.push({ name: "Talk to your midwife or doctor", why: "Many herbs, including ashwagandha, aren't safe during pregnancy. Choose a prenatal with your clinician.", warn: true });
  if (a.life === "meds") recs.push({ name: "Check interactions before buying", why: "Several supplements change how medications work.", href: "/tools/interaction-checker", warn: true });
  return recs;
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = step >= QUESTIONS.length;
  const q = QUESTIONS[step];

  const choose = (val) => {
    setAnswers((a) => ({ ...a, [q.id]: val }));
    setStep((s) => s + 1);
  };

  if (done) {
    const recs = recommend(answers);
    return (
      <div className="tool-panel" aria-live="polite">
        <h2 style={{ marginTop: 0 }}>Your shortlist</h2>
        <p className="muted">Based on your answers, these are worth researching first, strongest evidence first.</p>
        {recs.map((r) => (
          <div key={r.name} className={`result ${r.warn ? "caution" : "ok"}`}>
            <h3>
              {r.name}
              {r.grade && <span className="sev">Evidence {r.grade}</span>}
            </h3>
            <p>
              {r.why} {r.href && <Link href={r.href}>Read more</Link>}
            </p>
          </div>
        ))}
        <p className="small muted">
          This quiz gives general education, not medical advice. Check with a doctor or pharmacist before starting a
          supplement.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => { setStep(0); setAnswers({}); }}>
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="tool-panel">
      <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={step}>
        <i style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="muted small" style={{ margin: "0 0 4px" }}>Question {step + 1} of {QUESTIONS.length}</p>
      <h2 style={{ marginTop: 0 }}>{q.q}</h2>
      <div className="option-list">
        {q.options.map(([val, label]) => (
          <button key={val} type="button" aria-pressed={answers[q.id] === val} onClick={() => choose(val)}>
            {label}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button type="button" className="btn btn-outline" style={{ marginTop: 14 }} onClick={() => setStep((s) => s - 1)}>
          Back
        </button>
      )}
    </div>
  );
}
