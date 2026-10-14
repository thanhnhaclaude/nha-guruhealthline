// Health goals. Slugs match the original site's URLs exactly.
// `grid: true` = shown in the home page "Browse by Category" grid (same order as the original).
export const TOPICS = [
  { slug: "weight-loss", grid: true, emoji: "⚖️", name: "Weight Loss", icon: "scale", blurb: "What helps with appetite, metabolism and body composition, and what's mostly marketing." },
  { slug: "brain-health", grid: true, emoji: "🧠", name: "Brain & Memory", icon: "brain", blurb: "Focus, memory and mental energy: which nootropics and nutrients have human evidence." },
  { slug: "blood-sugar", grid: true, emoji: "🩸", name: "Blood Sugar", icon: "drop", blurb: "Supplements studied for glucose control, and how they interact with diabetes medication." },
  { slug: "mens-health", grid: true, emoji: "💪", name: "Men's Health", icon: "male", blurb: "Testosterone, prostate, fertility and performance, with realistic expectations." },
  { slug: "vision", grid: true, emoji: "👁️", name: "Vision & Eyes", icon: "eye", blurb: "Lutein, zeaxanthin and the AREDS2 formula for eye health." },
  { slug: "gut-health", grid: true, emoji: "🦠", name: "Gut Health", icon: "gut", blurb: "Probiotics, fiber and digestive support: which strains match which problems." },
  { slug: "joints", grid: true, emoji: "🦴", name: "Joints & Pain", icon: "bone", blurb: "Glucosamine, collagen, turmeric and omega-3s for stiff, achy joints." },
  { slug: "dental-health", grid: true, emoji: "🦷", name: "Dental Health", icon: "sparkle", blurb: "Oral probiotics, vitamin D, calcium and what actually protects teeth and gums." },
  { slug: "hearing", grid: true, emoji: "👂", name: "Hearing & Tinnitus", icon: "smile", blurb: "What the research says about supplements for tinnitus and age-related hearing loss." },
  { slug: "sleep", grid: true, emoji: "😴", name: "Sleep", icon: "moon", blurb: "Magnesium, melatonin, glycine and herbal options for falling and staying asleep." },
  { slug: "lung-health", grid: true, emoji: "🫁", name: "Lung Health", icon: "shield", blurb: "NAC, vitamin D and omega-3s for respiratory health, and when to see a doctor instead." },
  { slug: "hair", grid: true, emoji: "💇", name: "Hair & Nails", icon: "sparkle", blurb: "Biotin, collagen, iron and zinc: when they help hair and nails and when they don't." },
  { slug: "womens-health", grid: true, emoji: "💗", name: "Women's Health", icon: "female", blurb: "Iron, folate, bone health, PMS and menopause support across life stages." },
  { slug: "adhd-supplements", grid: true, emoji: "🎯", name: "ADHD Supplements", icon: "brain", blurb: "Omega-3s, iron, zinc and magnesium in ADHD: what trials show alongside standard care." },
  { slug: "menopause-supplements", grid: true, emoji: "🌺", name: "Menopause", icon: "flower", blurb: "Hot flashes, sleep and bone loss: what's been tested in trials." },
  { slug: "testosterone-supplements", grid: true, emoji: "🏋️", name: "Testosterone", icon: "dumbbell", blurb: "Zinc, vitamin D, ashwagandha and other boosters: realistic effects on testosterone." },
  { slug: "inflammation-supplements", grid: true, emoji: "🔥", name: "Inflammation", icon: "bolt", blurb: "Omega-3s, curcumin and other anti-inflammatory supplements, graded by evidence." },
  { slug: "thyroid-supplements", grid: true, emoji: "🦋", name: "Thyroid Health", icon: "drop", blurb: "Iodine, selenium and the supplements that interfere with thyroid medication." },
  { slug: "heart-health-supplements", grid: true, emoji: "❤️", name: "Heart Health", icon: "heart", blurb: "Omega-3s, CoQ10, fiber and more for cholesterol, blood pressure and circulation." },
  { slug: "longevity-supplements", grid: true, emoji: "♾️", name: "Longevity", icon: "hourglass", blurb: "NAD+ precursors, omega-3s and the basics that matter most after 50." },
  // Additional topic pages (linked from content, not in the home grid)
  { slug: "anxiety-supplements", emoji: "🧘", name: "Stress & Anxiety", icon: "smile", blurb: "Adaptogens, L-theanine and nutrients linked to stress, anxiety and low mood." },
  { slug: "energy-supplements", emoji: "⚡", name: "Energy & Fatigue", icon: "bolt", blurb: "B12, iron, creatine and other fixes for tiredness, starting with what to test." },
  { slug: "immune-system", emoji: "🛡️", name: "Immune Support", icon: "shield", blurb: "Vitamin D, zinc, vitamin C and elderberry: prevention vs. shortening a cold." },
  { slug: "bone-health-supplements", emoji: "🦴", name: "Bone Health", icon: "bone", blurb: "Calcium, vitamin D, vitamin K2 and magnesium for stronger bones." },
  { slug: "muscle-building-supplements", emoji: "💪", name: "Muscle Building", icon: "dumbbell", blurb: "Creatine, protein and other performance supplements with strong evidence." },
];

// Library links that sit in the home grid after the 13th topic, as on the original site.
export const GRID_LIBRARIES = [
  { href: "/ingredients", emoji: "📚", name: "Ingredient Library" },
  { href: "/compare", emoji: "⚖️", name: "X vs Y Comparisons" },
  { href: "/tools", emoji: "⚙️", name: "Free Tools" },
  { href: "/all-supplements", emoji: "📋", name: "View All" },
];

export function getTopic(slug) {
  return TOPICS.find((t) => t.slug === slug) || null;
}
