"use client";
import { useState } from "react";

const FORMS = {
  tablet: { name: "Tablets or capsules", tip: "Most stable form. Keep the lid closed and the desiccant packet in." },
  gummy: { name: "Gummies", tip: "Sensitive to heat and humidity; they can clump or lose potency faster. Keep cool." },
  softgel: { name: "Fish oil or softgels", tip: "Oils can go rancid. Sniff test: a strong fishy or paint-like smell means oxidized oil." },
  probiotic: { name: "Probiotics", tip: "Live organisms die off over time. Follow the label; some need refrigeration. Buy products that guarantee CFU at expiry." },
  liquid: { name: "Liquids or drops", tip: "Refrigerate after opening if the label says so; discard if the smell or color changes." },
  powder: { name: "Powders", tip: "Moisture is the enemy. Use a dry scoop and seal tightly." },
};
const STORAGE = {
  cool: ["Cool, dry cupboard", "ok", "Good storage."],
  fridge: ["Refrigerator", "ok", "Good for probiotics and oils if the label allows; keep the lid tight to avoid condensation."],
  bathroom: ["Bathroom", "caution", "Heat and steam speed up breakdown. Move them to a cool, dry cupboard."],
  kitchen: ["Kitchen near the stove", "caution", "Heat from cooking speeds up breakdown. Store away from the stove and sink."],
  car: ["Car or bag in the sun", "avoid", "High heat can quickly degrade vitamins, oils and probiotics."],
};

export default function ExpiryCalc() {
  const [date, setDate] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() + 5); return d.toISOString().slice(0, 10); });
  const [form, setForm] = useState("tablet");
  const [store, setStore] = useState("bathroom");
  const days = Math.round((new Date(date) - new Date(new Date().toDateString())) / 86400000);
  const valid = !Number.isNaN(days);
  const st = STORAGE[store];

  return (
    <>
      <div className="tool-panel">
        <div className="field-row">
          <div className="field"><label htmlFor="exp">Expiry or best-by date</label><input id="exp" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="field"><label htmlFor="form">Form</label>
            <select id="form" value={form} onChange={(e) => setForm(e.target.value)}>{Object.entries(FORMS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
          <div className="field"><label htmlFor="store">Where you keep it</label>
            <select id="store" value={store} onChange={(e) => setStore(e.target.value)}>{Object.entries(STORAGE).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></div>
        </div>
      </div>
      {valid && (
        <section aria-live="polite">
          <div className={`result ${days < 0 ? "avoid" : days < 60 ? "caution" : "ok"}`}>
            <h3>{days < 0 ? `Expired ${-days} days ago` : `${days} days until the date on the label`}</h3>
            <p>
              {days < 0
                ? "Potency may have dropped below what the label states. Expired supplements are rarely dangerous, but they may not work as intended; replace them, especially probiotics and oils."
                : days < 60 ? "Plan to use it up soon, or buy a smaller bottle next time." : "Plenty of time if stored well."}
            </p>
          </div>
          <div className={`result ${st[1]}`}><h3>Storage: {st[0]}</h3><p>{st[2]}</p></div>
          <div className="result"><h3>{FORMS[form].name}</h3><p>{FORMS[form].tip}</p></div>
          <p className="small muted">Manufacturers set the date to guarantee label potency under normal storage. We don&apos;t estimate exact remaining potency because it depends on the product.</p>
        </section>
      )}
    </>
  );
}
