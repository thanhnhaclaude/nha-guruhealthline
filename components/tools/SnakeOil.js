"use client";
import { useState } from "react";

// Red flags drawn from FDA health-fraud warning signs and common deceptive claims.
const FLAGS = [
  { re: /\b(cures?|cured|heals?)\b/i, w: 3, why: "Claims to cure or heal a disease. Supplements can't legally claim to cure disease." },
  { re: /\bmiracle|breakthrough|revolutionary|game.?changer\b/i, w: 2, why: "Hype words like \"miracle\" or \"breakthrough\" are classic health-fraud signs." },
  { re: /\b(secret|hidden|ancient)\b/i, w: 2, why: "\"Secret\" or \"ancient\" remedies imply hidden knowledge instead of evidence." },
  { re: /(doctors|big pharma|they) (hate|don'?t want|won'?t tell)/i, w: 3, why: "Conspiracy framing (\"doctors hate this\") is a common scam tactic." },
  { re: /\bfda.?approved\b/i, w: 3, why: "Dietary supplements aren't FDA-approved for safety or effectiveness before sale." },
  { re: /\bno side effects|completely safe|100% safe|risk.?free\b/i, w: 2, why: "Anything with real effects can have side effects." },
  { re: /\b(lose|drop|melt)\b.{0,30}\b\d+\s?(lbs?|pounds|kg)\b/i, w: 3, why: "Promises of specific weight loss are unrealistic for supplements." },
  { re: /without (diet|exercise|dieting)/i, w: 3, why: "\"Without diet or exercise\" claims are a frequent target of regulators." },
  { re: /\b(melt|burn)s? (belly )?fat\b/i, w: 2, why: "\"Melts fat\" claims aren't supported for supplements." },
  { re: /\b(reverse|eliminate|end)s?\b.{0,20}\b(diabetes|cancer|arthritis|alzheimer|dementia|tinnitus|neuropathy)/i, w: 3, why: "Claims to reverse serious diseases are illegal and unsupported." },
  { re: /\b(detox|cleanse|flush) (toxins|your body)\b/i, w: 1, why: "Vague \"detox\" claims rarely name a toxin or show evidence." },
  { re: /\bclinically proven\b/i, w: 1, why: "\"Clinically proven\" without a linked study is meaningless." },
  { re: /\blimited time|act now|only \d+ (left|bottles)|selling out\b/i, w: 2, why: "Pressure tactics push you to buy before checking facts." },
  { re: /\bproprietary (blend|formula)\b/i, w: 1, why: "Proprietary blends hide how much of each ingredient you get." },
  { re: /\b(all.?natural|100% natural)\b/i, w: 1, why: "\"Natural\" doesn't mean safe or effective." },
  { re: /\b(guaranteed|works for everyone|instant results?)\b/i, w: 2, why: "Guaranteed or instant results aren't realistic." },
  { re: /\breplace(s)? (your )?(medication|medicine|insulin|prescription)/i, w: 3, why: "Suggesting you stop or replace medicine is dangerous." },
];

const SAMPLE = "This ancient secret formula melts belly fat and helps you lose 30 pounds without diet or exercise! Doctors hate it. 100% natural with no side effects. Clinically proven. Only 3 bottles left!";

export default function SnakeOil() {
  const [text, setText] = useState(SAMPLE);
  const found = FLAGS.filter((f) => f.re.test(text));
  const score = Math.min(100, found.reduce((s, f) => s + f.w, 0) * 7);
  const level = score >= 50 ? "avoid" : score >= 20 ? "caution" : "ok";

  return (
    <>
      <div className="tool-panel">
        <div className="field">
          <label htmlFor="copy">Marketing text</label>
          <textarea id="copy" rows={6} value={text} onChange={(e) => setText(e.target.value)} style={{ font: "inherit", padding: 12, border: "1px solid var(--border)", borderRadius: 8 }} />
          <span className="hint">Paste copy from a product page, ad or email. Example text is loaded.</span>
        </div>
      </div>
      <section aria-live="polite">
        <div className={`result ${level}`}>
          <h3>Snake oil score: {score}/100</h3>
          <p>
            {level === "avoid" && "Many red flags. Be very skeptical and look for independent evidence before buying."}
            {level === "caution" && "Some red flags. Check the claims against independent sources."}
            {level === "ok" && "Few red flags in this text. That doesn't prove the product works; check the evidence."}
          </p>
        </div>
        {found.map((f) => (
          <div className="result" key={f.why}>
            <p>⚠ {f.why}</p>
          </div>
        ))}
      </section>
    </>
  );
}
