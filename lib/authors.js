// Replace these with real people before launch. For health (YMYL) topics,
// Google's guidance asks you to show who wrote the content and why they are
// qualified — never invent names or credentials.
export const AUTHORS = {
  editorial: {
    name: "GuruHealthline Editorial Team",
    initials: "GH",
    role: "Research & writing",
    bio: "Our writers summarize peer-reviewed research and official sources such as the NIH Office of Dietary Supplements. Every guide lists its sources and is updated when the evidence changes.",
    url: "/about",
  },
};

export function getAuthor(id) {
  return AUTHORS[id] || AUTHORS.editorial;
}
