"use client";

import { FormEvent, useId } from "react";

export type SearchFormValues = {
  q: string;
  provider: string;
  service: string;
};

type SearchFormProps = {
  values: SearchFormValues;
  onChange: (values: SearchFormValues) => void;
  onSubmit: (values: SearchFormValues) => void;
  loading?: boolean;
  variant?: "hero" | "compact";
};

const PROVIDERS = [
  { value: "", label: "All providers" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "gcp", label: "GCP" },
];

export default function SearchForm({
  values,
  onChange,
  onSubmit,
  loading = false,
  variant = "hero",
}: SearchFormProps) {
  const queryId = useId();
  const providerId = useId();
  const serviceId = useId();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={
          isHero
            ? "flex flex-col gap-3 sm:flex-row sm:items-stretch"
            : "flex flex-col gap-3"
        }
      >
        <label htmlFor={queryId} className="sr-only">
          Search documentation
        </label>
        <input
          id={queryId}
          type="search"
          name="q"
          value={values.q}
          onChange={(e) => onChange({ ...values, q: e.target.value })}
          placeholder="e.g. VPC peering across regions"
          autoComplete="off"
          autoFocus={isHero}
          className={`w-full border border-slate-300/90 bg-white/90 px-4 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition placeholder:text-slate-400 focus:border-steel-500 focus:ring-2 focus:ring-steel-500/20 ${
            isHero ? "h-12 text-base" : "h-10 text-sm"
          }`}
        />
        <button
          type="submit"
          disabled={loading || !values.q.trim()}
          className={`shrink-0 bg-steel-700 px-6 font-medium text-white transition hover:bg-steel-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel-600 disabled:cursor-not-allowed disabled:opacity-50 ${
            isHero ? "h-12 text-sm tracking-wide" : "h-10 text-sm"
          }`}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <div
        className={`mt-4 grid gap-3 sm:grid-cols-2 ${
          isHero ? "max-w-xl" : ""
        }`}
      >
        <div>
          <label
            htmlFor={providerId}
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500"
          >
            Provider
          </label>
          <select
            id={providerId}
            name="provider"
            value={values.provider}
            onChange={(e) => onChange({ ...values, provider: e.target.value })}
            className="h-10 w-full border border-slate-300/90 bg-white/90 px-3 text-sm text-slate-800 outline-none focus:border-steel-500 focus:ring-2 focus:ring-steel-500/20"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value || "all"} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={serviceId}
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500"
          >
            Service <span className="normal-case tracking-normal text-slate-400">(optional)</span>
          </label>
          <input
            id={serviceId}
            type="text"
            name="service"
            value={values.service}
            onChange={(e) => onChange({ ...values, service: e.target.value })}
            placeholder="e.g. ec2, aks, gke"
            className="h-10 w-full border border-slate-300/90 bg-white/90 px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-steel-500 focus:ring-2 focus:ring-steel-500/20"
          />
        </div>
      </div>
    </form>
  );
}
