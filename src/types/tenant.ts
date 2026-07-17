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
  nav: NavLink[];
  footerGroups: FooterLinkGroup[];
  social: SocialLinks;
  /** Static category list for taxonomy routes/sections. */
  categories: Category[];
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
 * Client definition (`src/clients/<name>.ts`) — single source for BFF identity
 * (`clientName`, `label`) plus brand/copy/UI. Host mounts live in
 * `constants/tenants`. Theme CSS tokens: `src/data/themes/<themeKey>.json`.
 */
export type ClientDefinition = Omit<
  TenantConfig,
  "theme" | "siteUrl" | "pathPrefix"
> & {
  /** Optional override; normally set from theme JSON / API. */
  theme?: ThemeConfig;
};
