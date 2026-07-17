import axios from "axios";
import { BLOG_API_BASE } from "@/constants/tenants";
import { DEFAULT_BLOG_SETTINGS } from "@/constants/default-blog-settings";
import type { ClientDefinition } from "@/types/tenant";
import type { ThemeConfig, ThemeId } from "@/types/theme";

type BlogSettingsResponse = {
  error?: boolean;
  label?: string;
  data?: Partial<ClientDefinition> & {
    theme?: ThemeConfig;
  };
};

function asThemeId(value: unknown): ThemeId {
  const id = String(value || "default").trim().toLowerCase();
  if (id === "modern" || id === "luxury" || id === "default") return id;
  return "default";
}

function mergeSettings(
  raw: BlogSettingsResponse["data"] | undefined
): Omit<ClientDefinition, "clientName" | "label"> {
  const src = raw && typeof raw === "object" ? raw : {};
  const brand = { ...DEFAULT_BLOG_SETTINGS.brand, ...(src.brand || {}) };
  const copy = { ...DEFAULT_BLOG_SETTINGS.copy, ...(src.copy || {}) };
  const pageSeo = {
    ...(DEFAULT_BLOG_SETTINGS.pageSeo || {}),
    ...(src.pageSeo || {}),
  };
  const keywordsFromPage = String(pageSeo.metaKeywords || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const seo = {
    ...DEFAULT_BLOG_SETTINGS.seo,
    ...(src.seo || {}),
    keywords: Array.isArray(src.seo?.keywords) && src.seo.keywords.length
      ? src.seo.keywords.map(String).filter(Boolean)
      : keywordsFromPage.length
        ? keywordsFromPage
        : DEFAULT_BLOG_SETTINGS.seo.keywords,
    ogImage:
      src.seo?.ogImage ||
      pageSeo.openGraphImageUrl ||
      DEFAULT_BLOG_SETTINGS.seo.ogImage ||
      "",
    siteLogo:
      src.seo?.siteLogo ||
      brand.logo ||
      DEFAULT_BLOG_SETTINGS.seo.siteLogo ||
      "",
  };
  const social = { ...DEFAULT_BLOG_SETTINGS.social, ...(src.social || {}) };
  const sections = {
    ...DEFAULT_BLOG_SETTINGS.sections,
    ...(src.sections || {}),
  };
  const themeId = asThemeId(src.theme?.id);
  const themeTokens =
    src.theme?.tokens && typeof src.theme.tokens === "object"
      ? src.theme.tokens
      : {};

  const authors =
    Array.isArray(src.authors) && src.authors.length > 0
      ? src.authors
      : brand.name
        ? [
            {
              slug:
                String(brand.alternateName || brand.name)
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, "-") || "editorial",
              name: brand.name,
            },
          ]
        : DEFAULT_BLOG_SETTINGS.authors;

  if (!brand.name?.trim()) {
    brand.name = DEFAULT_BLOG_SETTINGS.brand.name;
  }

  let publicPath = String(
    (src as { publicPath?: string }).publicPath ||
      DEFAULT_BLOG_SETTINGS.publicPath ||
      "/blog"
  ).trim();
  if (!publicPath.startsWith("/")) publicPath = `/${publicPath}`;
  publicPath = publicPath.replace(/\/+$/, "") || "/blog";

  return {
    publicPath,
    brand,
    copy,
    seo,
    pageSeo,
    nav:
      Array.isArray(src.nav) && src.nav.length > 0
        ? src.nav
        : DEFAULT_BLOG_SETTINGS.nav,
    footerGroups: Array.isArray(src.footerGroups)
      ? src.footerGroups
      : DEFAULT_BLOG_SETTINGS.footerGroups,
    social,
    categories: Array.isArray(src.categories) ? src.categories : [],
    authors,
    sections: {
      featured: Boolean(sections.featured),
      categories: Boolean(sections.categories),
      newsletter: Boolean(sections.newsletter),
    },
    theme: {
      id: themeId,
      tokens: themeTokens,
      customCss: String(
        (src.theme && typeof src.theme === "object"
          ? (src.theme as { customCss?: string }).customCss
          : "") || ""
      ),
    },
  };
}

/**
 * Load site-level blog settings from the storefront BFF.
 * Falls back to defaults when unset or unreachable.
 */
export async function fetchBlogSettings(
  clientName: string,
  label: string,
  authToken = ""
): Promise<Omit<ClientDefinition, "clientName" | "label">> {
  if (!clientName || !label) {
    return { ...DEFAULT_BLOG_SETTINGS };
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      clientname: clientName,
      label,
    };
    if (authToken) {
      headers.Authorization = authToken.startsWith("Bearer ")
        ? authToken
        : `Bearer ${authToken}`;
    }

    // Prefer shared helper when available; avoid importing tenant (circular).
    const base = BLOG_API_BASE.replace(/\/$/, "");
    const res = await axios.get<BlogSettingsResponse>(`${base}/prod/blog-settings`, {
      params: { label },
      headers,
      timeout: 15000,
      validateStatus: () => true,
    });

    if (res.status >= 200 && res.status < 300 && !res.data?.error) {
      return mergeSettings(res.data?.data);
    }
  } catch {
    // fall through to defaults
  }

  return { ...DEFAULT_BLOG_SETTINGS };
}
