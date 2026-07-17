import type { Metadata } from "next";
import { estimateReadingTime } from "@/services/blogs";
import { siteConfig } from "./config";
import { getValidImageUrl, resolvePostImage } from "./images";
import { getTenant } from "./tenant";
import type { BlogDetail, BlogListItem } from "@/types/blog";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSocialSameAs() {
  return [
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_TWITTER_URL,
    process.env.NEXT_PUBLIC_TIKTOK_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
  ]
    .map((value) => (value || "").trim())
    .filter(Boolean);
}

export function getDefaultOgImage() {
  return (
    getValidImageUrl(process.env.NEXT_PUBLIC_OG_IMAGE) ||
    getValidImageUrl(getTenant().seo.ogImage) ||
    null
  );
}

export function getSiteLogoUrl() {
  return (
    getValidImageUrl(process.env.NEXT_PUBLIC_SITE_LOGO) ||
    getValidImageUrl(getTenant().seo.siteLogo) ||
    getValidImageUrl(getTenant().brand.logo) ||
    getDefaultOgImage()
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

export function resolveBlogImage(post: {
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
    }) || getDefaultOgImage()
  );
}

export function resolveBlogSeo(post: BlogDetail | BlogListItem) {
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
  const image = resolveBlogImage(post);
  const published = toIsoDate(post.publishedDate);
  const modified = toIsoDate(post.updatedDate) || published;

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    keywords,
    image,
    published,
    modified,
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

export function buildHomeMetadata(options: {
  page: number;
  totalPages: number;
}): Metadata {
  const { page } = options;
  const isPaginated = page > 1;
  const canonicalPath = isPaginated ? `/?page=${page}` : "/";
  const canonical = absoluteUrl(canonicalPath);
  const title = isPaginated
    ? `${siteConfig.name} Blog — Page ${page}`
    : `${siteConfig.name} Blog`;
  const description = siteConfig.description;
  const ogImage = getDefaultOgImage();
  const keywords = getTenant().seo.keywords;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    robots: indexRobots,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": absoluteUrl("/feed.xml"),
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              type: imageMimeType(ogImage),
              alt: siteConfig.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export function getPaginationHref(page: number) {
  if (page <= 1) return absoluteUrl("/");
  return absoluteUrl(`/?page=${page}`);
}

export function getPaginationRelLinks(page: number, totalPages: number) {
  return {
    prev: page > 1 ? getPaginationHref(page - 1) : null,
    next: page < totalPages ? getPaginationHref(page + 1) : null,
  };
}

export function buildArticleMetadata(post: BlogDetail): Metadata {
  const seo = resolveBlogSeo(post);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const isPublic = String(post.status || "published").toLowerCase() === "published";
  const readingMinutes = estimateReadingTime(post.content || post.excerpt);
  const facebook = (process.env.NEXT_PUBLIC_FACEBOOK_URL || "").trim();

  return {
    title: {
      absolute: `${seo.title} · ${siteConfig.name}`,
    },
    description: seo.description,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    authors: [{ name: siteConfig.author, url: absoluteUrl("/") }],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    category: "Blog",
    robots: isPublic ? indexRobots : noindexRobots,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": absoluteUrl("/feed.xml"),
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
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.image ? [seo.image] : undefined,
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

function organizationNode() {
  const siteUrl = absoluteUrl("/");
  const logo = getSiteLogoUrl();
  const sameAs = getSocialSameAs();

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

function websiteNode() {
  const siteUrl = absoluteUrl("/");
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

function personNode() {
  const siteUrl = absoluteUrl("/");
  return {
    "@type": "Person",
    "@id": `${siteUrl}#/schema/person/author`,
    name: siteConfig.author,
    url: siteUrl,
  };
}

export function buildHomeJsonLd(options: {
  page: number;
  posts: BlogListItem[];
}) {
  const { page, posts } = options;
  const siteUrl = absoluteUrl("/");
  const canonical = absoluteUrl(page > 1 ? `/?page=${page}` : "/");
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
    websiteNode(),
    organizationNode(),
  ];

  if (posts.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${canonical}#itemlist`,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildArticleJsonLd(post: BlogDetail) {
  const seo = resolveBlogSeo(post);
  const siteUrl = absoluteUrl("/");
  const url = absoluteUrl(`/blog/${post.slug}`);
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
    websiteNode(),
    organizationNode(),
    personNode(),
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
