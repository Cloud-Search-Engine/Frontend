import type { HealthResponse, SearchParams, SearchResponse } from "@/types/search";

const DEFAULT_API_URL = "http://localhost:8080";

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_API_URL
  );
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let detail = text || res.statusText;
    try {
      const body = JSON.parse(text) as { error?: string; message?: string };
      detail = body.error || body.message || detail;
    } catch {
      // keep raw text
    }
    throw new ApiError(detail || `Request failed (${res.status})`, res.status);
  }
  if (!text) {
    throw new ApiError("Empty response from API", res.status);
  }
  return JSON.parse(text) as T;
}

export async function searchDocs(
  params: SearchParams,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const url = new URL("/v1/search", getApiBaseUrl());
  url.searchParams.set("q", params.q.trim());

  if (params.provider) {
    url.searchParams.set("provider", params.provider);
  }
  if (params.service) {
    url.searchParams.set("service", params.service);
  }
  if (params.limit != null) {
    url.searchParams.set("limit", String(params.limit));
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
    cache: "no-store",
  });

  return parseJson<SearchResponse>(res);
}

export async function checkHealth(
  signal?: AbortSignal
): Promise<HealthResponse> {
  const url = new URL("/healthz", getApiBaseUrl());
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
    cache: "no-store",
  });
  return parseJson<HealthResponse>(res);
}
