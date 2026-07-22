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
  searchParams: Promise<{ page?: string }>;
};

const LIMIT = 12;

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10) || 1, 1);
  const result = await getBlogs(page, LIMIT);
  const totalcount = result.ok ? result.totalcount : 0;
  const totalPages = Math.max(1, Math.ceil(totalcount / LIMIT));

  return await buildHomeMetadata({ page, totalPages });
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10) || 1, 1);
  const tenant = await getTenant();

  const result = await getBlogs(page, LIMIT);
  const totalcount = result.ok ? result.totalcount : 0;
  const totalPages = Math.max(1, Math.ceil(totalcount / LIMIT));
  const rel = await getPaginationRelLinks(page, totalPages);
  const posts = result.ok ? result.data : [];

  const categories = tenant.sections.categories ? await getCategories() : [];
  const stat =
    result.ok && totalcount > 0
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
    : tenant.copy.emptyTitle;
  const emptyMessage = !result.ok ? result.message : tenant.copy.emptyMessage;

  return (
    <>
      <JsonLd data={await buildHomeJsonLd({ page, posts })} />
      {rel.prev ? <link rel="prev" href={rel.prev} /> : null}
      {rel.next ? <link rel="next" href={rel.next} /> : null}

      <Hero stat={stat} />

      {tenant.sections.featured && page === 1 ? (
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
      />

      {tenant.sections.newsletter ? (
        <Newsletter brandName={tenant.brand.name} />
      ) : null}
    </>
  );
}
