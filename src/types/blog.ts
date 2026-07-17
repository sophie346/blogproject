import type { TaxonomyItem } from "@/types/taxonomy";

export type BlogSeoSummary = {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageUrl: string;
};

/** Matches OneAuto BFF `serializeBlogListItem` (`GET /prod/blogs`). */
export type BlogListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedDate: string | null;
  updatedDate: string | null;
  status?: string;
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
  seo: BlogSeoSummary;
};

/** Matches OneAuto BFF `serializeBlogDetail` (`GET /prod/blogs/:slug`). */
export type BlogDetail = BlogListItem & {
  content: string;
  seo: BlogSeoSummary & Record<string, unknown>;
};

export type BlogListResponse = {
  error: boolean;
  message?: string;
  label?: string;
  data: BlogListItem[];
  totalcount: number;
  page: number;
  limit: number;
};

export type BlogDetailResponse = {
  error: boolean;
  message?: string;
  label?: string;
  data: BlogDetail;
};
