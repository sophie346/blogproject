import Image from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/services/blogs";
import { resolvePostImage } from "@/lib/images";
import { absoluteUrl, resolveBlogSeo } from "@/lib/seo";
import { siteHref } from "@/lib/paths";
import type { BlogCardProps } from "@/themes/types";
import type { BlogListItem } from "@/types/blog";

function resolveCategory(post: BlogListItem): string {
  if (post.categories?.[0]?.name) return post.categories[0].name;
  if (post.tags?.[0]?.name) return post.tags[0].name;
  return "Blogs";
}

/** Default theme post card. */
export default async function BlogCard({ post, index = 0 }: BlogCardProps) {
  const date = formatBlogDate(post.publishedDate || post.updatedDate);
  const seo = await resolveBlogSeo(post);
  const imageUrl = resolvePostImage(post) || seo.image;
  const category = resolveCategory(post);
  const href = await siteHref(`/blog/${post.slug}`);
  const delayClass =
    index % 3 === 1
      ? "fade-up-delay-1"
      : index % 3 === 2
        ? "fade-up-delay-2"
        : "";

  return (
    <article
      className={`fade-up group ${delayClass}`}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <Link
        href={href}
        className="blog-card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-soft transition hover:-translate-y-0.5 hover:border-amber/40"
        itemProp="url"
      >
        <meta itemProp="mainEntityOfPage" content={await absoluteUrl(href)} />

        <div className="blog-card__media relative aspect-video overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
              className="blog-card__image object-cover transition duration-500 group-hover:scale-105"
              itemProp="image"
            />
          ) : (
            <div className="blog-card__placeholder absolute inset-0 bg-gradient-to-br from-ink-soft to-ink" aria-hidden />
          )}
          <div className="blog-card__media-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" aria-hidden />
        </div>

        <div className="blog-card__body flex flex-1 flex-col p-3.5 sm:p-4">
          <div className="blog-card__meta mb-2 flex flex-wrap items-center gap-1.5 font-display text-[0.62rem] font-semibold uppercase tracking-[0.12em]">
            <span className="blog-card__category text-amber-soft" itemProp="articleSection">
              {category}
            </span>
            {date ? (
              <>
                <span className="blog-card__dot text-fog-muted/50" aria-hidden>
                  ·
                </span>
                <time
                  className="blog-card__date text-fog-muted"
                  itemProp="datePublished"
                  dateTime={post.publishedDate || post.updatedDate || undefined}
                >
                  {date}
                </time>
              </>
            ) : null}
          </div>

          <h2
            itemProp="headline"
            className="blog-card__title font-display text-base font-semibold leading-snug tracking-tight text-fog transition-colors group-hover:text-amber-soft"
          >
            {post.title}
          </h2>

          {post.excerpt ? (
            <p
              itemProp="description"
              className="blog-card__excerpt mt-2 line-clamp-2 text-sm leading-relaxed text-fog-muted"
            >
              {post.excerpt}
            </p>
          ) : null}

          <span className="blog-card__cta mt-auto inline-flex items-center gap-1.5 pt-3 font-display text-xs font-semibold text-steel-bright transition group-hover:gap-2 group-hover:text-amber-soft">
            Read
            <span className="blog-card__cta-arrow" aria-hidden>
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
