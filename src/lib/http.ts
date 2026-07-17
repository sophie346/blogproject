import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { getApiConfig } from "./config";

export const http = axios.create({
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: () => true, // handle status codes in callers
});

export async function getApiBase() {
  return (await getApiConfig()).apiBase;
}

export async function apiUrl(path: string) {
  const base = (await getApiBase()).replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export async function apiGet<T = unknown>(
  path: string,
  options?: {
    params?: Record<string, string | number | boolean | undefined | null>;
    headers?: Record<string, string>;
  }
) {
  const config: AxiosRequestConfig = {
    params: options?.params,
    headers: options?.headers,
  };
  return http.get<T>(await apiUrl(path), config);
}

export async function apiPost<T = unknown>(
  path: string,
  data?: unknown,
  options?: {
    headers?: Record<string, string>;
  }
) {
  return http.post<T>(await apiUrl(path), data ?? {}, {
    headers: options?.headers,
  });
}

export async function getAxiosErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ message?: string }>;
    const code = ax.code || "";
    const raw = ax.response?.data?.message || ax.message || "";
    if (
      code === "ECONNREFUSED" ||
      /ECONNREFUSED/i.test(String(raw)) ||
      /connect ECONNREFUSED/i.test(String(ax.message))
    ) {
      const base = (await getApiBase()) || "https://backend.oneauto.us";
      return `BFF not reachable at ${base}.`;
    }
    return raw || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
