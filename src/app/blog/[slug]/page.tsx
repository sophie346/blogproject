import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArticleBody,
  isUsefulPostExcerpt,
} from "@/components/ArticleBody";
import { EmptyState } from "@/components/common/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { RelatedPosts } from "@/components/sections/RelatedPosts";
import { ShareBar } from "@/components/ShareBar";
import { estimateReadingTime, formatBlogDate } from "@/lib/blog-format";
import { getSiteConfig } from "@/lib/config";
import { resolvePostImage } from "@/lib/images";
import { siteHref } from "@/lib/paths";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildArticleMetadata,
  parseKeywords,
  resolveBlogSeo,
  toIsoDate,
} from "@/lib/seo";
import { getBlogBySlug, getRelatedBlogs } from "@/services/blogs";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string | string[] }>;
};

async function resolvePreviewToken(
  searchParams?: Promise<{ preview?: string | string[] }>
) {
  const sp = searchParams ? await searchParams : undefined;
  const raw = sp?.preview;
  if (Array.isArray(raw)) return String(raw[0] || "").trim();
  return String(raw || "").trim();
}

export async function generateMetadata({
  params,
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const preview = await resolvePreviewToken(searchParams);
  const result = await getBlogBySlug(slug, { preview });

  if (!result.ok) {
    return {
      title: "Blog not found",
      robots: { index: false, follow: false },
    };
  }

  const metadata = await buildArticleMetadata(result.data);
  if (String(result.data.status || "").toLowerCase() !== "published") {
    return {
      ...metadata,
      robots: { index: false, follow: false },
    };
  }
  return metadata;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { slug } = await params;
  const preview = await resolvePreviewToken(searchParams);
  const result = await getBlogBySlug(slug, { preview });
  const siteConfig = await getSiteConfig();

  if (!result.ok) {
    if (result.reason === "not_found") {
      notFound();
    }

    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
        <EmptyState
          title={
            result.reason === "missing_label"
              ? "Website label required"
              : result.reason === "missing_auth"
                ? "API credentials required"
                : "Couldn’t load this blog"
          }
          message={result.message}
        />
      </div>
    );
  }

  const post = result.data;
  const seo = await resolveBlogSeo(post);
  const date = formatBlogDate(post.publishedDate || post.updatedDate);
  const dateIso = toIsoDate(post.publishedDate || post.updatedDate);
  const imageUrl = resolvePostImage(post) || seo.image;
  const readingMinutes = estimateReadingTime(post.content || post.excerpt);
  const categories = Array.isArray(post.categories) ? post.categories : [];
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const topicChips = await Promise.all([
    ...categories.map(async (c) => ({
      kind: "category" as const,
      slug: c.slug,
      name: c.name,
      href: await siteHref(`/category/${c.slug}`),
    })),
    ...tags.map(async (t) => ({
      kind: "tag" as const,
      slug: t.slug,
      name: t.name,
      href: await siteHref(`/tag/${t.slug}`),
    })),
  ]);
  // Fallback to SEO keywords only when no real taxonomy is set
  const keywordFallback =
    topicChips.length === 0 ? parseKeywords(post.seo?.metaKeywords) : [];
  const related = await getRelatedBlogs(post.slug, 3);
  const shareUrl = await absoluteUrl(`/blog/${post.slug}`);
  const homeHref = await siteHref("/");
  const blogsHref = await siteHref("/#blogs");

  const isPreview = String(post.status || "").toLowerCase() !== "published";

  return (
    <article itemScope itemType="https://schema.org/Article">
      {isPreview ? (
        <div
          role="status"
          className="border-b border-amber/40 bg-amber/15 px-5 py-3 text-center font-display text-sm text-amber-soft sm:px-8"
        >
          Preview — this post is not live
          {post.status ? ` (${post.status})` : ""}. Visitors without this link
          cannot see it.
        </div>
      ) : null}
      <JsonLd data={await buildArticleJsonLd(post)} />
      <meta itemProp="headline" content={post.title} />
      {seo.description ? (
        <meta itemProp="description" content={seo.description} />
      ) : null}
      {dateIso ? (
        <meta itemProp="datePublished" content={dateIso} />
      ) : null}

      <header className="border-b border-line/80">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-display text-sm text-steel-bright">
              <li>
                <Link
                  href={homeHref}
                  className="transition-colors hover:text-amber-soft"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-fog-muted/40">
                /
              </li>
              <li>
                <Link
                  href={blogsHref}
                  className="transition-colors hover:text-amber-soft"
                >
                  Blogs
                </Link>
              </li>
              <li aria-hidden className="text-fog-muted/40">
                /
              </li>
              <li className="max-w-full truncate text-fog-muted" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-xs uppercase tracking-[0.18em] text-fog-muted">
            {dateIso && date ? (
              <time dateTime={dateIso} itemProp="datePublished">
                {date}
              </time>
            ) : date ? (
              <span>{date}</span>
            ) : null}
            {date ? (
              <span aria-hidden className="text-fog-muted/40">
                ·
              </span>
            ) : null}
            <span>{readingMinutes} min read</span>
            {post.status && post.status !== "published" ? (
              <>
                <span aria-hidden className="text-fog-muted/40">
                  ·
                </span>
                <span className="text-amber-soft">{post.status}</span>
              </>
            ) : null}
          </div>

          <h1
            itemProp="headline"
            className="mt-5 font-display text-3xl font-bold tracking-tight text-fog sm:text-5xl"
          >
            {post.title}
          </h1>

          {/* Native <img> + inline size — Next Image `fill` was escaping and covering the viewport. */}
          {imageUrl ? (
            <div
              className="mt-8 overflow-hidden rounded-xl bg-ink-soft"
              style={{ width: "100%", height: 160, maxHeight: 160 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={post.title}
                width={1200}
                height={160}
                itemProp="image"
                decoding="async"
                style={{
                  display: "block",
                  width: "100%",
                  height: 160,
                  maxHeight: 160,
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          ) : null}

          {isUsefulPostExcerpt(post.excerpt, post.content) ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog-muted sm:text-xl">
              {post.excerpt}
            </p>
          ) : null}

          <p
            className="mt-8 font-display text-sm text-fog-muted"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
          >
            By <span itemProp="name">{siteConfig.author}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        {topicChips.length || keywordFallback.length ? (
          <ul className="mb-10 flex flex-wrap gap-2" aria-label="Topics">
            {topicChips.map((chip) => (
              <li key={`${chip.kind}-${chip.slug}`}>
                <Link
                  href={chip.href}
                  className="border border-line/80 px-3 py-1 font-display text-xs uppercase tracking-[0.14em] text-fog-muted transition-colors hover:border-amber hover:text-amber-soft"
                >
                  {chip.name}
                </Link>
              </li>
            ))}
            {keywordFallback.map((keyword) => (
              <li
                key={keyword}
                className="border border-line/80 px-3 py-1 font-display text-xs uppercase tracking-[0.14em] text-fog-muted"
              >
                {keyword}
              </li>
            ))}
          </ul>
        ) : null}

        {post.content ? (
          <div itemProp="articleBody">
            <ArticleBody html={post.content} featuredUrl={imageUrl} />
          </div>
        ) : (
          <EmptyState
            title="No content yet"
            message="This blog doesn’t include article body content yet."
          />
        )}

        <div className="mt-14 border-t border-line/80 pt-8">
          <ShareBar title={post.title} url={shareUrl} />
        </div>

        <RelatedPosts posts={related} />

        <div className="mt-16">
          <Link
            href={blogsHref}
            className="inline-flex items-center gap-2 border border-amber/50 bg-amber/10 px-5 py-3 font-display text-sm font-medium text-amber-soft transition hover:border-amber hover:bg-amber/20"
          >
            Browse all blogs
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
