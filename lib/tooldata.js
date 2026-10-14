// Reference data for the interactive tools. Values: NIH Office of Dietary
// Supplements fact sheets (RDA/AI and Tolerable Upper Intake Levels, adults 19+).
// Groups: m = male, f = female, p = pregnant. Ages: "19-50" | "51-70" | "71+".

const byAge = (young, mid, old) => ({ "19-50": young, "51-70": mid, "71+": old });

export const NUTRIENTS = [
  {
    id: "vitamin-d", name: "Vitamin D", unit: "IU", link: "/ingredients/vitamin-d3",
    rda: { m: byAge(600, 600, 800), f: byAge(600, 600, 800), p: byAge(600, 600, 600) },
    ul: 4000, ulNote: "from all sources",
  },
  {
    id: "magnesium", name: "Magnesium", unit: "mg", link: "/ingredients/magnesium",
    rda: { m: byAge(420, 420, 420), f: byAge(320, 320, 320), p: byAge(360, 360, 360) },
    rda1930: { m: 400, f: 310, p: 350 },
    ul: 350, ulNote: "from supplements only",
  },
  {
    id: "zinc", name: "Zinc", unit: "mg", link: "/ingredients/zinc",
    rda: { m: byAge(11, 11, 11), f: byAge(8, 8, 8), p: byAge(11, 11, 11) },
    ul: 40, ulNote: "from all sources",
  },
  {
    id: "calcium", name: "Calcium", unit: "mg",
    rda: { m: byAge(1000, 1000, 1200), f: byAge(1000, 1200, 1200), p: byAge(1000, 1000, 1000) },
    ulByAge: byAge(2500, 2000, 2000), ulNote: "from all sources",
  },
  {
    id: "iron", name: "Iron", unit: "mg",
    rda: { m: byAge(8, 8, 8), f: byAge(18, 8, 8), p: byAge(27, 27, 27) },
    ul: 45, ulNote: "from all sources",
  },
  {
    id: "vitamin-c", name: "Vitamin C", unit: "mg",
    rda: { m: byAge(90, 90, 90), f: byAge(75, 75, 75), p: byAge(85, 85, 85) },
    ul: 2000, ulNote: "from all sources; smokers need 35 mg more per day",
  },
  {
    id: "b12", name: "Vitamin B12", unit: "mcg",
    rda: { m: byAge(2.4, 2.4, 2.4), f: byAge(2.4, 2.4, 2.4), p: byAge(2.6, 2.6, 2.6) },
    ul: null, ulNote: "no upper limit set; adults over 50 should get most B12 from supplements or fortified foods",
  },
  {
    id: "folate", name: "Folate", unit: "mcg DFE",
    rda: { m: byAge(400, 400, 400), f: byAge(400, 400, 400), p: byAge(600, 600, 600) },
    ul: 1000, ulNote: "applies to folic acid from supplements and fortified foods",
  },
  {
    id: "vitamin-a", name: "Vitamin A", unit: "mcg RAE",
    rda: { m: byAge(900, 900, 900), f: byAge(700, 700, 700), p: byAge(770, 770, 770) },
    ul: 3000, ulNote: "applies to preformed vitamin A (retinol), not beta-carotene",
  },
  {
    id: "vitamin-k", name: "Vitamin K", unit: "mcg", ai: true,
    rda: { m: byAge(120, 120, 120), f: byAge(90, 90, 90), p: byAge(90, 90, 90) },
    ul: null, ulNote: "no upper limit set; people on warfarin must keep intake consistent",
  },
  {
    id: "b6", name: "Vitamin B6", unit: "mg",
    rda: { m: byAge(1.3, 1.7, 1.7), f: byAge(1.3, 1.5, 1.5), p: byAge(1.9, 1.9, 1.9) },
    ul: 100, ulNote: "long-term high doses can cause nerve damage",
  },
  {
    id: "selenium", name: "Selenium", unit: "mcg",
    rda: { m: byAge(55, 55, 55), f: byAge(55, 55, 55), p: byAge(60, 60, 60) },
    ul: 400, ulNote: "from all sources",
  },
  {
    id: "iodine", name: "Iodine", unit: "mcg",
    rda: { m: byAge(150, 150, 150), f: byAge(150, 150, 150), p: byAge(220, 220, 220) },
    ul: 1100, ulNote: "from all sources",
  },
];

export const SUPPLEMENTS = [
  "Calcium", "Iron", "Zinc", "Magnesium", "Copper", "Vitamin D", "Vitamin K", "Vitamin C", "Vitamin E",
  "Vitamin B12", "Fish oil", "Ginkgo", "St. John's wort", "5-HTP", "Melatonin", "Valerian", "Ashwagandha", "Psyllium fiber",
];

export const MEDICATIONS = [
  "Warfarin", "Levothyroxine", "Tetracycline or quinolone antibiotics", "SSRIs / antidepressants", "Metformin",
];

// level: avoid | caution | ok (ok = known positive pairing)
export const INTERACTIONS = [
  { a: "Calcium", b: "Iron", level: "caution", text: "Calcium reduces iron absorption. Take them at least 2 hours apart." },
  { a: "Zinc", b: "Iron", level: "caution", text: "Supplemental doses compete for absorption when taken together on an empty stomach. Separate them or take with food." },
  { a: "Zinc", b: "Copper", level: "caution", text: "Long-term zinc above 40 mg/day can cause copper deficiency. Many zinc products add 1–2 mg copper for this reason." },
  { a: "Calcium", b: "Zinc", level: "caution", text: "High-dose calcium may lower zinc absorption. Take them at different times." },
  { a: "Calcium", b: "Magnesium", level: "caution", text: "Very high doses compete for absorption. At normal doses, taking them together is fine." },
  { a: "Vitamin D", b: "Calcium", level: "ok", text: "Complementary: vitamin D increases calcium absorption." },
  { a: "Vitamin D", b: "Vitamin K", level: "ok", text: "Commonly combined and safe for most people. Extra benefit of K2 is unproven." },
  { a: "Vitamin C", b: "Iron", level: "ok", text: "Vitamin C increases absorption of plant-based (non-heme) iron." },
  { a: "Fish oil", b: "Ginkgo", level: "caution", text: "Both may slightly affect blood clotting. Combined use may raise bleeding risk, especially before surgery." },
  { a: "Fish oil", b: "Vitamin E", level: "caution", text: "High doses of both may add to bleeding risk. Normal doses are generally fine." },
  { a: "St. John's wort", b: "5-HTP", level: "avoid", text: "Both raise serotonin. Combined use may cause serotonin syndrome." },
  { a: "Melatonin", b: "Valerian", level: "caution", text: "Additive drowsiness. Don't drive or combine with alcohol." },
  { a: "Ashwagandha", b: "Melatonin", level: "caution", text: "Both can cause drowsiness. Start one at a time." },
  { a: "Ashwagandha", b: "Valerian", level: "caution", text: "Additive sedative effects are possible." },
  { a: "Psyllium fiber", b: "Iron", level: "caution", text: "Fiber can reduce mineral absorption. Take minerals 2 hours apart from fiber supplements." },
  { a: "Psyllium fiber", b: "Calcium", level: "caution", text: "Take calcium 2 hours apart from fiber supplements." },
  // Medications
  { a: "Warfarin", b: "Vitamin K", level: "avoid", text: "Vitamin K directly counteracts warfarin. Don't start or stop it without your prescriber; keep intake consistent." },
  { a: "Warfarin", b: "St. John's wort", level: "avoid", text: "Can reduce warfarin's effect and raise clot risk." },
  { a: "Warfarin", b: "Fish oil", level: "caution", text: "High doses may increase bleeding risk. Ask your doctor before taking more than 1–2 g/day." },
  { a: "Warfarin", b: "Ginkgo", level: "caution", text: "May increase bleeding risk." },
  { a: "Warfarin", b: "Vitamin E", level: "caution", text: "High doses may increase bleeding risk." },
  { a: "Levothyroxine", b: "Calcium", level: "caution", text: "Reduces levothyroxine absorption. Take at least 4 hours apart." },
  { a: "Levothyroxine", b: "Iron", level: "caution", text: "Reduces levothyroxine absorption. Take at least 4 hours apart." },
  { a: "Levothyroxine", b: "Magnesium", level: "caution", text: "May reduce absorption. Separate by at least 4 hours." },
  { a: "Tetracycline or quinolone antibiotics", b: "Calcium", level: "caution", text: "Minerals bind these antibiotics. Take the antibiotic 2 hours before or 4–6 hours after." },
  { a: "Tetracycline or quinolone antibiotics", b: "Magnesium", level: "caution", text: "Separate by at least 2 hours before or 4–6 hours after the antibiotic." },
  { a: "Tetracycline or quinolone antibiotics", b: "Zinc", level: "caution", text: "Separate by at least 2 hours before or 4–6 hours after the antibiotic." },
  { a: "Tetracycline or quinolone antibiotics", b: "Iron", level: "caution", text: "Separate by at least 2 hours before or 4–6 hours after the antibiotic." },
  { a: "SSRIs / antidepressants", b: "St. John's wort", level: "avoid", text: "Risk of serotonin syndrome, and it alters levels of many antidepressants." },
  { a: "SSRIs / antidepressants", b: "5-HTP", level: "avoid", text: "Risk of serotonin syndrome." },
  { a: "Metformin", b: "Vitamin B12", level: "ok", text: "Long-term metformin can lower B12 levels. A B12 supplement is often appropriate; ask your doctor about testing." },
];

export const INTERACTION_SOURCES = [
  { title: "NIH ODS fact sheets (calcium, iron, zinc, magnesium, vitamin K, omega-3)", url: "https://ods.od.nih.gov/factsheets/list-all/" },
  { title: "MedlinePlus: Warfarin", url: "https://medlineplus.gov/druginfo/meds/a682277.html" },
  { title: "NCCIH: St. John's Wort", url: "https://www.nccih.nih.gov/health/st-johns-wort" },
];
