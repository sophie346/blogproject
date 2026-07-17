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
  /** Org id sent as the `clientname` header. */
  clientName: string;
  /** Website label — query param + `label` header for blog scoping. */
  label: string;
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

/** A client definition file exports this. Runtime identity (clientName,
 * label) is merged from env by the tenant loader. Theme CSS tokens are
 * loaded from `src/data/themes/<client>.json` (later: API) via loadTheme. */
export type ClientDefinition = Omit<
  TenantConfig,
  "clientName" | "label" | "theme"
> & {
  clientName?: string;
  label?: string;
  /** Optional override; normally set from theme JSON / API. */
  theme?: ThemeConfig;
};
