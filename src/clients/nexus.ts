import type { ClientDefinition } from "@/types/tenant";

/**
 * Nexus — red / black / white editorial theme.
 * Uses the existing modern hero + shared card/layout components;
 * color comes entirely from theme tokens.
 */
const nexus: ClientDefinition = {
  clientName: "nexus",
  label: "nexus",
  brand: {
    name: "Nexus",
    alternateName: "nexus",
    tagline: "Signal in the noise. Stories that cut through.",
    description:
      "Nexus publishes sharp takes on product, culture, and the systems that shape modern life.",
    author: "Nexus",
    logo: "",
    locale: "en_US",
    language: "en-US",
  },
  theme: {
    id: "modern",
    tokens: {
      ink: "#050505",
      inkSoft: "#121212",
      steel: "#a3a3a3",
      steelBright: "#e5e5e5",
      amber: "#e11d2e",
      amberSoft: "#ff4d5a",
      fog: "#ffffff",
      fogMuted: "#c4c4c4",
      line: "rgba(255, 255, 255, 0.12)",
      glow: "rgba(225, 29, 46, 0.28)",
    },
  },
  copy: {
    heroEyebrow: "Editorial · Nexus",
    heroTitle: "Stories that cut through the noise",
    heroSubtitle: "Signal in the noise. Product, culture, and systems worth your attention.",
    heroCta: "Browse latest stories",
    storiesEyebrow: "Latest",
    storiesHeading: "Latest stories",
    storiesDescription: "Fresh reads on product, culture, and the systems that shape modern life.",
    footerTagline: "Nexus — clarity over clutter.",
    notFoundTitle: "This story isn’t here",
    notFoundMessage:
      "The page may have moved, or the slug doesn’t match a published post.",
    notFoundCta: "Back to Nexus",
    emptyTitle: "No stories yet",
    emptyMessage: "Publish a blog for this website label in ChannelAdmin",
  },
  seo: {
    keywords: ["Nexus", "blog", "editorial", "culture", "product"],
  },
  nav: [
    { label: "Stories", href: "/#stories" },
    { label: "Categories", href: "/#categories" },
    { label: "Newsletter", href: "/#newsletter" },
  ],
  footerGroups: [
    {
      title: "Explore",
      links: [
        { label: "Stories", href: "/#stories" },
        { label: "Categories", href: "/#categories" },
        { label: "Home", href: "/" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/#stories" },
        { label: "Contact", href: "/#newsletter" },
      ],
    },
  ],
  social: {},
  categories: [],
  authors: [{ slug: "nexus", name: "Nexus" }],
  sections: {
    featured: false,
    categories: true,
    newsletter: true,
  },
};

export default nexus;
