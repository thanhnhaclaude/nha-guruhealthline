"use client";
import Link from "next/link";
import { useState } from "react";

export default function DirectoryFilter({ items, noun = "products" }) {
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const shown = t ? items.filter((i) => `${i.label} ${i.sub}`.toLowerCase().includes(t)) : items;
  return (
    <>
      <div className="dir-header">
        <span className="dir-count">{shown.length} {noun}</span>
        <input
          className="dir-input"
          type="search"
          placeholder="Filter…"
          aria-label={`Filter ${noun}`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="apgrid">
        {shown.map((i) => (
          <Link key={i.href} href={i.href} className="mp">
            <span>
              <span className="mpn">{i.label}</span>
              <span className="mpc">{i.sub}</span>
            </span>
            <span className="mpa" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </>
  );
}
