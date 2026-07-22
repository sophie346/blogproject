import { BlogGrid } from "@/components/common/BlogGrid";
import { BlogSearchForm } from "@/components/common/BlogSearchForm";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { CategorySidebar } from "@/components/sections/CategorySidebar";
import { siteHref } from "@/lib/paths";
import type { BlogListItem } from "@/types/blog";
import type { Category } from "@/types/category";

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
  categories?: Category[];
  searchQuery?: string;
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
  categories = [],
  searchQuery = "",
}: LatestPostsProps) {
  const homePath = await siteHref("/");
  const showSidebar = categories.length > 0;
  const q = String(searchQuery || "").trim();
  const isSearch = Boolean(q);
  const showDescription = Boolean(String(description || "").trim()) && !isSearch;
  const sectionHeading = isSearch ? `Results for “${q}”` : heading;
  const sectionEyebrow = isSearch ? "Search" : eyebrow;

  return (
    <section
      id="blogs"
      className="stories-section relative scroll-mt-8 bg-ink px-5 py-8 sm:px-8 sm:py-10"
      aria-labelledby="blogs-heading"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="stories-section__header mb-6 flex flex-col gap-4 border-b border-line pb-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
              {sectionEyebrow}
            </p>
            <h2
              id="blogs-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl"
            >
              {sectionHeading}
            </h2>
            {showDescription ? (
              <p className="mt-2 text-sm leading-relaxed text-fog-muted sm:text-base">
                {description}
              </p>
            ) : null}
            {isSearch ? (
              <p className="mt-2 text-sm text-fog-muted">
                {totalcount} {totalcount === 1 ? "blog" : "blogs"} found
              </p>
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[16rem] sm:items-end">
            <BlogSearchForm
              initialQuery={q}
              actionPath={homePath}
              className="w-full sm:w-[18rem]"
            />
            {!isSearch && totalcount > 0 ? (
              <div
                className="stories-section__count flex min-w-[5rem] flex-col items-center justify-center rounded-xl border border-amber/30 bg-ink-soft px-4 py-3 sm:self-end"
                aria-hidden
              >
                <span className="stories-section__count-value font-display text-2xl font-bold leading-none text-amber-soft">
                  {totalcount}
                </span>
                <span className="stories-section__count-label mt-1 font-display text-[0.62rem] uppercase tracking-[0.2em] text-fog-muted">
                  posts
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {posts.length === 0 ? (
          <EmptyState title={emptyTitle} message={emptyMessage} />
        ) : showSidebar ? (
          <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CategorySidebar categories={categories} />
            </div>
            <div className="min-w-0">
              <BlogGrid posts={posts} compact />
              <Pagination
                page={page}
                totalcount={totalcount}
                limit={limit}
                basePath={homePath}
                hash="#blogs"
                query={{ s: q || undefined }}
              />
            </div>
          </div>
        ) : (
          <>
            <BlogGrid posts={posts} />
            <Pagination
              page={page}
              totalcount={totalcount}
              limit={limit}
              basePath={homePath}
              hash="#blogs"
              query={{ s: q || undefined }}
            />
          </>
        )}
      </div>
    </section>
  );
}
