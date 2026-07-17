import { BlogGrid } from "@/components/common/BlogGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { siteHref } from "@/lib/paths";
import type { BlogListItem } from "@/types/blog";

type LatestPostsProps = {
  posts: BlogListItem[];
  page: number;
  totalcount: number;
  limit: number;
  heading?: string;
  eyebrow?: string;
  description?: string;
  emptyTitle: string;
  emptyMessage: string;
};

export async function LatestPosts({
  posts,
  page,
  totalcount,
  limit,
  heading = "Latest blogs",
  eyebrow = "Latest",
  description = "Curated reads from the blog.",
  emptyTitle,
  emptyMessage,
}: LatestPostsProps) {
  const homePath = await siteHref("/");

  return (
    <section
      id="blogs"
      className="stories-section relative scroll-mt-8 bg-ink px-5 py-16 sm:px-8 sm:py-24"
      aria-labelledby="blogs-heading"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="stories-section__header mb-10 flex flex-col gap-6 border-b border-line pb-8 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
              {eyebrow}
            </p>
            <h2
              id="blogs-heading"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-fog sm:text-4xl"
            >
              {heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fog-muted">
              {description}
            </p>
          </div>
          {totalcount > 0 ? (
            <div
              className="stories-section__count flex min-w-[5.5rem] flex-col items-center justify-center rounded-2xl border border-amber/30 bg-ink-soft px-5 py-4"
              aria-hidden
            >
              <span className="stories-section__count-value font-display text-3xl font-bold leading-none text-amber-soft">
                {totalcount}
              </span>
              <span className="stories-section__count-label mt-1 font-display text-[0.65rem] uppercase tracking-[0.2em] text-fog-muted">
                posts
              </span>
            </div>
          ) : null}
        </div>

        {posts.length === 0 ? (
          <EmptyState title={emptyTitle} message={emptyMessage} />
        ) : (
          <>
            <BlogGrid posts={posts} />
            <Pagination
              page={page}
              totalcount={totalcount}
              limit={limit}
              basePath={homePath}
              hash="#blogs"
            />
          </>
        )}
      </div>
    </section>
  );
}
