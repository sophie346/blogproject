import type { Metadata } from "next";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { Hero } from "@/components/sections/Hero";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { Newsletter } from "@/components/sections/Newsletter";
import { JsonLd } from "@/components/JsonLd";
import { getTenant } from "@/lib/tenant";
import {
  buildHomeJsonLd,
  buildHomeMetadata,
  getPaginationRelLinks,
} from "@/lib/seo";
import { getBlogs } from "@/services/blogs";
import { getCategories } from "@/services/categories";

type HomeProps = {
  searchParams: Promise<{ page?: string; s?: string; q?: string }>;
};

const LIMIT = 12;

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10) || 1, 1);
  const q = String(params.s || params.q || "").trim();
  const result = await getBlogs(page, LIMIT, q ? { q } : undefined);
  const totalcount = result.ok ? result.totalcount : 0;
  const totalPages = Math.max(1, Math.ceil(totalcount / LIMIT));
  const base = await buildHomeMetadata({ page, totalPages });
  if (!q) return base;
  return {
    ...base,
    title: `Search: ${q}`,
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10) || 1, 1);
  const q = String(params.s || params.q || "").trim();
  const tenant = await getTenant();

  const result = await getBlogs(page, LIMIT, q ? { q } : undefined);
  const totalcount = result.ok ? result.totalcount : 0;
  const totalPages = Math.max(1, Math.ceil(totalcount / LIMIT));
  const rel = await getPaginationRelLinks(page, totalPages);
  const posts = result.ok ? result.data : [];
  const isSearch = Boolean(q);

  const categories = tenant.sections.categories ? await getCategories() : [];
  const stat =
    result.ok && totalcount > 0 && !isSearch
      ? `${totalcount} ${totalcount === 1 ? "blog" : "blogs"} published`
      : undefined;

  const emptyTitle = !result.ok
    ? result.reason === "missing_label"
      ? "Website label required"
      : result.reason === "missing_auth"
        ? "API credentials required"
        : result.message.toLowerCase().includes("expired")
          ? "Session expired"
          : "Couldn’t load blogs"
    : isSearch
      ? "No matching blogs"
      : tenant.copy.emptyTitle;
  const emptyMessage = !result.ok
    ? result.message
    : isSearch
      ? `Nothing matched “${q}”. Try another keyword.`
      : tenant.copy.emptyMessage;

  return (
    <>
      <JsonLd data={await buildHomeJsonLd({ page, posts })} />
      {rel.prev ? <link rel="prev" href={rel.prev} /> : null}
      {rel.next ? <link rel="next" href={rel.next} /> : null}

      {!isSearch ? <Hero stat={stat} /> : null}

      {!isSearch && tenant.sections.featured && page === 1 ? (
        <FeaturedPosts posts={posts} />
      ) : null}

      <LatestPosts
        posts={posts}
        page={result.ok ? result.page : page}
        totalcount={totalcount}
        limit={result.ok ? result.limit : LIMIT}
        eyebrow={tenant.copy.storiesEyebrow}
        heading={tenant.copy.storiesHeading}
        description={tenant.copy.storiesDescription}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        categories={tenant.sections.categories ? categories : []}
        searchQuery={q}
      />

      {!isSearch && tenant.sections.newsletter ? (
        <Newsletter brandName={tenant.brand.name} />
      ) : null}
    </>
  );
}
