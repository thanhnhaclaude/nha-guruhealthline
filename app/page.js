import Link from "next/link";
import DirectoryFilter from "@/components/DirectoryFilter";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/components/ArticleParts";
import { buildStoreUrl, storeLabel } from "@/lib/affiliate";
import { getAllArticles, getAllIngredients, getAllPosts, getAllReviews, getTopicGuide, getTopicItems } from "@/lib/content";
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
    q: `What does ${SITE_NAME} cover?`,
    a: "Evidence-graded guides to 50 supplement ingredients, 21 X vs Y comparisons, 15 dosing and safety guides, health-goal guides for more than 45 conditions and 17 free tools such as an interaction checker and dose calculator.",
  },
  {
    q: "What are the best supplements for weight loss?",
    a: "No supplement causes large weight loss. Soluble fiber such as psyllium helps with fullness and has small effects; most fat burners, including garcinia and green tea extract, show little benefit. Diet, activity, sleep and, for some people, prescription medicines matter far more.",
  },
  {
    q: "What is the best brain supplement for memory and focus?",
    a: "There's no proven memory booster for healthy people. Fixing low vitamin B12 helps when you're deficient, and caffeine with L-theanine improves short-term focus. Ginkgo failed to prevent memory decline in a large trial.",
  },
  {
    q: "Is magnesium glycinate better than magnesium citrate?",
    a: "Both are well absorbed. Glycinate is gentler on the stomach and popular in the evening; citrate is cheaper and has a mild laxative effect. Choose by how your gut reacts.",
  },
  {
    q: "What is the best blood sugar supplement?",
    a: "Berberine and psyllium fiber have the best evidence for lowering blood sugar. They have smaller effects than lifestyle changes and diabetes medicines, and berberine interacts with many drugs.",
  },
  {
    q: "Is creatine monohydrate better than creatine HCl?",
    a: "Yes, for most people. Monohydrate is the form used in nearly all research and costs less; HCl dissolves better but hasn't been shown to work better.",
  },
  {
    q: "What is the best supplement for joint pain?",
    a: "It depends on the cause. Omega-3s modestly help rheumatoid arthritis. For osteoarthritis, glucosamine, curcumin and collagen show mixed results; exercise and weight loss help most.",
  },
  {
    q: "Are supplements safe to take with medication?",
    a: "Some aren't. Vitamin K affects warfarin, minerals bind some antibiotics, and St. John's wort interacts with many drugs. Use our interaction checker and drug interaction lookup, then confirm with your pharmacist.",
  },
  {
    q: "Are dietary supplements FDA approved?",
    a: "No. In the US, the FDA doesn't approve dietary supplements for safety or effectiveness before they're sold. Third-party testing seals such as USP, NSF or Informed Choice help confirm quality.",
  },
  {
    q: "How do you make money?",
    a: "Through affiliate links: when you buy through a link we may earn a commission at no cost to you. Brands can't pay for rankings, and the safety database has no affiliate links.",
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
  const realReviews = reviews.filter((r) => !r.example);
  // Editor's picks: the best-evidence option for each major goal, from our topic guides.
  const PICK_TOPICS = ["weight-loss", "brain-health", "blood-sugar", "dental-health", "joints", "vision", "gut-health", "hearing"];
  const PICK_STYLE = {
    "weight-loss": { short: "Weight Loss", label: "Weight Loss", badge: "pb-gold", btn: "#1a7a4a" },
    "brain-health": { short: "Brain", label: "Brain Health", badge: "pb-purple", btn: "#5b4fcf" },
    "blood-sugar": { short: "Blood Sugar", label: "Blood Sugar", badge: "pb-gold", btn: "#1a7a4a" },
    "dental-health": { short: "Dental", label: "Dental Health", badge: "pb-blue", btn: "#0e8fb0" },
    joints: { short: "Joint Health", label: "Joints & Pain", badge: "pb-yellow", btn: "#b4540a" },
    vision: { short: "Vision", label: "Vision & Eyes", badge: "pb-green", btn: "#1a7a4a" },
    "gut-health": { short: "Gut Health", label: "Gut Health", badge: "pb-green", btn: "#1a7a4a" },
    hearing: { short: "Tinnitus", label: "Hearing & Tinnitus", badge: "pb-green", btn: "#1a7a4a" },
  };
  // One distinct ingredient per goal (e.g. psyllium tops both heart and gut; use the next-best for the second).
  const usedPicks = new Set();
  const topPicks = PICK_TOPICS.map((slug) => {
    const guide = getTopicGuide(slug);
    const topic = TOPICS.find((x) => x.slug === slug);
    const pick = guide?.picks?.slice().sort((a, b) => a.grade.localeCompare(b.grade)).find((p) => p.grade !== "D" && !usedPicks.has(p.name.split(" (")[0]));
    if (pick) usedPicks.add(pick.name.split(" (")[0]);
    return pick && { slug, topic, pick };
  }).filter(Boolean);
  const articles = getAllArticles();
  const topicGuides = TOPICS.map((tp) => ({ tp, guide: getTopicGuide(tp.slug) })).filter((x) => x.guide);
  const EDITORIAL_GOALS = ["weight-loss", "brain-health", "blood-sugar", "joints", "hearing"];
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

      {/* Top picks */}
      <div className="page">
        <section className="sec" aria-labelledby="picks-title" style={{ paddingTop: 0 }}>
          <div className="sh2">
            <div className="slbl">Editor&apos;s Top Picks — {month}</div>
            <h2 className="stit" id="picks-title">Best Supplements of {now.getFullYear()}</h2>
            <p className="ssub">The best-supported option in the most searched health categories, selected for strength of clinical evidence, safety and value.</p>
          </div>
          <div className="reviewed-by" role="note">
            <span aria-hidden="true">📝</span>
            <span>
              Reviewed by the <strong>{SITE_NAME} Editorial Team</strong> · Methodology: human clinical evidence (graded A–D),
              dose versus research, safety and interactions · Last updated: <strong>{fullDate}</strong>
            </span>
          </div>
          <div className="pgrid">
            {realReviews.slice(0, 8).map((r, i) => (
              <article className="pc" key={r.slug}>
                <div className="pct"><div className="pb">#{i + 1} {r.productType}</div></div>
                <div className="pcb">
                  <h3 className="pname">{r.name}</h3>
                  <div className="pcat">★ {Number(r.rating).toFixed(1)}/5</div>
                  <p className="pdesc">{r.verdict}</p>
                  <Link href={`/reviews/${r.slug}`} className="prev">Read Full Review</Link>
                  {r.cta && (
                    <a className="pcta" href={buildStoreUrl(r.cta)} target="_blank" rel="sponsored nofollow noopener">
                      {r.cta.label} on {storeLabel(r.cta)} →
                    </a>
                  )}
                </div>
              </article>
            ))}
            {realReviews.length === 0 && topPicks.map(({ slug, topic, pick }) => {
              const st = PICK_STYLE[slug];
              return (
                <article className="pc" key={slug}>
                  <div className="pct"><div className={`pb ${st.badge}`}>#1 {st.short}</div></div>
                  <div className="pcb">
                    <h3 className="pname">{pick.name}</h3>
                    <div className="pcat">{st.label}</div>
                    <p className="pdesc">{pick.note}</p>
                    <div className="ptrust">
                      <span className="tc">Evidence grade {pick.grade}</span>
                      <span className="tc">{pick.dose.split(/[,;(]/)[0].trim()}</span>
                    </div>
                  </div>
                  <Link href={`/${slug}`} className="prev">Read Full Guide</Link>
                  <a className="pcta" style={{ background: st.btn }} href={buildStoreUrl({ query: pick.name.replace(/\(.*?\)/g, "").trim() + " supplement", store: "amazon" })} target="_blank" rel="sponsored nofollow noopener">
                    Check Best Price →
                  </a>
                  <p className="paff">Affiliate link · Sponsored</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Ingredient guides */}
      <div className="band band-alt" role="region" aria-labelledby="ing-title">
        <div className="page">
          <div className="sh2">
            <div className="slbl">Evidence-Based Ingredient Guides</div>
            <h2 className="stit" id="ing-title">{ingredients.length} Ingredient Guides with Graded Evidence</h2>
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
            <h2 className="stit" id="compare-title">{compare.length} Evidence-Based Supplement Comparisons</h2>
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
            <h2 className="stit" id="dir-title">All {ingredients.length + posts.length + articles.length + topicGuides.length + realReviews.length} Guides, A to Z</h2>
            <p className="ssub">Every review, ingredient and guide on the site. Updated {month}.</p>
          </div>
          <DirectoryFilter
            noun="pages"
            items={[
              ...realReviews.map((r) => ({ href: `/reviews/${r.slug}`, label: r.name, sub: `Review · ${r.productType}` })),
              ...ingredients.map((i) => ({ href: `/ingredients/${i.slug}`, label: i.name, sub: `Ingredient · ${i.group}` })),
              ...posts.map((p) => ({ href: `/${p.slug}`, label: p.title.split(/[:?]/)[0], sub: p.category === "compare" ? "Comparison" : "Dosing & safety" })),
              ...articles.map((a) => ({ href: `/articles/${a.slug}`, label: a.title.split(/[:?]/)[0], sub: "Article" })),
              ...topicGuides.map(({ tp }) => ({ href: `/${tp.slug}`, label: `Supplements for ${tp.name}`, sub: "Health-goal guide" })),
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
            <div className="slbl">Editorial Review — {month}</div>
            <h2 id="editorial-title">Why {SITE_NAME} Is a Supplement Resource You Can Check</h2>
            <p>
              Supplement marketing is full of big promises and small doses. We built {SITE_NAME} to do the opposite: show the
              evidence behind every claim, say plainly when it&apos;s weak, and make safety information as easy to find as buying
              advice. Here is what you&apos;ll find, and how we put it together.
            </p>

            <h3>Supplement ingredient encyclopedia: {ingredients.length} evidence-graded guides</h3>
            <p>
              Every <Link href="/ingredients">ingredient guide</Link> lists the uses people buy it for and grades the human evidence
              from A to D, alongside daily targets, upper limits and interactions. Popular guides include{" "}
              {ingredients.slice(0, 8).map((i, n) => (
                <span key={i.slug}>{n > 0 && ", "}<Link href={`/ingredients/${i.slug}`}>{i.name}</Link></span>
              ))}.
            </p>

            <h3>Supplement comparisons: {compare.length} X vs Y evidence guides</h3>
            <p>
              Our <Link href="/compare">comparisons</Link> line up form, dose, absorption, evidence and cost, then pick a winner for
              each situation. Start with{" "}
              {compare.slice(0, 5).map((p, n) => (
                <span key={p.slug}>{n > 0 && ", "}<Link href={`/${p.slug}`}>{p.vsA} vs {p.vsB}</Link></span>
              ))}.
            </p>

            <h3>Free supplement tools</h3>
            <p>
              {TOOLS.length} <Link href="/tools">free tools</Link> run in your browser and store nothing, including the{" "}
              <Link href="/tools/supplement-interaction-checker/">interaction checker</Link>,{" "}
              <Link href="/tools/supplement-dose-calculator/">dose calculator</Link>,{" "}
              <Link href="/tools/label-decoder/">label decoder</Link> and{" "}
              <Link href="/tools/vitamin-d-calculator/">vitamin D sunlight calculator</Link>.
            </p>

            {EDITORIAL_GOALS.map((slug) => {
              const g = getTopicGuide(slug);
              const tp = TOPICS.find((x) => x.slug === slug);
              if (!g) return null;
              return (
                <div key={slug}>
                  <h3>{g.title.split(":")[0]} in {now.getFullYear()}</h3>
                  <p>
                    {g.answer} <Link href={`/${slug}`}>Read the full {tp.name.toLowerCase()} guide →</Link>
                  </p>
                </div>
              );
            })}

            <h3>Condition-specific supplement guides: {topicGuides.length} health goals</h3>
            <p>
              {topicGuides.map(({ tp }, n) => (
                <span key={tp.slug}>{n > 0 && " · "}<Link href={`/${tp.slug}`}>{tp.name}</Link></span>
              ))}
            </p>

            <h3>Dosing and safety guides: clear answers to common questions</h3>
            <p>
              {dosing.map((p, n) => (
                <span key={p.slug}>{n > 0 && " · "}<Link href={`/${p.slug}`}>{p.title.match(/^[^?:]+\??/)[0]}</Link></span>
              ))}
            </p>

            <h3>Free supplement safety tools</h3>
            <p>
              The <Link href="/supplement-safety-database/">supplement safety database</Link> lists {INTERACTIONS.filter((i) => i.level !== "ok").length}{" "}
              documented interactions with no affiliate links. Look up a prescription medicine in the{" "}
              <Link href="/tools/supplement-drug-interactions/">drug interaction lookup</Link>, or check marketing claims with the{" "}
              <Link href="/tools/snake-oil/">snake oil detector</Link>.
            </p>

            <h3>Our editorial standards and independence</h3>
            <p>
              Every page cites its sources, most from the NIH Office of Dietary Supplements, NCCIH, MedlinePlus and peer-reviewed
              trials. Brands can&apos;t pay for rankings or reviews. Affiliate links fund the site and are always marked. Read our{" "}
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
