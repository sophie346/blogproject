import type { ClientDefinition } from "@/types/tenant";

const oneauto: ClientDefinition = {
  clientName: "oneauto",
  label: "oneauto",
  brand: {
    name: "OneAuto",
    alternateName: "oneauto",
    tagline: "Stories, guides, and notes from the road ahead.",
    description:
      "Read the latest articles and insights from OneAuto — product updates, automotive know-how, and field notes.",
    author: "OneAuto",
    logo: "",
    locale: "en_US",
    language: "en-US",
  },
  // Theme tokens: src/data/themes/oneauto.json (via loadTheme)
  copy: {
    heroEyebrow: "Editorial · Automotive",
    heroTitle: "Dispatch from the garage and the road",
    heroSubtitle: "Stories, guides, and notes from the road ahead.",
    heroCta: "Browse latest stories",
    storiesEyebrow: "Latest",
    storiesHeading: "Stories worth the mileage",
    storiesDescription: "Curated reads on product, craft, and life behind the wheel.",
    footerTagline: "Field notes for builders and buyers on the move.",
    notFoundTitle: "This story isn’t on the map",
    notFoundMessage:
      "The page may have moved, or the slug doesn’t match a published post.",
    notFoundCta: "Back to OneAuto",
    emptyTitle: "No stories yet",
    emptyMessage: "Publish a blog for this website label in ChannelAdmin",
  },
  seo: {
    keywords: ["OneAuto", "blog", "automotive", "product updates"],
  },
  nav: [{ label: "Stories", href: "/#stories" }],
  footerGroups: [],
  social: {},
  categories: [],
  authors: [{ slug: "oneauto", name: "OneAuto" }],
  sections: {
    featured: false,
    categories: false,
    newsletter: false,
  },
};

export default oneauto;
