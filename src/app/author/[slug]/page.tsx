import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveSection } from "@/components/sections/ArchiveSection";
import { getSiteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { getAuthorBySlug, getBlogsByAuthor } from "@/services/authors";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  const siteConfig = await getSiteConfig();

  if (!author) {
    return { title: "Author not found", robots: { index: false, follow: false } };
  }

  const title = `${author.name} · ${siteConfig.name}`;
  return {
    title: { absolute: title },
    description: author.bio || `Blogs by ${author.name} on ${siteConfig.name}.`,
    alternates: { canonical: await absoluteUrl(`/author/${author.slug}`) },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = await getBlogsByAuthor(author.slug);

  return (
    <ArchiveSection
      eyebrow="Author"
      title={author.name}
      description={author.bio}
      posts={posts}
      emptyTitle="No blogs from this author yet"
      emptyMessage="Check back soon."
    />
  );
}
