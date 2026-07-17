import Image from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/services/blogs";
import { resolvePostImage } from "@/lib/images";
import type { BlogListItem } from "@/types/blog";

type BlogListProps = {
  posts: BlogListItem[];
};

/** Vertical, media-left list layout — an alternative to the grid. */
export function BlogList({ posts }: BlogListProps) {
  return (
    <ul className="blog-list">
      {posts.map((post) => {
        const date = formatBlogDate(post.publishedDate || post.updatedDate);
        const imageUrl = resolvePostImage(post);
        return (
          <li key={post._id || post.slug}>
            <Link href={`/blog/${post.slug}`} className="blog-list__item group">
              {imageUrl ? (
                <div className="blog-list__thumb">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
              ) : (
                <div className="blog-list__thumb blog-list__thumb--empty" />
              )}
              <div className="min-w-0 flex-1">
                {date ? (
                  <p className="blog-list__date">{date}</p>
                ) : null}
                <p className="blog-list__title">{post.title}</p>
                {post.excerpt ? (
                  <p className="blog-list__excerpt">{post.excerpt}</p>
                ) : null}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
