"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EVIDENCE, GRADE_LABEL, bestGrade, formatOnset } from "@/lib/evidence";

export default function EvidenceDb() {
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("");
  const [cat, setCat] = useState("");
  const cats = [...new Set(EVIDENCE.map((e) => e.category))].sort();
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return EVIDENCE.filter((e) =>
      (!t || [e.name, ...e.aliases, ...e.uses.map((u) => u[0])].join(" ").toLowerCase().includes(t)) &&
      (!cat || e.category === cat) &&
      (!grade || e.uses.some((u) => u[1] === grade)),
    ).sort((a, b) => bestGrade(a).localeCompare(bestGrade(b)) || a.name.localeCompare(b.name));
  }, [q, grade, cat]);

  return (
    <>
      <div className="tool-panel">
        <div className="field-row">
          <div className="field">
            <label htmlFor="q">Search</label>
            <input id="q" type="search" placeholder="e.g. sleep, magnesium, joint" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="g">Evidence grade</label>
            <select id="g" value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Any grade</option>
              {Object.entries(GRADE_LABEL).map(([k, v]) => <option key={k} value={k}>{k}: {v}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c">Category</label>
            <select id="c" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">All categories</option>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
      <p className="muted small" aria-live="polite">{rows.length} of {EVIDENCE.length} supplements</p>
      <div className="table-wrap prose">
        <table>
          <thead><tr><th>Supplement</th><th>Use and evidence grade</th><th>Typical onset</th></tr></thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>
                  {e.link ? <Link href={e.link}><strong>{e.name}</strong></Link> : <strong>{e.name}</strong>}
                  <div className="small muted">{e.category}</div>
                </td>
                <td>
                  {e.uses.map(([u, g]) => (
                    <div key={u} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span className={`evidence-grade grade-${g}`} title={GRADE_LABEL[g]}>{g}</span>
                      <span>{u}</span>
                    </div>
                  ))}
                  {e.warning && <div className="small" style={{ color: "var(--danger)" }}>⚠ {e.warning}</div>}
                </td>
                <td className="small">{formatOnset(e.onset)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
