import { SITE_NAME } from "@/lib/site";

// Two-tone wordmark: first half green, second half gold (e.g. Nutri|Verdict).
export default function Logo() {
  const m = SITE_NAME.match(/^([A-Z][a-z]+)(.*)$/);
  const [a, b] = m ? [m[1], m[2]] : [SITE_NAME, ""];
  return (
    <span className="wordmark">
      {a}
      <span>{b}</span>
    </span>
  );
}
