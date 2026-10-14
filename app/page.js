import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import ProductCard from "@/components/ProductCard";
import SearchBox from "@/components/SearchBox";
import { Faq, faqSchema } from "@/components/ArticleParts";
import { getAllIngredients, getAllPosts, getAllReviews, getTopicItems } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TOPICS } from "@/lib/topics";
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
    a: "We start from official sources and peer-reviewed research, compare product doses with the doses used in studies, and check for third-party testing. Retailers can't pay for placement. Our editorial policy explains the full process.",
  },
  {
    q: "Are supplements safe to take with medication?",
    a: "Some aren't. Vitamin K affects warfarin, magnesium and zinc bind some antibiotics, and St. John's wort interacts with many drugs. Use our interaction checker as a starting point and always confirm with your pharmacist.",
  },
  {
    q: "Do I need supplements if I eat a healthy diet?",
    a: "Often not. A varied diet covers most needs. Common exceptions include vitamin D for people with little sun exposure, B12 for vegans and older adults, folic acid before pregnancy, and iron when a blood test shows you're low.",
  },
  {
    q: "How do you make money?",
    a: "Through affiliate links: when you buy through a link we may earn a commission at no cost to you. This never changes our verdicts. See our affiliate disclosure.",
  },
];

export default function Home() {
  const posts = getAllPosts();
  const ingredients = getAllIngredients();
  const reviews = getAllReviews();
  const compare = posts.filter((p) => p.category === "compare");
  const dosing = posts.filter((p) => p.category === "dosing");
  const month = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const stats = [
    [reviews.length, "Products reviewed"],
    [TOPICS.length, "Health goals"],
    [ingredients.length, "Ingredient guides"],
    [TOOLS.length, "Free tools"],
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          faqSchema(HOME_FAQ),
        ]}
      />

      {/* 1. Hero */}
      <section className="hero-band">
        <div className="container">
          <span className="pill-badge"><Icon name="check" size={16} /> Independent research · Updated {month}</span>
          <h1>Find the <em>supplements that work</em>, at the dose that matters</h1>
          <p className="lead">
            Evidence-graded reviews, ingredient guides and comparisons across {TOPICS.length} health goals, from sleep
            and stress to heart, gut and bone health.
          </p>
          <div className="hero-stats">
            {stats.map(([n, l]) => (
              <div key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </div>
          <SearchBox />
          <Link href="/quiz" className="quiz-link">
            <Icon name="quiz" /> Not sure where to start? Take the 60-second supplement quiz
          </Link>
        </div>
      </section>

      <div className="container">
        {/* 2. Browse by goal */}
        <section className="sec" aria-labelledby="goals">
          <div className="sec-head">
            <p className="sec-label">Browse by goal</p>
            <h2 className="sec-title" id="goals">Find supplements for your specific goal</h2>
          </div>
          <div className="cat-grid">
            {TOPICS.map((t) => {
              const it = getTopicItems(t.slug);
              const n = it.guides.length + it.ingredients.length + it.reviews.length;
              return (
                <Link key={t.slug} href={`/${t.slug}`} className="cat-card">
                  <span className="cat-icon"><Icon name={t.icon} /></span>
                  <span>
                    <span className="cat-name">{t.name}</span>
                    <span className="cat-count" style={{ display: "block" }}>{n ? `${n} guides & reviews` : "Coming soon"}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Top picks (hidden until real reviews exist) */}
        {reviews.length > 0 && (
        <section className="sec" aria-labelledby="picks">
          <div className="sec-head">
            <p className="sec-label">Editor&apos;s top picks · {month}</p>
            <h2 className="sec-title" id="picks">Top-rated supplements</h2>
            <p className="sec-sub">Ranked on ingredient quality, dose versus research, transparency, safety and value.</p>
          </div>
          <div className="reviewed-by" role="note">
            <Icon name="check" size={18} />
            <span>
              Reviewed by the {SITE_NAME} editorial team using our <Link href="/editorial-policy">published methodology</Link>.
              No brand pays for placement.
            </span>
          </div>
          <div className="prod-grid">
            {reviews.slice(0, 8).map((r, i) => <ProductCard key={r.slug} review={r} rank={i + 1} />)}
          </div>
        </section>
        )}
      </div>

      {/* 4. Quiz CTA band */}
      <section className="sec-alt">
        <div className="container sec" style={{ display: "grid", gap: 16, justifyItems: "start" }}>
          <p className="sec-label">Personalized in 60 seconds</p>
          <h2 className="sec-title">Which supplements actually fit you?</h2>
          <p className="sec-sub">Five questions about your goals, diet and life stage. You get a shortlist with doses and the guides to read next.</p>
          <Link className="btn btn-accent" href="/quiz">Start the quiz <Icon name="arrow" size={18} /></Link>
        </div>
      </section>

      <div className="container">
        {/* 5. Ingredient library */}
        <section className="sec" aria-labelledby="ingr">
          <div className="sec-head row">
            <div>
              <p className="sec-label">Ingredient library</p>
              <h2 className="sec-title" id="ingr">Evidence-based ingredient guides</h2>
            </div>
            <Link href="/ingredients">All ingredients</Link>
          </div>
          <div className="dir-grid">
            {ingredients.map((i) => (
              <Link key={i.slug} href={`/ingredients/${i.slug}`} className="dir-item">
                <span>{i.name}<small>{i.facts?.Type}</small></span>
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Comparisons */}
        <section className="sec" aria-labelledby="cmp">
          <div className="sec-head row">
            <div>
              <p className="sec-label">Head to head</p>
              <h2 className="sec-title" id="cmp">X vs Y comparisons</h2>
            </div>
            <Link href="/compare">All comparisons</Link>
          </div>
          <div className="grid">
            {compare.slice(0, 6).map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>

        {/* 7. Tools */}
        <section className="sec" aria-labelledby="tools">
          <div className="sec-head row">
            <div>
              <p className="sec-label">Free tools</p>
              <h2 className="sec-title" id="tools">Calculators and checkers</h2>
            </div>
            <Link href="/tools">All tools</Link>
          </div>
          <div className="tool-grid">
            {TOOLS.map((t) => (
              <Link key={t.slug} href={t.href} className="tool-card">
                <span className="cat-icon"><Icon name={t.icon} /></span>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <span className="cta">Open tool <Icon name="arrow" size={16} /></span>
              </Link>
            ))}
          </div>
        </section>

        {/* 8. Dosing & safety */}
        <section className="sec" aria-labelledby="dose">
          <div className="sec-head row">
            <div>
              <p className="sec-label">Dosing & safety</p>
              <h2 className="sec-title" id="dose">How much, when, and with what</h2>
            </div>
            <Link href="/dosing-safety">All dosing guides</Link>
          </div>
          <ul className="link-list">
            {dosing.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`}><Icon name="pill" size={18} />{p.title.split(/[?:]/)[0]}</Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 9. Product directory */}
        {reviews.length > 0 && (
        <section className="sec" aria-labelledby="dir">
          <div className="sec-head row">
            <div>
              <p className="sec-label">Product directory</p>
              <h2 className="sec-title" id="dir">All reviewed supplements</h2>
            </div>
            <Link href="/all-supplements">Full directory</Link>
          </div>
          <div className="dir-grid">
            {reviews.map((r) => (
              <Link key={r.slug} href={`/reviews/${r.slug}`} className="dir-item">
                <span>{r.name}<small>{r.productType}</small></span>
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </div>
        </section>
        )}
      </div>

      {/* 10. Editorial */}
      <section className="sec-alt">
        <div className="container sec">
          <div className="sec-head">
            <p className="sec-label">Why trust us</p>
            <h2 className="sec-title">How we research every page</h2>
          </div>
          <div className="editorial-grid">
            <div>
              <h3>Evidence graded A to D</h3>
              <p>Every ingredient guide grades each claimed benefit by the strength of human research, so you can see at a glance what is proven, promising or unsupported.</p>
            </div>
            <div>
              <h3>Doses checked against studies</h3>
              <p>Many products use a fraction of the dose tested in trials. Our reviews compare each ingredient&apos;s dose with the research and flag underdosed formulas.</p>
            </div>
            <div>
              <h3>Safety first</h3>
              <p>We list upper limits, side effects and medication interactions on every relevant page, and tell you when to talk to a doctor before buying.</p>
            </div>
            <div>
              <h3>Independent and transparent</h3>
              <p>Affiliate links keep the site free, but brands can&apos;t pay for rankings. Read our <Link href="/editorial-policy">editorial policy</Link> and <Link href="/affiliate-disclosure">disclosure</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <div className="container sec" style={{ maxWidth: "var(--prose)" }}>
        <p className="sec-label">FAQ</p>
        <Faq faq={HOME_FAQ} />
      </div>
    </>
  );
}
