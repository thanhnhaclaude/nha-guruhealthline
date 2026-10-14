// Health goals used for the category grid, nav and topic hub pages (/<slug>).
// `icon` keys map to components/Icon.js.
export const TOPICS = [
  { slug: "weight-loss", emoji: "⚖️", name: "Weight Loss", icon: "scale", blurb: "What helps with appetite, metabolism and body composition, and what's mostly marketing." },
  { slug: "brain-health", emoji: "🧠", name: "Brain & Memory", icon: "brain", blurb: "Focus, memory and mental energy: which nootropics and nutrients have human evidence." },
  { slug: "blood-sugar", emoji: "🩸", name: "Blood Sugar", icon: "drop", blurb: "Supplements studied for glucose control, and how they interact with diabetes medication." },
  { slug: "mens-health", emoji: "💪", name: "Men's Health", icon: "male", blurb: "Testosterone, prostate, fertility and performance, with realistic expectations." },
  { slug: "womens-health", emoji: "🌸", name: "Women's Health", icon: "female", blurb: "Iron, folate, bone health, PMS and menopause support across life stages." },
  { slug: "gut-health", emoji: "🦠", name: "Gut Health", icon: "gut", blurb: "Probiotics, fiber and digestive support: which strains match which problems." },
  { slug: "joints", emoji: "🦴", name: "Joints & Pain", icon: "bone", blurb: "Glucosamine, collagen, turmeric and omega-3s for stiff, achy joints." },
  { slug: "sleep", emoji: "😴", name: "Sleep", icon: "moon", blurb: "Magnesium, melatonin, glycine and herbal options for falling and staying asleep." },
  { slug: "heart-health", emoji: "❤️", name: "Heart Health", icon: "heart", blurb: "Omega-3s, CoQ10, fiber and more for cholesterol, blood pressure and circulation." },
  { slug: "stress-mood", emoji: "🧘", name: "Stress & Mood", icon: "smile", blurb: "Adaptogens, L-theanine and nutrients linked to stress, anxiety and low mood." },
  { slug: "energy", emoji: "⚡", name: "Energy & Fatigue", icon: "bolt", blurb: "B12, iron, creatine and other fixes for tiredness, starting with what to test." },
  { slug: "immune-system", emoji: "🛡️", name: "Immune Support", icon: "shield", blurb: "Vitamin D, zinc, vitamin C and elderberry: prevention vs. shortening a cold." },
  { slug: "bone-health", emoji: "🦴", name: "Bone Health", icon: "bone", blurb: "Calcium, vitamin D, vitamin K2 and magnesium for stronger bones." },
  { slug: "fitness", emoji: "🏋️", name: "Fitness & Muscle", icon: "dumbbell", blurb: "Creatine, protein and other performance supplements with strong evidence." },
  { slug: "vision", emoji: "👁️", name: "Vision & Eyes", icon: "eye", blurb: "Lutein, zeaxanthin and the AREDS2 formula for eye health." },
  { slug: "hair-skin-nails", emoji: "💅", name: "Hair, Skin & Nails", icon: "sparkle", blurb: "Biotin, collagen and zinc: when they help and when they don't." },
  { slug: "longevity", emoji: "⏳", name: "Healthy Aging", icon: "hourglass", blurb: "NAD+ precursors, omega-3s and the basics that matter most after 50." },
  { slug: "menopause", emoji: "🌺", name: "Menopause", icon: "flower", blurb: "Hot flashes, sleep and bone loss: what's been tested in trials." },
];

export function getTopic(slug) {
  return TOPICS.find((t) => t.slug === slug) || null;
}
