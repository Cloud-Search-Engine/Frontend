import ResultItem from "@/components/ResultItem";
import type { SearchResponse } from "@/types/search";

type SearchResultsProps = {
  data: SearchResponse | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
};

function LoadingState() {
  return (
    <div className="space-y-4 py-6" aria-busy="true" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
        Searching corpus…
      </p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse space-y-2 border-b border-slate-100 pb-5">
          <div className="h-3 w-24 rounded bg-slate-200/80" />
          <div className="h-4 w-3/4 rounded bg-slate-200/80" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-5/6 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="py-10">
      <p className="text-base font-medium text-slate-800">No matches found</p>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
        Nothing in the indexed documentation matched{" "}
        <span className="font-mono text-slate-700">&ldquo;{query}&rdquo;</span>.
        Try a broader phrase, drop a filter, or check a different provider.
      </p>
    </div>
  );
}

function IdleState() {
  return (
    <div className="py-10">
      <p className="text-base font-medium text-slate-800">Ready to search</p>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
        Query architecture docs across AWS, Azure, and GCP — networking,
        IAM, compute, and more.
      </p>
    </div>
  );
}

export default function SearchResults({
  data,
  loading,
  error,
  hasSearched,
}: SearchResultsProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div
        className="mt-2 border border-rose-200/80 bg-rose-50/60 px-4 py-3 text-sm text-rose-900"
        role="alert"
      >
        <p className="font-medium">Search failed</p>
        <p className="mt-1 text-rose-800/90">{error}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return <IdleState />;
  }

  if (!data || data.results.length === 0) {
    return <EmptyState query={data?.query || ""} />;
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">{data.total_hits}</span>{" "}
          {data.total_hits === 1 ? "hit" : "hits"} for{" "}
          <span className="font-mono text-slate-800">&ldquo;{data.query}&rdquo;</span>
        </p>
        <p className="font-mono text-[11px] text-slate-400">
          {data.latency_ms}ms · {data.strategy || "bm25"}
        </p>
      </div>

      <div>
        {data.results.map((hit) => (
          <ResultItem key={`${hit.chunk_id}-${hit.document_id}`} hit={hit} />
        ))}
      </div>
    </div>
  );
}
