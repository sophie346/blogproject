import type { BlogListItem } from "@/types/blog";
import { ThemeBlogCard } from "@/components/themed/ThemeBlogCard";

type BlogGridProps = {
  posts: BlogListItem[];
};

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="blog-grid grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
      {posts.map((post, index) => (
        <ThemeBlogCard key={post._id || post.slug} post={post} index={index} />
      ))}
    </div>
  );
}
