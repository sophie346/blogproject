import Link from "next/link";
import { BlogGrid } from "@/components/common/BlogGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { siteHref } from "@/lib/paths";
import type { BlogListItem } from "@/types/blog";

type ArchiveSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  posts: BlogListItem[];
  emptyTitle: string;
  emptyMessage: string;
};

/** Shared layout for category/tag/author archive pages. */
export async function ArchiveSection({
  eyebrow,
  title,
  description,
  posts,
  emptyTitle,
  emptyMessage,
}: ArchiveSectionProps) {
  const homeHref = await siteHref("/");

  return (
    <section className="archive-section px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 font-display text-sm text-steel-bright">
            <li>
              <Link href={homeHref} className="transition-colors hover:text-amber-soft">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-fog-muted/40">
              /
            </li>
            <li className="text-fog-muted line-clamp-1" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        <div className="archive-section__header">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-steel-bright">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fog sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-fog-muted">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-12">
          {posts.length === 0 ? (
            <EmptyState title={emptyTitle} message={emptyMessage} />
          ) : (
            <BlogGrid posts={posts} />
          )}
        </div>
      </div>
    </section>
  );
}
