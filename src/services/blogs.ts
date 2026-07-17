import { apiGet, getAxiosErrorMessage } from "@/lib/http";
import { getApiConfig } from "@/lib/tenant";
import type {
  BlogDetail,
  BlogDetailResponse,
  BlogListItem,
  BlogListResponse,
  BlogSeoSummary,
} from "@/types/blog";

async function buildBffHeaders(): Promise<Record<string, string>> {
  const { clientName, label, authToken } = await getApiConfig();
  const headers: Record<string, string> = {
    Accept: "application/json",
    clientname: clientName,
  };

  if (label) {
    headers.label = label;
  }

  // Optional — BFF /prod routes allow guest access without a Bearer token.
  if (authToken) {
    headers.Authorization = authToken.startsWith("Bearer ")
      ? authToken
      : `Bearer ${authToken}`;
  }

  return headers;
}

type AxiosBlogResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; reason: "api_error"; message: string };

async function bffGet<T>(
  path: string,
  params?: Record<string, string | number>
): Promise<AxiosBlogResult<T>> {
  const { label } = await getApiConfig();
  try {
    const res = await apiGet<T>(path, {
      params: {
        ...(label ? { label } : {}),
        ...(params || {}),
      },
      headers: await buildBffHeaders(),
    });
    return {
      ok: true,
      status: res.status,
      data: res.data,
    };
  } catch (err) {
    return {
      ok: false,
      reason: "api_error",
      message: await getAxiosErrorMessage(err, "Unable to reach the blog service."),
    };
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object" && value !== null && "toString" in value) {
    const text = String((value as { toString: () => string }).toString()).trim();
    if (text && text !== "[object Object]") return text;
  }
  return fallback;
}

/** Normalize API dates (ISO string, Date, or timestamp) to ISO string. */
function asIsoDate(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  const text = asString(value);
  if (!text) return null;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function emptySeo(): BlogSeoSummary {
  return {
    title: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    openGraphTitle: "",
    openGraphDescription: "",
    openGraphImageUrl: "",
  };
}

function normalizeSeo(raw: unknown): BlogSeoSummary {
  const seo = asRecord(raw);
  if (!seo) return emptySeo();

  const metaTitle = asString(seo.metaTitle);
  const metaDescription = asString(seo.metaDescription);

  return {
    title: asString(seo.title) || metaTitle,
    description: asString(seo.description) || metaDescription,
    metaTitle,
    metaDescription,
    metaKeywords: asString(seo.metaKeywords),
    openGraphTitle: asString(seo.openGraphTitle),
    openGraphDescription: asString(seo.openGraphDescription),
    openGraphImageUrl: asString(seo.openGraphImageUrl),
  };
}

/**
 * Map one BFF list item (`serializeBlogListItem`) into UI-ready shape.
 * Accepts raw JSON so Mongo quirks / missing fields still render.
 */
export function toListItem(raw: unknown): BlogListItem | null {
  const blog = asRecord(raw);
  if (!blog) return null;

  const slug = asString(blog.slug).toLowerCase();
  const title = asString(blog.title);
  if (!slug && !title) return null;

  const publishedDate =
    asIsoDate(blog.publishedDate) ||
    asIsoDate(blog.scheduledDate) ||
    asIsoDate(blog.updatedDate);

  return {
    _id: asString(blog._id) || slug || title,
    title: title || "Untitled",
    slug: slug || asString(blog._id),
    excerpt: asString(blog.excerpt),
    featuredImage: asString(blog.featuredImage),
    publishedDate,
    updatedDate: asIsoDate(blog.updatedDate),
    status: asString(blog.status) || undefined,
    seo: normalizeSeo(blog.seo),
  };
}

/** Map one BFF detail payload (`serializeBlogDetail`) into UI-ready shape. */
export function toDetail(raw: unknown): BlogDetail | null {
  const blog = asRecord(raw);
  if (!blog) return null;

  const list = toListItem(blog);
  if (!list) return null;

  const seoRaw = asRecord(blog.seo);
  const seo = {
    ...normalizeSeo(blog.seo),
    ...(seoRaw || {}),
  } as BlogDetail["seo"];

  return {
    ...list,
    content: asString(blog.content),
    seo,
  };
}

function parseListPayload(json: unknown): {
  rows: BlogListItem[];
  totalcount: number;
  page: number;
  limit: number;
  message?: string;
  error?: boolean;
} {
  const body = asRecord(json) || {};
  const rawRows = Array.isArray(body.data) ? body.data : [];
  const rows = rawRows
    .map(toListItem)
    .filter((item): item is BlogListItem => item != null);

  return {
    rows,
    totalcount: Number(body.totalcount ?? rows.length) || rows.length,
    page: Math.max(Number(body.page) || 1, 1),
    limit: Math.max(Number(body.limit) || 12, 1),
    message: asString(body.message) || undefined,
    error: Boolean(body.error),
  };
}

export type BlogListResult =
  | {
      ok: true;
      data: BlogListItem[];
      totalcount: number;
      page: number;
      limit: number;
      label?: string;
    }
  | {
      ok: false;
      reason: "missing_label" | "missing_auth" | "api_error";
      message: string;
    };

export type BlogDetailResult =
  | { ok: true; data: BlogDetail }
  | {
      ok: false;
      reason: "missing_label" | "missing_auth" | "not_found" | "api_error";
      message: string;
    };

type BlogConfigError = {
  ok: false;
  reason: "missing_label" | "missing_auth" | "api_error";
  message: string;
};

async function missingConfig(): Promise<BlogConfigError | null> {
  const { label, clientName, apiBase } = await getApiConfig();
  if (!apiBase) {
    return {
      ok: false,
      reason: "api_error",
      message: "Blog API base URL is not configured.",
    };
  }
  if (!clientName) {
    return {
      ok: false,
      reason: "missing_auth",
      message: "Client name is not configured for this tenant.",
    };
  }
  if (!label) {
    return {
      ok: false,
      reason: "missing_label",
      message: "Website label is not configured for this tenant.",
    };
  }
  return null;
}

/** Published blog list for the active tenant. */
export async function getBlogs(page = 1, limit = 12): Promise<BlogListResult> {
  const configError = await missingConfig();
  if (configError) return configError;

  const result = await bffGet<BlogListResponse>("/prod/blogs", {
    page,
    limit,
  });
  if (!result.ok) {
    return {
      ok: false,
      reason: "api_error",
      message: result.message,
    };
  }

  const parsed = parseListPayload(result.data);
  const label = asString(asRecord(result.data)?.label) || undefined;

  if (result.status === 400) {
    return {
      ok: false,
      reason: "missing_label",
      message: parsed.message || "A website label is required to load blogs.",
    };
  }

  if (result.status === 403) {
    return {
      ok: false,
      reason: "api_error",
      message: "The blog service denied access (403).",
    };
  }

  if (result.status >= 400) {
    return {
      ok: false,
      reason: "api_error",
      message:
        parsed.message ||
        `Unable to load blogs (${result.status}). Is the blog service reachable?`,
    };
  }

  if (parsed.error) {
    return {
      ok: false,
      reason: "api_error",
      message: parsed.message || "Unable to load blogs.",
    };
  }

  return {
    ok: true,
    data: parsed.rows,
    totalcount: parsed.totalcount,
    page: parsed.page,
    limit: parsed.limit,
    label,
  };
}

/** Published blog detail by slug for the active tenant. */
export async function getBlogBySlug(
  slug: string,
  options?: { preview?: string | null }
): Promise<BlogDetailResult> {
  const configError = await missingConfig();
  if (configError) {
    return {
      ok: false,
      reason: configError.reason,
      message: configError.message,
    };
  }

  const safeSlug = encodeURIComponent(slug.trim().toLowerCase());
  const preview = String(options?.preview ?? "").trim();
  const result = await bffGet<BlogDetailResponse>(`/prod/blogs/${safeSlug}`, {
    ...(preview ? { preview } : {}),
  });
  if (!result.ok) {
    return {
      ok: false,
      reason: "api_error",
      message: result.message,
    };
  }

  if (result.status === 404) {
    return {
      ok: false,
      reason: "not_found",
      message: "Blog not found",
    };
  }

  const body = asRecord(result.data);
  const message = asString(body?.message) || undefined;

  if (result.status === 400) {
    return {
      ok: false,
      reason: "missing_label",
      message: message || "A website label is required to load this blog.",
    };
  }

  if (result.status >= 400) {
    return {
      ok: false,
      reason: "api_error",
      message: message || `Unable to load blog (${result.status}).`,
    };
  }

  if (body?.error || !body?.data) {
    return {
      ok: false,
      reason: message?.toLowerCase().includes("not found")
        ? "not_found"
        : "api_error",
      message: message || "Unable to load blog.",
    };
  }

  const detail = toDetail(body.data);
  if (!detail) {
    return {
      ok: false,
      reason: "api_error",
      message: "Blog payload was empty or invalid.",
    };
  }

  return {
    ok: true,
    data: detail,
  };
}

export {
  estimateReadingTime,
  formatBlogDate,
} from "@/lib/blog-format";

export async function getRelatedBlogs(
  currentSlug: string,
  limit = 3
): Promise<BlogListItem[]> {
  const result = await getBlogs(1, 24);
  if (!result.ok) return [];
  const normalized = currentSlug.trim().toLowerCase();
  return result.data
    .filter((blog) => String(blog.slug || "").toLowerCase() !== normalized)
    .slice(0, limit);
}
