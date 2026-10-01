// All page text lives here. "Nacre" is a fictional placeholder brand: none of this
// copy comes from the original site. Lines are roughly the original's lengths so the
// layout wraps in the same places.

export const site = {
  brand: "Nacre",
  title: "Nacre: a design study",
  description:
    "An unofficial design study of kerra.earth, rebuilt with original placeholder content. Not affiliated.",
};

export const nav = {
  links: [
    { label: "Why Nacre", href: "#intro" },
    { label: "The process", href: "#technology" },
    { label: "Stewardship", href: "#sustainability" },
  ],
  cta: { label: "Start a project", href: "#contact" },
};

export const hero = {
  headline: ["Waste, made", "mineral"],
  readout: ["Calcite sample", "Lot ID N4C-0927-QX", "Purity 99.2%"],
};

export const intro = {
  statement:
    "is a materials studio that turns discarded seashells into high-purity minerals for coatings, cosmetics, and the plastics we use every day.",
  lead: "We clean, heat and mill shell waste from coastal fisheries into fine powders that replace quarried fillers.",
  partnersLabel: "Supported by",
  partners: ["Placeholder partner one", "Placeholder partner two", "Placeholder partner three", "Placeholder partner four"],
};

export const technology = {
  eyebrow: "Shell-to-mineral process",
  heading: "Mineral Refining Line",
  paragraphs: [
    "Each batch of shells is sorted, washed and gently heated, then milled to a grain size tuned to the product it will end up in, from paint to skincare.",
    "Inline sensors track whiteness, purity and particle size, so every bag that leaves the line matches its spec sheet.",
  ],
  visualLabel: "Placeholder visual: a pulsing lattice of mineral grains",
};

export const markets = {
  heading: "Applications",
  paragraphs: [
    "Fine mineral powders for things people touch every day.",
    "We tune grain and purity to each use, from paint and paper to skincare and packaging.",
  ],
  cta: { label: "Start a project", href: "#contact" },
  // 36 labels, 10 degrees apart around the wheel. Scrolling selects them in order,
  // starting at index 9.
  wheel: [
    "Textiles", "Detergents", "Polishes", "Composites", "Footwear", "Flooring",
    "Bioplastics", "Glass", "Tiles", "Paints", "Primers", "Paper",
    "Packaging", "Toothpaste", "Sunscreen", "Face powder", "Ceramics", "Glazes",
    "Cement", "Mortar", "Plastics", "Rubber", "Inks", "Pigments",
    "Sealants", "Antacids", "Supplements", "Animal feed", "Soil care", "Water filters",
    "Putty", "Caulk", "Chalk", "Grout", "Films", "Gloss paper",
  ],
};

export const why = {
  eyebrow: "Why shells",
  heading:
    "Shells are a mineral the ocean has already made, and seafood kitchens throw them out by the ton.",
  body: "We collect from fisheries on three coasts, so supply never rests on one harbor.",
  stat: { value: "6x", label: ["Lower footprint", "than quarried lime"] },
};

export const sustainability = {
  eyebrow: "Stewardship",
  heading: "Every tonne we mill is a tonne left unmined.",
  paragraphs: [
    "Shell waste, refined at industrial scale near the coast.",
    "Renewable every season, low in heavy metals, and cheaper to process than fresh quarry rock.",
  ],
  visualLabel: "Placeholder visual: layered pearly rings",
};

export const contact = {
  heading: "Work With Us",
  tagline: ["Shells in.", "Minerals out.", "Nothing quarried.", "Still a placeholder."],
  emailPrompt: "Rather write directly?",
  email: "hello@nacre.example",
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "company", label: "Company", type: "text" },
  ],
  message: { name: "message", label: "Message" },
  submit: "Send",
  notice: "This is a design study, so nothing was sent.",
};

export const footer = {
  disclaimer: "Unofficial design study of kerra.earth. Not affiliated.",
  links: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of use", href: "#" },
  ],
  social: { label: "Social profile (placeholder)", href: "#" },
};
