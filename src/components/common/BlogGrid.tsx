import type { BlogListItem } from "@/types/blog";
import { ThemeBlogCard } from "@/components/themed/ThemeBlogCard";

type BlogGridProps = {
  posts: BlogListItem[];
};

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="blog-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post, index) => (
        <ThemeBlogCard key={post._id || post.slug} post={post} index={index} />
      ))}
    </div>
  );
}
