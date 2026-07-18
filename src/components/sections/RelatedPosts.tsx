import Link from "next/link";
import { formatBlogDate } from "@/services/blogs";
import { resolvePostImage } from "@/lib/images";
import { siteHref } from "@/lib/paths";
import type { BlogListItem } from "@/types/blog";

type RelatedPostsProps = {
  posts: BlogListItem[];
};

export async function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="related-posts">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
        Keep reading
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog">
        More blogs
      </h2>
      <ul className="related-posts__list">
        {await Promise.all(
          posts.map(async (post) => {
            const date = formatBlogDate(post.publishedDate || post.updatedDate);
            const imageUrl = resolvePostImage(post);
            const href = await siteHref(`/blog/${post.slug}`);
            return (
              <li key={post._id || post.slug}>
                <Link href={href} className="related-posts__card group">
                  {imageUrl ? (
                    <div className="related-posts__thumb">
                      {/* Native img — Next Image `fill` escaped without sized CSS. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={post.title}
                        width={120}
                        height={90}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div
                      className="related-posts__thumb related-posts__thumb--empty"
                      aria-hidden
                    />
                  )}
                  <div className="related-posts__body">
                    {date ? (
                      <p className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-fog-muted">
                        {date}
                      </p>
                    ) : null}
                    <p className="mt-1.5 font-display text-xl font-semibold tracking-tight text-fog transition-colors group-hover:text-amber-soft sm:text-2xl">
                      {post.title}
                    </p>
                    {post.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fog-muted sm:text-base">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                  <span className="related-posts__arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
