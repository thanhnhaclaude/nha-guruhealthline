import Link from "next/link";
import DirectoryFilter from "@/components/DirectoryFilter";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/components/ArticleParts";
import { buildStoreUrl, storeLabel } from "@/lib/affiliate";
import { getAllIngredients, getAllPosts, getAllReviews, getTopicItems } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { INTERACTIONS } from "@/lib/tooldata";
import { GRID_LIBRARIES, TOPICS } from "@/lib/topics";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: { absolute: `${SITE_NAME}: Evidence-Based Supplement Reviews, Guides & Tools` },
  description:
    "Research-backed supplement reviews, ingredient guides, X vs Y comparisons and free tools. Find what works for your goal, at the right dose, and what to avoid.",
  alternates: { canonical: "/" },
};

const HOME_FAQ = [
  {
    q: `How does ${SITE_NAME} choose what to recommend?`,
    a: "We start from official sources and peer-reviewed research, compare product doses with the doses used in studies, and check for third-party testing. Retailers can't pay for placement.",
  },
  {
    q: "Are supplements safe to take with medication?",
    a: "Some aren't. Vitamin K affects warfarin, magnesium and zinc bind some antibiotics, and St. John's wort interacts with many drugs. Use our interaction checker as a starting point and confirm with your pharmacist.",
  },
  {
    q: "Do I need supplements if I eat a healthy diet?",
    a: "Often not. Common exceptions are vitamin D with little sun exposure, B12 for vegans and adults over 50, folic acid before pregnancy, and iron when a blood test shows you're low.",
  },
  {
    q: "What do the A–D evidence grades mean?",
    a: "A means strong, consistent human evidence; B moderate; C limited or mixed; D good evidence of no benefit. Every ingredient guide grades each claimed use.",
  },
  {
    q: "How do you make money?",
    a: "Through affiliate links: when you buy through a link we may earn a commission at no cost to you. This never changes our verdicts.",
  },
];

const TRUST = ["📚 Every claim sourced", "🔬 Evidence graded A–D", "🚫 No paid rankings", "🔄 Updated monthly"];

export default function Home() {
  const posts = getAllPosts();
  const ingredients = getAllIngredients();
  const reviews = getAllReviews();
  const compare = posts.filter((p) => p.category === "compare");
  const dosing = posts.filter((p) => p.category === "dosing");
  const warnings = INTERACTIONS.filter((i) => i.level === "avoid");
  const now = new Date();
  const month = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const fullDate = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  // Same grid order as the original: 13 goals, the 4 library links, then the remaining goals.
  const gridTopics = TOPICS.filter((t) => t.grid);
  const topicCard = (t) => {
    const it = getTopicItems(t.slug);
    const n = it.guides.length + it.ingredients.length + it.reviews.length;
    return { href: `/${t.slug}`, emoji: t.emoji, name: t.name, sub: n ? `${n} guide${n === 1 ? "" : "s"}` : "Coming soon" };
  };
  const libCounts = { "/ingredients": `${ingredients.length} guides`, "/compare": `${compare.length} comparisons`, "/tools": `${TOOLS.length} tools`, "/all-supplements": "A to Z" };
  const gridItems = [
    ...gridTopics.slice(0, 13).map(topicCard),
    ...GRID_LIBRARIES.map((l) => ({ ...l, sub: libCounts[l.href] })),
    ...gridTopics.slice(13).map(topicCard),
  ];
  const bestGrade = (i) => (i.evidence?.map((e) => e.grade).sort()[0]) || "C";

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
          },
          faqSchema(HOME_FAQ),
        ]}
      />

      {/* Hero */}
      <section className="hero" aria-label="Introduction">
        <div className="hi">
          <div className="hbadge">★ Independent Research · Updated {month}</div>
          <h1>
            The <em>Supplement Guide</em>
            <br />
            That Shows Its Evidence
          </h1>
          <p className="hero-tagline">
            Evidence-graded ingredient guides, honest comparisons and free tools across {TOPICS.length} health goals, from
            sleep and stress to heart, gut and bone health.
          </p>
          <div className="hstats" role="list" aria-label="Site statistics">
            {[
              [ingredients.length, "Ingredient guides"],
              [TOPICS.length, "Health goals"],
              [posts.length, "Dosing & comparison guides"],
              [TOOLS.length, "Free tools"],
            ].map(([n, l]) => (
              <div className="hstat" role="listitem" key={l}>
                <span className="hstat-n">{n}</span>
                <span className="hstat-l">{l}</span>
              </div>
            ))}
          </div>
          <form className="hsearch" role="search" action="/search" method="get">
            <label htmlFor="si" className="visually-hidden">Search the site</label>
            <input id="si" name="q" type="search" placeholder="Search supplements, ingredients, goals…" autoComplete="off" />
            <button type="submit">Search</button>
          </form>
          <Link href="/quiz" className="hquiz">🌟 Not sure which supplement? Take the 60-second quiz →</Link>
        </div>
      </section>

      {/* Trust bar */}
      <div className="tbar" aria-label="Our standards">
        <div className="tbari">
          {TRUST.map((t) => <div className="ti" key={t}>{t}</div>)}
        </div>
      </div>

      {/* Browse by category */}
      <div className="page">
        <section className="sec" aria-labelledby="cat-title">
          <div className="sh2">
            <div className="slbl">Browse by Category</div>
            <h2 className="stit" id="cat-title">Find Supplements for Your Specific Goal</h2>
            <p className="ssub">{gridTopics.length} health goals, each with the ingredients, comparisons and reviews that matter for it.</p>
          </div>
          <nav className="cgrid" aria-label="Health goals">
            {gridItems.map((g) => (
              <Link key={g.href} href={g.href} className="cc">
                <span className="ci" aria-hidden="true">{g.emoji}</span>
                <span>
                  <span className="cn">{g.name}</span>
                  <span className="ck">{g.sub}</span>
                </span>
              </Link>
            ))}
          </nav>
        </section>
      </div>

      {/* Quiz promo */}
      <div className="page">
        <div className="quizpromo" role="complementary" aria-label="Quiz">
          <div>
            <div className="qp-eyebrow">🌟 Free personalised recommendation</div>
            <div className="qp-title">Not sure which supplement is right for you?</div>
            <div className="qp-sub">Answer 5 quick questions and get an evidence-ranked shortlist with doses.</div>
          </div>
          <Link href="/quiz" className="qp-btn">Take the Free Quiz →</Link>
        </div>
      </div>

      {/* Safety box */}
      <div className="page" style={{ paddingBottom: "2rem" }}>
        <div className="safety" role="complementary" aria-label="Supplement safety">
          <div className="safety-head">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.4rem" }} aria-hidden="true">⚠️</span>
              <div>
                <div className="safety-eyebrow">Safety first · No affiliate links</div>
                <div className="safety-title">Combinations to Avoid</div>
              </div>
            </div>
            <span className="safety-pill">{warnings.length} documented interactions</span>
          </div>
          <div className="safety-body">
            {warnings.slice(0, 4).map((w) => (
              <div className="safety-row" key={w.a + w.b}>
                <strong>{w.a} + {w.b}</strong>
                <span>{w.text}</span>
              </div>
            ))}
            <Link href="/supplement-safety-database" className="safety-link">View the full Supplement Safety Database →</Link>
            <Link href="/tools/supplement-interaction-checker" className="safety-link">Check your own stack in the Interaction Checker →</Link>
          </div>
        </div>
      </div>

      {/* Top picks (only once real reviews exist) */}
      {reviews.length > 0 && (
        <div className="page">
          <section className="sec" aria-labelledby="picks-title" style={{ paddingTop: 0 }}>
            <div className="sh2">
              <div className="slbl">Editor&apos;s Top Picks — {month}</div>
              <h2 className="stit" id="picks-title">Top-Rated Supplements</h2>
              <p className="ssub">Ranked on ingredient quality, dose versus research, transparency, safety and value.</p>
            </div>
            <div className="reviewed-by" role="note">
              <span aria-hidden="true">📝</span>
              <span>
                Reviewed by the <strong>{SITE_NAME} Editorial Team</strong> · Methodology: ingredient analysis, clinical
                evidence, third-party testing, value · Last updated: <strong>{fullDate}</strong>
              </span>
            </div>
            <div className="pgrid">
              {reviews.slice(0, 8).map((r, i) => (
                <article className="pc" key={r.slug}>
                  <div className="pct">
                    <div className="pb">#{i + 1} {r.productType}</div>
                    {r.example && <div className="pb pb-ex">Example</div>}
                  </div>
                  <div className="pcb">
                    <h3 className="pname">{r.name}</h3>
                    <div className="pcat">★ {Number(r.rating).toFixed(1)}/5</div>
                    <p className="pdesc">{r.verdict}</p>
                    {r.chips?.length > 0 && (
                      <div className="ptrust">{r.chips.map((c) => <span className="tc" key={c}>{c}</span>)}</div>
                    )}
                    <Link href={`/reviews/${r.slug}`} className="prev">Read Full Review</Link>
                    {r.cta && (
                      <a className="pcta" href={buildStoreUrl(r.cta)} target="_blank" rel="sponsored nofollow noopener">
                        {r.cta.label} on {storeLabel(r.cta)} →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Ingredient guides */}
      <div className="band band-alt" role="region" aria-labelledby="ing-title">
        <div className="page">
          <div className="sh2">
            <div className="slbl">Evidence-Based Ingredient Guides</div>
            <h2 className="stit" id="ing-title">Ingredient Guides with Graded Evidence</h2>
            <p className="ssub">What&apos;s actually in your supplements? Every guide grades each use from A to D.</p>
          </div>
          <div className="ing-grid-home">
            {ingredients.map((i) => {
              const g = bestGrade(i);
              return (
                <Link key={i.slug} href={`/ingredients/${i.slug}`} className="ing-card-home">
                  <span className={`ing-grade-dot grade-${g.toLowerCase()}`} aria-label={`Best evidence grade ${g}`}>{g}</span>
                  <span className="ing-name-home">{i.name}</span>
                  <span className="ing-cat-home">{i.group}</span>
                </Link>
              );
            })}
          </div>
          <Link href="/ingredients" className="view-all va-green">Browse all {ingredients.length} ingredient guides →</Link>
        </div>
      </div>

      {/* Comparisons */}
      <div className="band" role="region" aria-labelledby="compare-title">
        <div className="page">
          <div className="sh2">
            <div className="slbl">X vs Y — Supplement Comparisons</div>
            <h2 className="stit" id="compare-title">Evidence-Based Supplement Comparisons</h2>
            <p className="ssub">Supplement forms and alternatives, side by side.</p>
          </div>
          <div className="compare-grid">
            {compare.slice(0, 12).map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="comp-card">
                <span className="comp-vs-wrap">
                  <span className="comp-a-name">{p.vsA}</span>
                  <span className="comp-vs-dot">vs</span>
                  <span className="comp-b-name">{p.vsB}</span>
                  <span className="comp-verdict">✅ {p.vsVerdict}</span>
                </span>
                <span className="comp-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <Link href="/compare" className="view-all va-blue">See all {compare.length} comparisons →</Link>
        </div>
      </div>

      {/* Tools */}
      <div className="band band-dark" role="region" aria-labelledby="tools-title">
        <div className="page">
          <div className="sh2">
            <div className="slbl slbl-dark">Free Supplement Tools</div>
            <h2 className="stit" id="tools-title" style={{ color: "#fff" }}>{TOOLS.length} Free Tools to Make Smarter Decisions</h2>
            <p className="ssub" style={{ color: "rgba(255,255,255,.72)" }}>No sign-up required. Everything runs in your browser.</p>
          </div>
          <div className="tools-grid">
            {TOOLS.map((t) => (
              <Link key={t.slug} href={t.href} className="tool-card-d">
                <span className="tool-icon" aria-hidden="true">{t.emoji}</span>
                <span className="tool-name">{t.name}</span>
                <span className="tool-desc">{t.description}</span>
                <span className="tool-badge">● {t.badge}</span>
              </Link>
            ))}
          </div>
          <Link href="/tools" className="view-all va-white">Explore all free tools →</Link>
        </div>
      </div>

      {/* Dosing & safety */}
      <div className="band band-alt band-tight" role="region" aria-labelledby="dosing-title">
        <div className="page">
          <div className="sh2">
            <div className="slbl">Dosing &amp; Safety — Clear Answers</div>
            <h2 className="stit" id="dosing-title">{dosing.length} Dosing &amp; Safety Guides</h2>
            <p className="ssub">How much, when, and with what, answered with official sources. <Link href="/dosing-safety">See all →</Link></p>
          </div>
          <div className="dose-grid">
            {dosing.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="dose-link">
                <span aria-hidden="true">{p.emoji || "💊"}</span>
                <span>{p.title.match(/^[^?:]+\??/)[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="page">
        <section className="sec" aria-labelledby="dir-title">
          <div className="sh2">
            <div className="slbl">Complete Directory</div>
            <h2 className="stit" id="dir-title">Everything We Cover, A to Z</h2>
            <p className="ssub">Every review, ingredient and guide on the site. Updated {month}.</p>
          </div>
          <DirectoryFilter
            noun="pages"
            items={[
              ...reviews.map((r) => ({ href: `/reviews/${r.slug}`, label: r.name, sub: `Review · ${r.productType}` })),
              ...ingredients.map((i) => ({ href: `/ingredients/${i.slug}`, label: i.name, sub: `Ingredient · ${i.group}` })),
              ...posts.map((p) => ({ href: `/${p.slug}`, label: p.title.split(/[:?]/)[0], sub: p.category === "compare" ? "Comparison" : "Dosing & safety" })),
            ].sort((a, b) => a.label.localeCompare(b.label))}
          />
        </section>
      </div>

      {/* Quiz nudge */}
      <div className="page" style={{ paddingBottom: "1.5rem" }}>
        <div className="quiznudge">
          🌟 <strong>Not sure where to start?</strong> Answer 5 quick questions and get a shortlist matched to your goal.{" "}
          <Link href="/quiz">Take the free quiz →</Link>
        </div>
      </div>

      {/* Editorial */}
      <section className="editorial" aria-labelledby="editorial-title">
        <div className="page">
          <div className="ei">
            <div className="slbl">Editorial Standards — {month}</div>
            <h2 id="editorial-title">Why {SITE_NAME} Is a Supplement Resource You Can Check</h2>
            <p>
              Supplement marketing is full of big promises and small doses. We built {SITE_NAME} to do the opposite:
              show the evidence behind every claim, say plainly when it&apos;s weak, and make the safety information as easy to
              find as the buying advice.
            </p>
            <h3>Ingredient library graded A to D</h3>
            <p>
              Each <Link href="/ingredients">ingredient guide</Link> lists the uses people buy it for and grades the human
              evidence for each one, alongside official daily targets, upper limits and interactions.
            </p>
            <h3>Comparisons that pick a winner for each situation</h3>
            <p>
              Our <Link href="/compare">X vs Y comparisons</Link> line up form, dose, absorption, evidence and cost, then tell
              you which option suits which goal instead of hedging.
            </p>
            <h3>Free tools, no sign-up</h3>
            <p>
              The <Link href="/tools">tools</Link> check interactions, calculate doses and compare real cost per dose. They run
              in your browser and store nothing.
            </p>
            <h3>Our editorial standards and independence</h3>
            <p>
              Brands can&apos;t pay for rankings or reviews. Affiliate links fund the site and are always marked. Read our{" "}
              <Link href="/editorial-policy">editorial policy</Link> and <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="page">
        <section className="sec" aria-labelledby="faq-title">
          <div className="sh2">
            <div className="slbl">Frequently Asked Questions</div>
            <h2 className="stit" id="faq-title">Common Supplement Questions</h2>
          </div>
          <div className="faqlist">
            {HOME_FAQ.map((f) => (
              <details className="fqi" key={f.q}>
                <summary className="fqq">{f.q}</summary>
                <div className="fqa">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
