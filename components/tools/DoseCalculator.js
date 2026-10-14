"use client";
import Link from "next/link";
import { useState } from "react";
import { NUTRIENTS } from "@/lib/tooldata";

const fmt = (n) => (n == null ? "–" : Number(n).toLocaleString("en-US"));

export default function DoseCalculator() {
  const [sex, setSex] = useState("f");
  const [age, setAge] = useState("31-50");
  const [pregnant, setPregnant] = useState(false);

  const group = sex === "f" && pregnant ? "p" : sex;
  const band = age === "19-30" || age === "31-50" ? "19-50" : age;
  const canBePregnant = sex === "f" && (age === "19-30" || age === "31-50");

  return (
    <>
      <div className="tool-panel">
        <div className="field-row">
          <div className="field">
            <label htmlFor="sex">Sex</label>
            <select id="sex" value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="f">Female</option>
              <option value="m">Male</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="age">Age</label>
            <select id="age" value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="19-30">19–30</option>
              <option value="31-50">31–50</option>
              <option value="51-70">51–70</option>
              <option value="71+">71+</option>
            </select>
          </div>
          {canBePregnant && (
            <div className="field">
              <label htmlFor="preg">Pregnant?</label>
              <select id="preg" value={pregnant ? "y" : "n"} onChange={(e) => setPregnant(e.target.value === "y")}>
                <option value="n">No</option>
                <option value="y">Yes</option>
              </select>
            </div>
          )}
        </div>
        <p className="hint" style={{ margin: 0 }}>Values are for healthy adults. Children and people with medical conditions have different needs.</p>
      </div>

      <div className="table-wrap prose" aria-live="polite">
        <table>
          <thead>
            <tr><th>Nutrient</th><th>Daily target</th><th>Upper limit</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {NUTRIENTS.map((n) => {
              const g = canBePregnant ? group : sex;
              let target = n.rda[g][band];
              if (n.rda1930 && age === "19-30") target = n.rda1930[g];
              const ul = n.ulByAge ? n.ulByAge[band] : n.ul;
              return (
                <tr key={n.id}>
                  <td>{n.link ? <Link href={n.link}>{n.name}</Link> : n.name}</td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>
                    {fmt(target)} {n.unit}{n.ai ? " (AI)" : ""}
                  </td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>{ul ? `${fmt(ul)} ${n.unit}` : "Not set"}</td>
                  <td className="small muted">{n.ulNote}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        Daily target = Recommended Dietary Allowance (RDA), or Adequate Intake (AI) where no RDA exists, and includes food.
        Source: NIH Office of Dietary Supplements.
      </p>
    </>
  );
}
