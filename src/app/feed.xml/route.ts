import { getBlogs } from "@/services/blogs";
import { siteConfig } from "@/lib/config";
import { absoluteUrl, resolveBlogSeo, toIsoDate } from "@/lib/seo";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const result = await getBlogs(1, 50);
  const posts = result.ok ? result.data : [];
  const siteUrl = absoluteUrl("/");
  const feedUrl = absoluteUrl("/feed.xml");

  const items = posts
    .map((post) => {
      const seo = resolveBlogSeo(post);
      const link = absoluteUrl(`/blog/${post.slug}`);
      const pubDate = toIsoDate(post.publishedDate || post.updatedDate);
      const image = seo.image;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(seo.description)}</description>
      ${pubDate ? `<pubDate>${escapeXml(new Date(pubDate).toUTCString())}</pubDate>` : ""}
      <author>${escapeXml(siteConfig.author)}</author>
      ${image ? `<enclosure url="${escapeXml(image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} Blog`)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${escapeXml(siteConfig.language)}</language>
    <lastBuildDate>${escapeXml(new Date().toUTCString())}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
