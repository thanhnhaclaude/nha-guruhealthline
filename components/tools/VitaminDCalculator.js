"use client";
import { useState } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SKIN = [
  ["1", "Type I–II: very fair, burns easily", 1],
  ["3", "Type III–IV: light brown to olive", 2],
  ["5", "Type V–VI: brown to very dark", 4],
];

// Sun elevation at solar noon on the 15th of the month.
function noonElevation(lat, month) {
  const day = [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349][month];
  const decl = 23.44 * Math.sin(((2 * Math.PI) / 365) * (284 + day));
  return 90 - Math.abs(lat - decl);
}

export default function VitaminDCalculator() {
  const [lat, setLat] = useState("40");
  const [hemi, setHemi] = useState("N");
  const [month, setMonth] = useState(new Date().getMonth());
  const [skin, setSkin] = useState("3");
  const L = parseFloat(lat);
  const valid = L >= 0 && L <= 90;
  const signedLat = hemi === "N" ? L : -L;
  const elev = valid ? noonElevation(signedLat, month) : 0;
  const factor = SKIN.find((s) => s[0] === skin)[2];

  // Below ~35° noon sun elevation, UVB is too weak for meaningful skin synthesis.
  // Calibrated to Webb et al. 1988: no synthesis in Boston (42°N) Nov–Feb, Edmonton (52°N) Oct–Mar.
  const level = elev < 35 ? "none" : elev < 50 ? "limited" : "good";
  const winterMonths = valid ? MONTHS.filter((_, m) => noonElevation(signedLat, m) < 35) : [];

  return (
    <>
      <div className="tool-panel">
        <div className="field-row">
          <div className="field">
            <label htmlFor="lat">Latitude (degrees)</label>
            <input id="lat" type="number" min="0" max="90" step="0.5" value={lat} onChange={(e) => setLat(e.target.value)} />
            <span className="hint">e.g. New York 41, London 51, Ho Chi Minh City 11, Sydney 34</span>
          </div>
          <div className="field">
            <label htmlFor="hemi">Hemisphere</label>
            <select id="hemi" value={hemi} onChange={(e) => setHemi(e.target.value)}>
              <option value="N">Northern</option>
              <option value="S">Southern</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="month">Month</label>
            <select id="month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="skin">Skin type</label>
            <select id="skin" value={skin} onChange={(e) => setSkin(e.target.value)}>
              {SKIN.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        {!valid && <p className="hint" role="alert">Enter a latitude between 0 and 90.</p>}
      </div>

      {valid && (
        <section aria-live="polite">
          <div className={`result ${level === "good" ? "ok" : level === "limited" ? "caution" : "avoid"}`}>
            <h3>
              {level === "good" && "Your skin can make vitamin D this month"}
              {level === "limited" && "Limited vitamin D from sunlight this month"}
              {level === "none" && "Little to no vitamin D from sunlight this month"}
            </h3>
            <p>
              Midday sun reaches about {Math.round(elev)}° above the horizon.{" "}
              {level === "good" && `Short midday exposure of arms and legs can produce vitamin D. Darker skin needs roughly ${factor}× longer than very fair skin for the same amount.`}
              {level === "limited" && `Synthesis is possible around midday but slower. Darker skin needs roughly ${factor}× longer.`}
              {level === "none" && "UVB is too weak at this sun angle for meaningful vitamin D production, whatever your skin type. Food and supplements are the practical sources."}
            </p>
          </div>
          <div className="result">
            <h3>Your &quot;vitamin D winter&quot;</h3>
            <p>{winterMonths.length ? `At this latitude, sunlight makes little vitamin D in: ${winterMonths.join(", ")}.` : "At this latitude, midday sun is strong enough all year."}</p>
          </div>
          <p className="small muted">
            This is a simplified model based on sun angle. Cloud, pollution, altitude, sunscreen, age and time outdoors also matter. Avoid sunburn; it raises skin cancer risk.
            Most adults who supplement take 600–2,000 IU a day.
          </p>
        </section>
      )}
    </>
  );
}
