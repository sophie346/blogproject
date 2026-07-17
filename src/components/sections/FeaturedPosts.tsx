import Image from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/services/blogs";
import { resolvePostImage } from "@/lib/images";
import { resolveBlogSeo } from "@/lib/seo";
import type { BlogListItem } from "@/types/blog";

type FeaturedPostsProps = {
  posts: BlogListItem[];
  heading?: string;
  eyebrow?: string;
};

/** Compact featured highlight — standard editorial row, not a full-bleed photo hero. */
export async function FeaturedPosts({
  posts,
  heading = "Featured",
  eyebrow = "Editor’s pick",
}: FeaturedPostsProps) {
  const post = posts[0];
  if (!post) return null;

  const seo = await resolveBlogSeo(post);
  const imageUrl = resolvePostImage(post) || seo.image;
  const date = formatBlogDate(post.publishedDate || post.updatedDate);

  return (
    <section className="featured-section px-5 pt-12 sm:px-8 sm:pt-16">
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
          {eyebrow}
        </p>
        <h2 className="mt-3 mb-6 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">
          {heading}
        </h2>

        <Link href={`/blog/${post.slug}`} className="featured-card featured-card--compact group">
          {imageUrl ? (
            <div className="featured-card__thumb">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="featured-card__image"
                priority
              />
            </div>
          ) : (
            <div className="featured-card__thumb featured-card__thumb--empty" aria-hidden />
          )}
          <div className="featured-card__body featured-card__body--compact">
            {date ? <p className="featured-card__date">{date}</p> : null}
            <h3 className="featured-card__title featured-card__title--compact">{post.title}</h3>
            {post.excerpt ? (
              <p className="featured-card__excerpt featured-card__excerpt--compact">{post.excerpt}</p>
            ) : null}
            <span className="blog-card__cta">
              Read story
              <span className="blog-card__cta-arrow" aria-hidden>
                →
              </span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
