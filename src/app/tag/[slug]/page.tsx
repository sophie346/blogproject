import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveSection } from "@/components/sections/ArchiveSection";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { getBlogsByTag, getTagBySlug } from "@/services/tags";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: "Tag not found", robots: { index: false, follow: false } };
  }

  const title = `#${tag.name} · ${siteConfig.name}`;
  return {
    title: { absolute: title },
    description: `Stories tagged ${tag.name} on ${siteConfig.name}.`,
    alternates: { canonical: absoluteUrl(`/tag/${tag.slug}`) },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const posts = await getBlogsByTag(tag.slug);

  return (
    <ArchiveSection
      eyebrow="Tag"
      title={tag.name}
      posts={posts}
      emptyTitle="No stories with this tag yet"
      emptyMessage="Check back soon or explore other topics."
    />
  );
}
