"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SearchForm, { type SearchFormValues } from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import { ApiError, checkHealth, searchDocs } from "@/lib/api";
import type { SearchResponse } from "@/types/search";

type HealthState = "checking" | "ok" | "down";

export default function SearchPage() {
  const [values, setValues] = useState<SearchFormValues>({
    q: "",
    provider: "",
    service: "",
  });
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [health, setHealth] = useState<HealthState>("checking");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    checkHealth(controller.signal)
      .then((res) => {
        setHealth(res.status === "ok" || res.status === "healthy" ? "ok" : "down");
      })
      .catch(() => setHealth("down"));
    return () => controller.abort();
  }, []);

  const runSearch = useCallback(async (next: SearchFormValues) => {
    const q = next.q.trim();
    if (!q) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchDocs(
        {
          q,
          provider: next.provider || undefined,
          service: next.service.trim() || undefined,
        },
        controller.signal
      );
      setData(response);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unable to reach the search API";
      setError(message);
      setData(null);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <header className="border-b border-slate-200/70 bg-paper/80 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Cloud architecture docs
          </p>
          <HealthPill state={health} />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl flex-1 px-5 sm:px-8">
        <section className="flex min-h-[min(72vh,38rem)] flex-col justify-center pb-10 pt-14 sm:pt-20">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-steel-600 animate-fade-up">
            CloudSearch
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl animate-fade-up animate-delay-1">
            Find the right cloud architecture answer.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg animate-fade-up animate-delay-2">
            Search indexed AWS, Azure, and GCP documentation with provider and
            service filters — passages ranked for architecture decisions.
          </p>

          <div className="mt-8 max-w-2xl animate-fade-up animate-delay-3">
            <SearchForm
              values={values}
              onChange={setValues}
              onSubmit={runSearch}
              loading={loading}
              variant="hero"
            />
          </div>
        </section>

        <section className="border-t border-slate-200/80 pb-20 pt-8">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Results
          </h2>
          <SearchResults
            data={data}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
          />
        </section>
      </main>

      <footer className="border-t border-slate-200/70 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 sm:px-8">
          <p className="font-mono text-[11px] text-slate-400">
            CloudSearch · Phase 1
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            API · GET /v1/search
          </p>
        </div>
      </footer>
    </div>
  );
}

function HealthPill({ state }: { state: HealthState }) {
  const label =
    state === "checking"
      ? "Checking API"
      : state === "ok"
        ? "API online"
        : "API offline";

  const dot =
    state === "checking"
      ? "bg-slate-400"
      : state === "ok"
        ? "bg-emerald-500"
        : "bg-rose-500";

  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[11px] text-slate-500"
      title={label}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
