"use client";
import Link from "next/link";
import { useState } from "react";
import { EVIDENCE, formatOnset } from "@/lib/evidence";

// Log scale from 30 minutes to 1 year so minutes and months fit on one axis.
const MIN = Math.log(0.02);
const MAX = Math.log(365);
const pos = (d) => ((Math.log(Math.max(d, 0.02)) - MIN) / (MAX - MIN)) * 100;
const TICKS = [["1 h", 0.042], ["1 day", 1], ["1 wk", 7], ["1 mo", 30], ["3 mo", 90], ["1 yr", 365]];

export default function Timeline() {
  const [sort, setSort] = useState("fast");
  const rows = [...EVIDENCE].sort((a, b) => (sort === "fast" ? a.onset[0] - b.onset[0] : a.name.localeCompare(b.name)));
  return (
    <>
      <div className="tool-panel" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label htmlFor="sort" style={{ fontWeight: 600 }}>Sort</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} style={{ font: "inherit", padding: 8, borderRadius: 8, border: "1px solid var(--border)", minHeight: 44 }}>
          <option value="fast">Fastest first</option>
          <option value="az">A to Z</option>
        </select>
        <span className="hint">Bars show the typical range in trials, on a log scale.</span>
      </div>
      <div className="table-wrap" style={{ padding: 16, background: "#fff" }}>
        <div style={{ minWidth: 640 }}>
          <div style={{ display: "grid", gridTemplateColumns: "190px 1fr 130px", gap: 12, fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
            <span />
            <span style={{ position: "relative", height: 16 }}>
              {TICKS.map(([l, d]) => <span key={l} style={{ position: "absolute", left: `${pos(d)}%`, transform: "translateX(-50%)" }}>{l}</span>)}
            </span>
            <span />
          </div>
          {rows.map((e) => (
            <div key={e.id} style={{ display: "grid", gridTemplateColumns: "190px 1fr 130px", gap: 12, alignItems: "center", padding: "6px 0", borderTop: "1px solid var(--border)", fontSize: 14 }}>
              <span>{e.link ? <Link href={e.link}>{e.name}</Link> : e.name}</span>
              <span style={{ position: "relative", height: 12, background: "var(--surface-alt)", borderRadius: 6 }}>
                <span style={{ position: "absolute", left: `${pos(e.onset[0])}%`, width: `${Math.max(2, pos(e.onset[1]) - pos(e.onset[0]))}%`, top: 0, bottom: 0, background: "var(--primary)", borderRadius: 6 }} />
              </span>
              <span className="small muted" style={{ fontVariantNumeric: "tabular-nums" }}>{formatOnset(e.onset)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="small muted">Onset depends on dose, your starting levels and what&apos;s being measured. Many supplements only help people who are deficient.</p>
    </>
  );
}
