import type { Provider } from "@/types/search";

const PROVIDER_STYLES: Record<string, string> = {
  aws: "bg-amber-50 text-amber-900 ring-amber-200/80",
  azure: "bg-sky-50 text-sky-900 ring-sky-200/80",
  gcp: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
};

function normalizeProvider(provider: Provider): string {
  return String(provider || "").trim().toLowerCase();
}

function displayLabel(provider: Provider): string {
  const key = normalizeProvider(provider);
  if (key === "aws") return "AWS";
  if (key === "azure") return "Azure";
  if (key === "gcp") return "GCP";
  return provider ? String(provider).toUpperCase() : "—";
}

export default function ProviderBadge({ provider }: { provider: Provider }) {
  const key = normalizeProvider(provider);
  const styles =
    PROVIDER_STYLES[key] ?? "bg-slate-100 text-slate-700 ring-slate-200/80";

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-wide ring-1 ring-inset ${styles}`}
    >
      {displayLabel(provider)}
    </span>
  );
}
