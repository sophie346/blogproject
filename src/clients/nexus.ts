import type { ClientDefinition } from "@/types/tenant";

/**
 * Nexus — red / black / white editorial theme.
 * CSS tokens live in src/data/themes/nexus.json (via loadTheme).
 */
const nexus: ClientDefinition = {
  // API identity comes from constants/tenants.ts (Host → clientName/label).
  // clientName for Nexus org: 1p0248qcm3j1k401
  clientName: "1p0248qcm3j1k401",
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
