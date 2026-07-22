import type { BlogListItem } from "@/types/blog";
import { ThemeBlogCard } from "@/components/themed/ThemeBlogCard";

type BlogGridProps = {
  posts: BlogListItem[];
  /** Slightly tighter gaps when rendered beside a sidebar; still 3 columns. */
  compact?: boolean;
};

export function BlogGrid({ posts, compact = false }: BlogGridProps) {
  const gridClass = compact
    ? "blog-grid grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5"
    : "blog-grid grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7";

  return (
    <div className={gridClass}>
      {posts.map((post, index) => (
        <ThemeBlogCard key={post._id || post.slug} post={post} index={index} />
      ))}
    </div>
  );
}
