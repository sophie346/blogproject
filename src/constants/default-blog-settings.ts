import type { ClientDefinition } from "@/types/tenant";

/** Fallback when ChannelAdmin has no blog settings saved yet. */
export const DEFAULT_BLOG_SETTINGS: Omit<
  ClientDefinition,
  "clientName" | "label"
> = {
  publicPath: "/blog",
  brand: {
    name: "Blog",
    alternateName: "blog",
    tagline: "Stories worth reading.",
    description: "Latest articles and updates.",
    author: "Editorial",
    logo: "",
    locale: "en_US",
    language: "en-US",
  },
  copy: {
    heroEyebrow: "Editorial",
    heroTitle: "Latest stories",
    heroSubtitle: "Product updates, guides, and notes from the field.",
    heroCta: "Browse latest stories",
    storiesEyebrow: "Latest",
    storiesHeading: "Latest stories",
    storiesDescription: "Fresh reads from the editorial desk.",
    footerTagline: "Clarity over clutter.",
    notFoundTitle: "This story isn’t here",
    notFoundMessage:
      "The page may have moved, or the slug doesn’t match a published post.",
    notFoundCta: "Back to home",
    emptyTitle: "No stories yet",
    emptyMessage: "Publish a blog for this website in ChannelAdmin",
  },
  seo: {
    keywords: [],
  },
  pageSeo: {
    title: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    focusKeyword: "",
    openGraphTitle: "",
    openGraphDescription: "",
    openGraphImageUrl: "",
    openGraphType: "website",
    twitterCardTitle: "",
    twitterCardDescription: "",
    twitterCardImageUrl: "",
    twitterCardType: "summary_large_image",
    category: "",
    faqItems: [],
    schemaMarkup: "",
    noindex: false,
    nofollow: false,
  },
  nav: [{ label: "Stories", href: "/#stories" }],
  footerGroups: [],
  social: {},
  categories: [],
  authors: [{ slug: "editorial", name: "Editorial" }],
  sections: {
    featured: false,
    categories: false,
    newsletter: false,
  },
  theme: {
    id: "default",
    tokens: {},
    customCss: "",
  },
};
