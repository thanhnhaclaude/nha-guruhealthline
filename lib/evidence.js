// Evidence database shared by the evidence-db, label decoder, stack builder,
// spending audit and timeline tools.
// Grades follow our A–D scale: A strong, B moderate, C limited/mixed, D good evidence of no benefit
// (or no meaningful evidence for a heavily marketed use). Grades summarize NIH ODS / NCCIH
// fact sheets and the meta-analyses cited on each linked page; they are editorial summaries.
// `onset` = typical time to a measurable effect in trials (approximate).
// `slot` = when it's usually easiest to take: morning | meal | evening | bedtime | any.

export const EVIDENCE = [
  { id: "magnesium", name: "Magnesium", aliases: ["magnesium glycinate", "magnesium citrate", "magnesium oxide", "magnesium malate", "magnesium bisglycinate", "magnesium l-threonate"], category: "Mineral", link: "/ingredients/magnesium/", slot: "evening", onset: [14, 56], uses: [["Correcting low magnesium", "A"], ["Constipation (citrate, oxide)", "A"], ["Blood pressure", "B"], ["Sleep quality", "C"]] },
  { id: "vitamin-d", name: "Vitamin D3", aliases: ["vitamin d", "cholecalciferol", "vitamin d3", "ergocalciferol", "vitamin d2"], category: "Vitamin", link: "/ingredients/vitamin-d3/", slot: "meal", onset: [56, 90], uses: [["Correcting deficiency", "A"], ["Bone health with calcium (older adults)", "B"], ["Respiratory infections", "C"], ["Preventing heart disease or cancer", "D"]] },
  { id: "zinc", name: "Zinc", aliases: ["zinc picolinate", "zinc gluconate", "zinc citrate", "zinc acetate", "zinc oxide"], category: "Mineral", link: "/ingredients/zinc/", slot: "meal", onset: [1, 7], uses: [["Correcting deficiency", "A"], ["Shorter colds (lozenges)", "B"], ["Preventing colds", "C"]] },
  { id: "omega-3", name: "Omega-3 (EPA/DHA)", aliases: ["fish oil", "omega-3", "epa", "dha", "krill oil", "algal oil", "algae oil"], category: "Essential fat", link: "/ingredients/omega-3/", slot: "meal", onset: [28, 84], uses: [["Lowering high triglycerides", "A"], ["Rheumatoid arthritis symptoms", "B"], ["Heart disease prevention (general population)", "C"]] },
  { id: "creatine", name: "Creatine", aliases: ["creatine monohydrate", "creatine hcl", "creatine hydrochloride"], category: "Performance", link: "/ingredients/creatine/", slot: "any", onset: [7, 28], uses: [["Strength and power with training", "A"], ["Lean mass with training", "A"], ["Memory and cognition", "C"]] },
  { id: "ashwagandha", name: "Ashwagandha", aliases: ["withania somnifera", "ksm-66", "sensoril"], category: "Herb", link: "/ingredients/ashwagandha/", slot: "evening", onset: [42, 56], uses: [["Perceived stress", "B"], ["Sleep quality", "C"], ["Anxiety", "C"]] },
  { id: "coq10", name: "CoQ10", aliases: ["coenzyme q10", "ubiquinol", "ubiquinone"], category: "Antioxidant", link: "/ingredients/coq10/", slot: "meal", onset: [28, 84], uses: [["Heart failure (add-on)", "B"], ["Statin muscle symptoms", "C"], ["Migraine prevention", "C"]] },
  { id: "l-theanine", name: "L-Theanine", aliases: ["theanine", "suntheanine"], category: "Amino acid", link: "/ingredients/l-theanine/", slot: "any", onset: [0.021, 0.042], uses: [["Short-term stress", "B"], ["Focus with caffeine", "B"], ["Sleep quality", "C"]] },
  { id: "probiotics", name: "Probiotics", aliases: ["lactobacillus", "bifidobacterium", "saccharomyces boulardii", "probiotic blend"], category: "Gut health", link: "/ingredients/probiotics/", slot: "any", onset: [3, 28], uses: [["Antibiotic-associated diarrhea", "B"], ["IBS symptoms", "C"], ["General health in healthy adults", "D"]] },
  { id: "b12", name: "Vitamin B12", aliases: ["cyanocobalamin", "methylcobalamin", "cobalamin", "vitamin b12"], category: "Vitamin", link: "/ingredients/vitamin-b12/", slot: "morning", onset: [14, 56], uses: [["Treating deficiency", "A"], ["Energy without deficiency", "D"]] },
  { id: "melatonin", name: "Melatonin", aliases: [], category: "Hormone", link: "/melatonin-vs-magnesium-for-sleep/", slot: "bedtime", onset: [0.021, 0.042], uses: [["Jet lag", "B"], ["Falling asleep faster", "B"]] },
  { id: "iron", name: "Iron", aliases: ["ferrous sulfate", "ferrous bisglycinate", "ferrous gluconate", "ferrous fumarate", "iron bisglycinate"], category: "Mineral", link: "/ferrous-bisglycinate-vs-ferrous-sulfate/", slot: "morning", onset: [14, 90], uses: [["Iron-deficiency anemia", "A"], ["Fatigue without deficiency", "D"]] },
  { id: "calcium", name: "Calcium", aliases: ["calcium carbonate", "calcium citrate"], category: "Mineral", link: null, slot: "meal", onset: [180, 365], uses: [["Bone health with vitamin D (older adults)", "B"]] },
  { id: "vitamin-c", name: "Vitamin C", aliases: ["ascorbic acid"], category: "Vitamin", link: "/how-much-vitamin-c-per-day/", slot: "any", onset: [7, 28], uses: [["Shorter colds (regular use)", "B"], ["Preventing colds", "D"]] },
  { id: "vitamin-k2", name: "Vitamin K2", aliases: ["menaquinone", "mk-7", "mk-4", "vitamin k"], category: "Vitamin", link: "/can-you-take-vitamin-d-and-k2-together/", slot: "meal", onset: [90, 365], uses: [["Bone density", "C"], ["Arterial calcification", "C"]] },
  { id: "folic-acid", name: "Folic acid", aliases: ["folate", "methylfolate", "5-mthf"], category: "Vitamin", link: null, slot: "morning", onset: [28, 90], uses: [["Preventing neural tube defects (before pregnancy)", "A"]] },
  { id: "psyllium", name: "Psyllium fiber", aliases: ["psyllium", "psyllium husk", "fiber"], category: "Fiber", link: null, slot: "meal", onset: [0.5, 3], uses: [["Constipation", "A"], ["Lowering LDL cholesterol", "A"]] },
  { id: "berberine", name: "Berberine", aliases: [], category: "Plant compound", link: "/can-you-take-berberine-long-term/", slot: "meal", onset: [28, 90], uses: [["Blood sugar in type 2 diabetes", "B"], ["Weight loss", "C"]] },
  { id: "curcumin", name: "Turmeric / curcumin", aliases: ["turmeric", "curcumin"], category: "Herb", link: null, slot: "meal", onset: [28, 84], uses: [["Knee osteoarthritis pain", "C"]] },
  { id: "glucosamine", name: "Glucosamine", aliases: ["glucosamine sulfate", "chondroitin"], category: "Joint", link: null, slot: "meal", onset: [28, 84], uses: [["Knee osteoarthritis pain", "C"]] },
  { id: "collagen", name: "Collagen peptides", aliases: ["collagen", "hydrolyzed collagen", "marine collagen", "bovine collagen"], category: "Protein", link: "/marine-collagen-vs-bovine-collagen/", slot: "any", onset: [56, 84], uses: [["Skin hydration and elasticity", "C"], ["Joint pain", "C"]] },
  { id: "rhodiola", name: "Rhodiola", aliases: ["rhodiola rosea"], category: "Herb", link: "/ashwagandha-vs-rhodiola/", slot: "morning", onset: [3, 28], uses: [["Mental fatigue", "C"]] },
  { id: "valerian", name: "Valerian", aliases: ["valerian root"], category: "Herb", link: "/valerian-root-vs-melatonin/", slot: "bedtime", onset: [14, 28], uses: [["Sleep quality", "C"]] },
  { id: "st-johns-wort", name: "St. John's wort", aliases: ["hypericum"], category: "Herb", link: null, slot: "morning", onset: [28, 42], uses: [["Mild to moderate depression", "B"]], warning: "Interacts with many medicines, including birth control, antidepressants and blood thinners." },
  { id: "ginkgo", name: "Ginkgo", aliases: ["ginkgo biloba"], category: "Herb", link: null, slot: "meal", onset: [28, 84], uses: [["Preventing memory decline or dementia", "D"]] },
  { id: "nmn", name: "NMN / NR", aliases: ["nicotinamide mononucleotide", "nicotinamide riboside", "nad+", "nad"], category: "Longevity", link: "/nad-vs-nmn/", slot: "morning", onset: [14, 60], uses: [["Raising blood NAD", "B"], ["Slowing aging in humans", "C"]] },
  { id: "biotin", name: "Biotin", aliases: ["vitamin b7"], category: "Vitamin", link: null, slot: "any", onset: [56, 120], uses: [["Hair growth without deficiency", "D"]], warning: "High doses can interfere with some lab tests, including thyroid and heart tests. Tell your doctor before blood work." },
  { id: "lutein", name: "Lutein & zeaxanthin (AREDS2)", aliases: ["lutein", "zeaxanthin", "areds2"], category: "Eye health", link: null, slot: "meal", onset: [180, 365], uses: [["Slowing intermediate AMD (AREDS2 formula)", "A"]] },
  { id: "echinacea", name: "Echinacea", aliases: [], category: "Herb", link: null, slot: "any", onset: [1, 7], uses: [["Preventing or treating colds", "C"]] },
  { id: "elderberry", name: "Elderberry", aliases: ["sambucus"], category: "Herb", link: null, slot: "any", onset: [1, 5], uses: [["Shorter colds or flu", "C"]] },
  { id: "green-tea-extract", name: "Green tea extract", aliases: ["egcg", "green tea"], category: "Herb", link: null, slot: "meal", onset: [28, 84], uses: [["Weight loss", "D"]], warning: "Concentrated extracts have been linked to rare liver injury, especially on an empty stomach." },
  { id: "garcinia", name: "Garcinia cambogia", aliases: ["hca", "hydroxycitric acid", "garcinia"], category: "Weight loss", link: null, slot: "meal", onset: [28, 84], uses: [["Weight loss", "D"]] },
  { id: "red-yeast-rice", name: "Red yeast rice", aliases: ["monacolin k"], category: "Cholesterol", link: null, slot: "evening", onset: [28, 84], uses: [["Lowering LDL cholesterol", "B"]], warning: "Can contain monacolin K, chemically identical to the statin lovastatin. Don't combine with statins." },
  { id: "potassium", name: "Potassium", aliases: ["potassium chloride", "potassium citrate"], category: "Mineral", link: null, slot: "meal", onset: [28, 56], uses: [["Blood pressure (low-potassium diets)", "B"]], warning: "Dangerous with some blood pressure medicines and kidney disease." },
];

export const GRADE_LABEL = { A: "Strong evidence", B: "Moderate evidence", C: "Limited or mixed", D: "No good evidence" };

export function findEvidence(text) {
  const t = text.toLowerCase();
  // Longest alias first so "magnesium glycinate" beats "magnesium".
  let best = null;
  let bestLen = 0;
  for (const e of EVIDENCE) {
    for (const a of [e.name.toLowerCase(), e.id.replace(/-/g, " "), ...e.aliases]) {
      if (a && t.includes(a) && a.length > bestLen) {
        best = e;
        bestLen = a.length;
      }
    }
  }
  return best;
}

export function bestGrade(e) {
  return e.uses.map((u) => u[1]).sort()[0];
}

export function formatOnset([lo, hi]) {
  const n = (v, u) => `${v} ${u}${v === 1 ? "" : "s"}`;
  const f = (d) => (d < 0.1 ? `${Math.round(d * 24 * 60)} min` : d < 1 ? `${Math.round(d * 24)} h` : d < 14 ? n(Math.round(d), "day") : d < 120 ? n(Math.round(d / 7), "week") : n(Math.round(d / 30), "month"));
  return lo === hi ? f(lo) : `${f(lo)} – ${f(hi)}`;
}
