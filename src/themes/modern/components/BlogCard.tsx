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

/**
 * Modern theme card — sharper edges, stronger accent border.
 * Overrides default BlogCard; Header/Footer still inherit default.
 */
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
        className="blog-card theme-modern-card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-soft shadow-[0_10px_30px_rgba(11,10,18,0.06)] transition hover:-translate-y-1 hover:border-amber hover:shadow-[0_18px_40px_rgba(11,10,18,0.1)]"
        itemProp="url"
      >
        <meta itemProp="mainEntityOfPage" content={await absoluteUrl(href)} />

        <div className="blog-card__media relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              className="blog-card__image object-cover transition duration-500 group-hover:scale-105"
              itemProp="image"
            />
          ) : (
            <div
              className="blog-card__placeholder absolute inset-0 bg-gradient-to-br from-ink-soft to-ink"
              aria-hidden
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
            aria-hidden
          />
          <span className="absolute bottom-3 left-3 rounded-md bg-amber px-2.5 py-1 font-display text-[0.65rem] font-bold uppercase tracking-wider text-white">
            {category}
          </span>
        </div>

        <div className="blog-card__body flex flex-1 flex-col p-5 sm:p-6">
          {date ? (
            <time
              className="mb-2.5 font-display text-[0.68rem] uppercase tracking-[0.14em] text-fog-muted"
              itemProp="datePublished"
              dateTime={post.publishedDate || post.updatedDate || undefined}
            >
              {date}
            </time>
          ) : null}

          <h2
            itemProp="headline"
            className="font-display text-lg font-bold leading-snug tracking-tight text-fog transition-colors group-hover:text-amber sm:text-xl"
          >
            {post.title}
          </h2>

          {post.excerpt ? (
            <p
              itemProp="description"
              className="mt-3 line-clamp-3 text-sm leading-relaxed text-fog-muted sm:text-[0.95rem]"
            >
              {post.excerpt}
            </p>
          ) : null}

          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-display text-sm font-semibold text-amber">
            Read more
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
