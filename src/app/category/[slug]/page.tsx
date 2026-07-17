import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveSection } from "@/components/sections/ArchiveSection";
import { getSiteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { getBlogsByCategory, getCategoryBySlug } from "@/services/categories";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const siteConfig = await getSiteConfig();

  if (!category) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  const title = `${category.name} · ${siteConfig.name}`;
  return {
    title: { absolute: title },
    description:
      category.description ||
      `Blogs filed under ${category.name} on ${siteConfig.name}.`,
    alternates: { canonical: await absoluteUrl(`/category/${category.slug}`) },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getBlogsByCategory(category.slug);

  return (
    <ArchiveSection
      eyebrow="Category"
      title={category.name}
      description={category.description}
      posts={posts}
      emptyTitle="No blogs in this category yet"
      emptyMessage="Check back soon or explore other topics."
    />
  );
}
