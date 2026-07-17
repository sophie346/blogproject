import type { Metadata } from "next";
import { estimateReadingTime } from "@/lib/blog-format";
import { slugify } from "@/lib/slug";
import { getSiteConfig } from "./config";
import { getValidImageUrl, resolvePostImage } from "./images";
import { getTenant } from "./tenant";
import type { BlogDetail, BlogListItem } from "@/types/blog";

/** Public site root (origin + pathPrefix), no trailing slash. */
export async function getSiteUrl() {
  const { siteUrl } = await getSiteConfig();
  return siteUrl.replace(/\/$/, "");
}

/**
 * Absolute URL for an *internal* app path (`/`, `/blog/slug`, `/feed.xml`).
 * Uses siteUrl as the mounted blog root (already includes pathPrefix).
 */
export async function absoluteUrl(appPath = "/") {
  const tenant = await getTenant();
  const base = tenant.siteUrl.replace(/\/$/, "");
  const prefix = tenant.pathPrefix || "";

  if (!appPath || appPath === "/") return `${base}/`;

  // Path relative to the mounted site root
  let relative: string;
  if (appPath.startsWith("/blog/")) {
    relative = appPath.slice("/blog".length); // /slug
  } else {
    relative = appPath.startsWith("/") ? appPath : `/${appPath}`;
  }

  // When site is at domain root, keep /blog/slug public shape for articles
  let url: string;
  if ((!prefix || prefix === "/") && appPath.startsWith("/blog/")) {
    url = `${base}${appPath}`;
  } else {
    url = `${base}${relative.startsWith("/") ? relative : `/${relative}`}`;
  }

  // Match next.config trailingSlash + WordPress permalinks (skip files).
  const leaf = url.split("?")[0].split("/").pop() || "";
  if (
    !url.includes("?") &&
    !url.endsWith("/") &&
    leaf &&
    !leaf.includes(".")
  ) {
    url = `${url}/`;
  }
  return url;
}

export async function getSocialSameAs() {
  const { social } = await getTenant();
  return [
    social.facebook,
    social.instagram,
    social.twitter,
    social.tiktok,
    social.linkedin,
  ]
    .map((value) => (value || "").trim())
    .filter(Boolean);
}

export async function getDefaultOgImage() {
  const tenant = await getTenant();
  return getValidImageUrl(tenant.seo.ogImage) || null;
}

export async function getSiteLogoUrl() {
  const tenant = await getTenant();
  return (
    getValidImageUrl(tenant.seo.siteLogo) ||
    getValidImageUrl(tenant.brand.logo) ||
    (await getDefaultOgImage())
  );
}

export function toIsoDate(value: string | null | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function parseKeywords(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function estimateWordCount(content: string | null | undefined) {
  const text = String(content ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

function imageMimeType(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".gif")) return "image/gif";
  if (clean.endsWith(".svg")) return "image/svg+xml";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  return "image/jpeg";
}

export async function resolveBlogImage(post: {
  featuredImage?: string;
  seo?: Record<string, unknown> | null;
}) {
  const og =
    typeof post.seo?.openGraphImageUrl === "string"
      ? post.seo.openGraphImageUrl
      : undefined;
  return (
    resolvePostImage({
      featuredImage: post.featuredImage,
      seo: { openGraphImageUrl: og },
    }) || (await getDefaultOgImage())
  );
}

export async function resolveBlogSeo(post: BlogDetail | BlogListItem) {
  const siteConfig = await getSiteConfig();
  const seo = (post.seo || {}) as Record<string, unknown>;
  const title =
    String(seo.metaTitle || seo.title || seo.openGraphTitle || post.title || "")
      .trim() || siteConfig.name;
  const description =
    String(
      seo.metaDescription ||
        seo.description ||
        seo.openGraphDescription ||
        post.excerpt ||
        siteConfig.description
    ).trim() || siteConfig.description;
  const ogTitle =
    String(seo.openGraphTitle || seo.metaTitle || seo.title || post.title || "")
      .trim() || title;
  const ogDescription =
    String(
      seo.openGraphDescription ||
        seo.metaDescription ||
        seo.description ||
        post.excerpt ||
        description
    ).trim() || description;
  const keywords = parseKeywords(seo.metaKeywords);
  const image = await resolveBlogImage(post);
  const twitterImage =
    getValidImageUrl(
      typeof seo.twitterCardImageUrl === "string"
        ? seo.twitterCardImageUrl
        : undefined
    ) || image;
  const twitterTitle =
    String(seo.twitterCardTitle || ogTitle || title).trim() || ogTitle;
  const twitterDescription =
    String(seo.twitterCardDescription || ogDescription || description).trim() ||
    ogDescription;
  const published = toIsoDate(post.publishedDate);
  const modified = toIsoDate(post.updatedDate) || published;
  const noindex = Boolean(seo.noindex);
  const nofollow = Boolean(seo.nofollow);

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    twitterImage,
    keywords,
    image,
    published,
    modified,
    noindex,
    nofollow,
  };
}

const indexRobots: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const noindexRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export async function buildHomeMetadata(options: {
  page: number;
  totalPages: number;
}): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const tenant = await getTenant();
  const pageSeo = tenant.pageSeo || {};
  const { page } = options;
  const isPaginated = page > 1;
  const canonicalPath = isPaginated ? `/?page=${page}` : "/";
  const canonical = await absoluteUrl(canonicalPath);

  const baseTitle =
    String(
      pageSeo.metaTitle || pageSeo.title || `${siteConfig.name} Blog`
    ).trim() || `${siteConfig.name} Blog`;
  const title = isPaginated ? `${baseTitle} — Page ${page}` : baseTitle;
  const description =
    String(
      pageSeo.metaDescription ||
        pageSeo.description ||
        siteConfig.description ||
        ""
    ).trim() || siteConfig.description;

  const ogTitle =
    String(pageSeo.openGraphTitle || baseTitle || siteConfig.name).trim() ||
    siteConfig.name;
  const ogDescription =
    String(pageSeo.openGraphDescription || description).trim() || description;
  const twitterTitle =
    String(pageSeo.twitterCardTitle || ogTitle).trim() || ogTitle;
  const twitterDescription =
    String(pageSeo.twitterCardDescription || ogDescription).trim() ||
    ogDescription;

  const ogImage =
    getValidImageUrl(pageSeo.openGraphImageUrl) ||
    (await getDefaultOgImage());
  const twitterImage =
    getValidImageUrl(pageSeo.twitterCardImageUrl) || ogImage;

  const keywords =
    parseKeywords(pageSeo.metaKeywords).length > 0
      ? parseKeywords(pageSeo.metaKeywords)
      : tenant.seo.keywords;

  const robots =
    pageSeo.noindex || pageSeo.nofollow
      ? {
          index: !pageSeo.noindex,
          follow: !pageSeo.nofollow,
        }
      : indexRobots;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    robots,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": await absoluteUrl("/feed.xml"),
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: ogTitle,
      description: ogDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              type: imageMimeType(ogImage),
              alt: ogTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card:
        (pageSeo.twitterCardType as "summary_large_image" | "summary") ||
        "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export async function getPaginationHref(page: number) {
  const base = await getSiteUrl();
  if (page <= 1) return `${base}/`;
  return `${base}/?page=${page}`;
}

export async function getPaginationRelLinks(page: number, totalPages: number) {
  return {
    prev: page > 1 ? await getPaginationHref(page - 1) : null,
    next: page < totalPages ? await getPaginationHref(page + 1) : null,
  };
}

export async function buildArticleMetadata(post: BlogDetail): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const tenant = await getTenant();
  const seo = await resolveBlogSeo(post);
  const url = await absoluteUrl(`/blog/${post.slug}`);
  const isPublic = String(post.status || "published").toLowerCase() === "published";
  const readingMinutes = estimateReadingTime(post.content || post.excerpt);
  const facebook = (tenant.social.facebook || "").trim();
  const robots =
    !isPublic || seo.noindex || seo.nofollow
      ? {
          index: isPublic && !seo.noindex,
          follow: isPublic && !seo.nofollow,
        }
      : indexRobots;

  return {
    title: {
      absolute: `${seo.title} · ${siteConfig.name}`,
    },
    description: seo.description,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    authors: [
      {
        name: siteConfig.author,
        url: await absoluteUrl(
          `/author/${slugify(siteConfig.author) || "author"}`
        ),
      },
    ],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    category: "Blog",
    robots,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": await absoluteUrl("/feed.xml"),
      },
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: seo.ogTitle,
      description: seo.ogDescription,
      publishedTime: seo.published,
      modifiedTime: seo.modified,
      authors: [siteConfig.author],
      tags: seo.keywords.length ? seo.keywords : undefined,
      images: seo.image
        ? [
            {
              url: seo.image,
              width: 1200,
              height: 630,
              type: imageMimeType(seo.image),
              alt: seo.ogTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: seo.twitterImage ? [seo.twitterImage] : undefined,
    },
    other: {
      author: siteConfig.author,
      "twitter:label1": "Written by",
      "twitter:data1": siteConfig.author,
      "twitter:label2": "Est. reading time",
      "twitter:data2": `${readingMinutes} minute${readingMinutes === 1 ? "" : "s"}`,
      ...(facebook ? { "article:publisher": facebook } : {}),
      ...(seo.published ? { "article:published_time": seo.published } : {}),
      ...(seo.modified ? { "article:modified_time": seo.modified } : {}),
    },
  };
}

async function organizationNode() {
  const siteConfig = await getSiteConfig();
  const siteUrl = await absoluteUrl("/");
  const logo = await getSiteLogoUrl();
  const sameAs = await getSocialSameAs();

  return {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteUrl,
    ...(logo
      ? {
          logo: {
            "@type": "ImageObject",
            inLanguage: siteConfig.language,
            "@id": `${siteUrl}#/schema/logo/image/`,
            url: logo,
            contentUrl: logo,
            caption: siteConfig.name,
          },
          image: { "@id": `${siteUrl}#/schema/logo/image/` },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

async function websiteNode() {
  const siteConfig = await getSiteConfig();
  const siteUrl = await absoluteUrl("/");
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteUrl}#organization` },
    inLanguage: siteConfig.language,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/?s={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };
}

async function personNode() {
  const siteConfig = await getSiteConfig();
  const authorSlug = slugify(siteConfig.author) || "author";
  const authorUrl = await absoluteUrl(`/author/${authorSlug}`);
  return {
    "@type": "Person",
    "@id": `${authorUrl}#/schema/person/author`,
    name: siteConfig.author,
    url: authorUrl,
  };
}

export async function buildHomeJsonLd(options: {
  page: number;
  posts: BlogListItem[];
}) {
  const siteConfig = await getSiteConfig();
  const { page, posts } = options;
  const siteUrl = await absoluteUrl("/");
  const canonical = await absoluteUrl(page > 1 ? `/?page=${page}` : "/");
  const title =
    page > 1
      ? `${siteConfig.name} Blog — Page ${page}`
      : `${siteConfig.name} Blog`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": canonical,
      url: canonical,
      name: title,
      isPartOf: { "@id": `${siteUrl}#website` },
      about: { "@id": `${siteUrl}#organization` },
      description: siteConfig.description,
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
      inLanguage: siteConfig.language,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
      ],
    },
    await websiteNode(),
    await organizationNode(),
  ];

  if (posts.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${canonical}#itemlist`,
      itemListElement: await Promise.all(
        posts.map(async (post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: await absoluteUrl(`/blog/${post.slug}`),
          name: post.title,
        }))
      ),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export async function buildArticleJsonLd(post: BlogDetail) {
  const siteConfig = await getSiteConfig();
  const seo = await resolveBlogSeo(post);
  const siteUrl = await absoluteUrl("/");
  const url = await absoluteUrl(`/blog/${post.slug}`);
  const wordCount = estimateWordCount(post.content || post.excerpt);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      isPartOf: { "@id": url },
      author: {
        name: siteConfig.author,
        "@id": `${siteUrl}#/schema/person/author`,
      },
      headline: post.title,
      description: seo.description,
      datePublished: seo.published,
      dateModified: seo.modified,
      mainEntityOfPage: { "@id": url },
      wordCount: wordCount || undefined,
      publisher: { "@id": `${siteUrl}#organization` },
      ...(seo.image
        ? {
            image: { "@id": `${url}#primaryimage` },
            thumbnailUrl: seo.image,
          }
        : {}),
      ...(seo.keywords.length ? { keywords: seo.keywords } : {}),
      inLanguage: siteConfig.language,
    },
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: `${seo.title} · ${siteConfig.name}`,
      isPartOf: { "@id": `${siteUrl}#website` },
      ...(seo.image
        ? {
            primaryImageOfPage: { "@id": `${url}#primaryimage` },
            image: { "@id": `${url}#primaryimage` },
            thumbnailUrl: seo.image,
          }
        : {}),
      datePublished: seo.published,
      dateModified: seo.modified,
      description: seo.description,
      breadcrumb: { "@id": `${url}#breadcrumb` },
      inLanguage: siteConfig.language,
      potentialAction: [
        {
          "@type": "ReadAction",
          target: [url],
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: post.title,
        },
      ],
    },
    await websiteNode(),
    await organizationNode(),
    await personNode(),
  ];

  if (seo.image) {
    graph.splice(2, 0, {
      "@type": "ImageObject",
      inLanguage: siteConfig.language,
      "@id": `${url}#primaryimage`,
      url: seo.image,
      contentUrl: seo.image,
      width: 1200,
      height: 630,
      caption: post.title,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
