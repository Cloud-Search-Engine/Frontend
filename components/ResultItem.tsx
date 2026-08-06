import ProviderBadge from "@/components/ProviderBadge";
import type { SearchHit } from "@/types/search";

function formatScore(score: number): string {
  if (!Number.isFinite(score)) return "—";
  return score.toFixed(3);
}

export default function ResultItem({ hit }: { hit: SearchHit }) {
  const subtitle = [hit.heading, hit.section].filter(Boolean).join(" · ");

  return (
    <article className="group border-b border-slate-200/80 py-5 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <ProviderBadge provider={hit.provider} />
            {hit.service ? (
              <span className="font-mono text-[11px] text-slate-500">
                {hit.service}
              </span>
            ) : null}
            {hit.category ? (
              <span className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                {hit.category}
              </span>
            ) : null}
          </div>

          <h3 className="text-base font-medium leading-snug text-slate-900 transition-colors group-hover:text-steel-700">
            {hit.source_url ? (
              <a
                href={hit.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {hit.title || "Untitled"}
              </a>
            ) : (
              hit.title || "Untitled"
            )}
          </h3>

          {subtitle ? (
            <p className="mt-1 font-mono text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
            Score
          </p>
          <p className="mt-0.5 font-mono text-sm text-steel-700">
            {formatScore(hit.score)}
          </p>
        </div>
      </div>

      {hit.passage ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          {hit.passage}
        </p>
      ) : null}

      {hit.source_url ? (
        <a
          href={hit.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-steel-600 transition-colors hover:text-steel-800"
        >
          <span className="truncate max-w-[min(100%,28rem)]">
            {hit.source_url.replace(/^https?:\/\//, "")}
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </article>
  );
}
