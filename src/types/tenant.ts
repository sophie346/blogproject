import type { Author, Category } from "./category";
import type { ThemeConfig } from "./theme";

export type NavLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  title: string;
  links: NavLink[];
};

/** Storefront-style contact column (Nexus / ODB / OPH). */
export type FooterContact = {
  addressLines?: string[];
  email?: string;
  phone?: string;
  hours?: string[];
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  linkedin?: string;
};

export type TenantBrand = {
  name: string;
  alternateName?: string;
  tagline: string;
  description: string;
  author: string;
  /** Absolute or root-relative logo URL. Falls back to text logo if empty. */
  logo?: string;
  locale: string;
  language: string;
};

export type TenantCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  storiesEyebrow: string;
  storiesHeading: string;
  storiesDescription: string;
  footerTagline: string;
  notFoundTitle: string;
  notFoundMessage: string;
  notFoundCta: string;
  emptyTitle: string;
  emptyMessage: string;
};

export type TenantSeo = {
  keywords: string[];
  ogImage?: string;
  siteLogo?: string;
};

/** Full homepage SEO (ChannelAdmin SEOTab / pageSeo). */
export type TenantPageSeo = {
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeyword?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImageUrl?: string;
  openGraphType?: string;
  twitterCardTitle?: string;
  twitterCardDescription?: string;
  twitterCardImageUrl?: string;
  twitterCardType?: string;
  category?: string;
  faqItems?: { question: string; answer: string }[];
  schemaMarkup?: string;
  noindex?: boolean;
  nofollow?: boolean;
};

/** Full resolved tenant configuration used across the app. */
export type TenantConfig = {
  /** Organization id — BFF/admin header `clientname` (one org, many sites). */
  clientName: string;
  /** Website label from B2B Website Setup — BFF `label` header + query. */
  label: string;
  /** Public site root for SEO (origin + pathPrefix, no trailing slash). */
  siteUrl: string;
  /** Mount prefix (`""` for `/`, or `blog` / `blogs` without leading slash stored normalized). */
  pathPrefix: string;
  brand: TenantBrand;
  theme: ThemeConfig;
  copy: TenantCopy;
  seo: TenantSeo;
  /** Homepage (blog list) SEO — mirrors ChannelAdmin SEOTab. */
  pageSeo?: TenantPageSeo;
  nav: NavLink[];
  footerGroups: FooterLinkGroup[];
  footerContact?: FooterContact;
  social: SocialLinks;
  /** Static category list for taxonomy routes/sections. */
  categories: Category[];
  /** Optional curated tag vocabulary from ChannelAdmin. */
  tags?: Category[];
  /** Known authors; first entry is the default post author. */
  authors: Author[];
  /** Feature toggles for optional home sections. */
  sections: {
    featured: boolean;
    categories: boolean;
    newsletter: boolean;
  };
};

/**
 * Blog settings payload from ChannelAdmin / BFF (`/prod/blog-settings`).
 * Host → `clientName` + `label` mounts live in `constants/tenants`.
 */
export type ClientDefinition = Omit<
  TenantConfig,
  "theme" | "siteUrl" | "pathPrefix"
> & {
  theme?: ThemeConfig;
  /** Admin-configured public mount path (e.g. /blog, /blogstemp). */
  publicPath?: string;
};
