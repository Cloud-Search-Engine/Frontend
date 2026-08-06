export type Provider = "aws" | "azure" | "gcp" | string;

export interface SearchHit {
  chunk_id: string;
  document_id: string;
  title: string;
  heading?: string;
  section?: string;
  provider: Provider;
  service: string;
  category: string;
  source_url: string;
  passage: string;
  score: number;
  relevance_label?: string;
}

export interface SearchResponse {
  query: string;
  total_hits: number;
  latency_ms: number;
  strategy: string;
  results: SearchHit[];
}

export interface SearchFilters {
  provider?: string;
  service?: string;
  category?: string;
}

export interface SearchParams {
  q: string;
  provider?: string;
  service?: string;
  limit?: number;
}

export interface HealthResponse {
  status: string;
  database: string;
}
