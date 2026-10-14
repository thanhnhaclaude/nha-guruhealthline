// Health goals used for the category grid, nav and topic hub pages (/<slug>).
// `icon` keys map to components/Icon.js.
export const TOPICS = [
  { slug: "weight-loss", name: "Weight Loss", icon: "scale", blurb: "What helps with appetite, metabolism and body composition, and what's mostly marketing." },
  { slug: "brain-health", name: "Brain & Memory", icon: "brain", blurb: "Focus, memory and mental energy: which nootropics and nutrients have human evidence." },
  { slug: "blood-sugar", name: "Blood Sugar", icon: "drop", blurb: "Supplements studied for glucose control, and how they interact with diabetes medication." },
  { slug: "mens-health", name: "Men's Health", icon: "male", blurb: "Testosterone, prostate, fertility and performance, with realistic expectations." },
  { slug: "womens-health", name: "Women's Health", icon: "female", blurb: "Iron, folate, bone health, PMS and menopause support across life stages." },
  { slug: "gut-health", name: "Gut Health", icon: "gut", blurb: "Probiotics, fiber and digestive support: which strains match which problems." },
  { slug: "joints", name: "Joints & Pain", icon: "bone", blurb: "Glucosamine, collagen, turmeric and omega-3s for stiff, achy joints." },
  { slug: "sleep", name: "Sleep", icon: "moon", blurb: "Magnesium, melatonin, glycine and herbal options for falling and staying asleep." },
  { slug: "heart-health", name: "Heart Health", icon: "heart", blurb: "Omega-3s, CoQ10, fiber and more for cholesterol, blood pressure and circulation." },
  { slug: "stress-mood", name: "Stress & Mood", icon: "smile", blurb: "Adaptogens, L-theanine and nutrients linked to stress, anxiety and low mood." },
  { slug: "energy", name: "Energy & Fatigue", icon: "bolt", blurb: "B12, iron, creatine and other fixes for tiredness, starting with what to test." },
  { slug: "immune-system", name: "Immune Support", icon: "shield", blurb: "Vitamin D, zinc, vitamin C and elderberry: prevention vs. shortening a cold." },
  { slug: "bone-health", name: "Bone Health", icon: "bone", blurb: "Calcium, vitamin D, vitamin K2 and magnesium for stronger bones." },
  { slug: "fitness", name: "Fitness & Muscle", icon: "dumbbell", blurb: "Creatine, protein and other performance supplements with strong evidence." },
  { slug: "vision", name: "Vision & Eyes", icon: "eye", blurb: "Lutein, zeaxanthin and the AREDS2 formula for eye health." },
  { slug: "hair-skin-nails", name: "Hair, Skin & Nails", icon: "sparkle", blurb: "Biotin, collagen and zinc: when they help and when they don't." },
  { slug: "longevity", name: "Healthy Aging", icon: "hourglass", blurb: "NAD+ precursors, omega-3s and the basics that matter most after 50." },
  { slug: "menopause", name: "Menopause", icon: "flower", blurb: "Hot flashes, sleep and bone loss: what's been tested in trials." },
];

export function getTopic(slug) {
  return TOPICS.find((t) => t.slug === slug) || null;
}
