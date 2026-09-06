"use client";

import { useMemo, useState } from "react";

import { applyFilters, DEFAULT_FILTERS } from "@/lib/filter";
import { formatDate, formatN } from "@/lib/format";
import { nctUrl, TRIALS, uniqueSponsors } from "@/lib/trials";
import {
  MECHANISMS,
  PREVENTION_TYPES,
  STATUSES,
  type SortKey,
  type Trial,
  type TrialFilters,
  type TrialStatus,
} from "@/lib/types";

const HUME_URL = "https://x.com/drsamuelbhume/status/2096225931517952462";

function StatusChip({ status }: { status: TrialStatus }) {
  const tone =
    status === "Recruiting"
      ? "text-[#2f6b4f] bg-[#2f6b4f]/10"
      : status === "Active, not recruiting"
        ? "text-[#3d5a80] bg-[#3d5a80]/10"
        : "text-[#6a675e] bg-[#1c1b17]/6";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ${tone}`}
    >
      {status}
    </span>
  );
}

function LoweringBar({ trial }: { trial: Trial }) {
  if (trial.lpLoweringPct == null) {
    return <span className="text-[#6a675e]">—</span>;
  }
  const width = Math.min(100, trial.lpLoweringPct);
  const color = trial.failedReference ? "bg-[#d96a2b]" : "bg-[#5d7ea3]";
  return (
    <div className="min-w-28">
      <div className="mb-1 text-[12px] tabular-nums">−{trial.lpLoweringPct}%</div>
      <div className="h-1.5 rounded-full bg-[#e8e5dc]">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function PersonalBadge() {
  return (
    <span
      className="ml-1.5 inline-flex items-center rounded-full border border-[#c4b18a] px-1.5 py-px text-[10px] font-medium tracking-wide text-[#8a7040]"
      title="Personally relevant. Mount Sinai Fuster Heart Hospital prevention trial."
    >
      personal
    </span>
  );
}

function FailedBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-[#d96a2b]/12 px-1.5 py-px text-[10px] font-medium tracking-wide text-[#b4531a]">
      failed reference
    </span>
  );
}

function NctLink({ nctId }: { nctId: string }) {
  return (
    <a
      href={nctUrl(nctId)}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[12px] text-[#3d5a80] underline decoration-[#3d5a80]/30 underline-offset-2 hover:decoration-[#3d5a80]"
    >
      {nctId}
    </a>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | "all";
  options: readonly T[];
  onChange: (next: T | "all") => void;
}) {
  return (
    <label className="flex min-w-40 flex-col gap-1 text-[11px] font-medium tracking-wide text-[#6a675e] uppercase">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "all")}
        className="h-9 rounded-md border border-[#d9d5cb] bg-[#fffcf6] px-2.5 text-[13px] font-normal tracking-normal text-[#1c1b17]"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TrialExplorer() {
  const [filters, setFilters] = useState<TrialFilters>(DEFAULT_FILTERS);
  const sponsors = useMemo(() => uniqueSponsors(), []);
  const rows = useMemo(() => applyFilters(TRIALS, filters), [filters]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 border-b border-[#d9d5cb] pb-4">
        <FilterSelect
          label="Status"
          value={filters.status}
          options={STATUSES}
          onChange={(status) => setFilters((f) => ({ ...f, status }))}
        />
        <FilterSelect
          label="Mechanism / class"
          value={filters.mechanism}
          options={MECHANISMS}
          onChange={(mechanism) => setFilters((f) => ({ ...f, mechanism }))}
        />
        <FilterSelect
          label="Prevention"
          value={filters.prevention}
          options={PREVENTION_TYPES}
          onChange={(prevention) => setFilters((f) => ({ ...f, prevention }))}
        />
        <FilterSelect
          label="Sponsor"
          value={filters.sponsor}
          options={sponsors}
          onChange={(sponsor) => setFilters((f) => ({ ...f, sponsor }))}
        />
        <label className="flex min-w-40 flex-col gap-1 text-[11px] font-medium tracking-wide text-[#6a675e] uppercase">
          Sort
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value as SortKey }))
            }
            className="h-9 rounded-md border border-[#d9d5cb] bg-[#fffcf6] px-2.5 text-[13px] font-normal tracking-normal text-[#1c1b17]"
          >
            <option value="status">Status</option>
            <option value="completion">Primary completion</option>
          </select>
        </label>
        <p className="ml-auto text-[12px] text-[#6a675e]">
          {rows.length} of {TRIALS.length}
        </p>
      </div>

      <div className="mt-5 hidden lg:block">
        <div className="overflow-x-auto rounded-lg border border-[#d9d5cb] bg-[#fffcf6]">
          <table className="w-full min-w-[1280px] border-collapse text-left text-[13px]">
            <thead className="bg-[#e8e5dc] text-[11px] font-semibold tracking-wide text-[#4e4b43] uppercase">
              <tr>
                <th className="px-3 py-2.5">Trial</th>
                <th className="px-3 py-2.5">Drug / intervention</th>
                <th className="px-3 py-2.5">Sponsor</th>
                <th className="px-3 py-2.5">Class</th>
                <th className="px-3 py-2.5">Lp(a) lowering</th>
                <th className="px-3 py-2.5">Dose</th>
                <th className="px-3 py-2.5">Population</th>
                <th className="px-3 py-2.5">Threshold</th>
                <th className="px-3 py-2.5">N</th>
                <th className="px-3 py-2.5">Primary endpoint</th>
                <th className="px-3 py-2.5">Start / completion</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Key difference</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((trial) => (
                <tr key={trial.id} className="border-t border-[#ece8de] align-top">
                  <td className="px-3 py-3">
                    <div className="font-semibold">
                      {trial.name}
                      {trial.failedReference ? <FailedBadge /> : null}
                      {trial.personal ? <PersonalBadge /> : null}
                    </div>
                    <div className="mt-1">
                      <NctLink nctId={trial.nctId} />
                    </div>
                  </td>
                  <td className="px-3 py-3">{trial.agent}</td>
                  <td className="px-3 py-3">{trial.company}</td>
                  <td className="px-3 py-3">{trial.mechanism}</td>
                  <td className="px-3 py-3">
                    <LoweringBar trial={trial} />
                  </td>
                  <td className="px-3 py-3">{trial.dose}</td>
                  <td className="px-3 py-3 text-[#3f3d37]">{trial.population}</td>
                  <td className="px-3 py-3">{trial.biomarkerThreshold ?? "—"}</td>
                  <td className="px-3 py-3 tabular-nums">
                    {formatN(trial.enrollment, trial.enrollmentType)}
                  </td>
                  <td className="px-3 py-3 text-[#3f3d37]">{trial.primaryEndpoint}</td>
                  <td className="px-3 py-3 whitespace-nowrap tabular-nums">
                    {formatDate(trial.startDate)}
                    <span className="text-[#6a675e]"> – </span>
                    {formatDate(trial.primaryCompletion)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusChip status={trial.status} />
                  </td>
                  <td className="px-3 py-3 text-[#3f3d37]">{trial.keyDifference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:hidden">
        {rows.map((trial) => (
          <article
            key={trial.id}
            className="rounded-lg border border-[#d9d5cb] bg-[#fffcf6] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold">
                  {trial.name}
                  {trial.failedReference ? <FailedBadge /> : null}
                  {trial.personal ? <PersonalBadge /> : null}
                </h2>
                <div className="mt-1">
                  <NctLink nctId={trial.nctId} />
                </div>
              </div>
              <StatusChip status={trial.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[13px]">
              <Field label="Drug">{trial.agent}</Field>
              <Field label="Sponsor">{trial.company}</Field>
              <Field label="Class">{trial.mechanism}</Field>
              <Field label="Dose">{trial.dose}</Field>
              <Field label="N">{formatN(trial.enrollment, trial.enrollmentType)}</Field>
              <Field label="Prevention">{trial.prevention}</Field>
              <Field label="Threshold">{trial.biomarkerThreshold ?? "—"}</Field>
              <Field label="Dates">
                {formatDate(trial.startDate)} – {formatDate(trial.primaryCompletion)}
              </Field>
              {trial.lpLoweringPct != null ? (
                <div className="col-span-2">
                  <dt className="text-[11px] font-medium tracking-wide text-[#6a675e] uppercase">
                    Lp(a) lowering
                  </dt>
                  <dd className="mt-1">
                    <LoweringBar trial={trial} />
                  </dd>
                </div>
              ) : null}
              <Field label="Population" wide>
                {trial.population}
              </Field>
              <Field label="Primary endpoint" wide>
                {trial.primaryEndpoint}
              </Field>
              <Field label="Key difference" wide>
                {trial.keyDifference}
              </Field>
            </dl>
          </article>
        ))}
      </div>

      <footer className="mt-10 border-t border-[#d9d5cb] pt-4 text-[12px] leading-relaxed text-[#6a675e]">
        <p>
          Trial facts are curated from{" "}
          <a
            href="https://clinicaltrials.gov"
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            ClinicalTrials.gov
          </a>
          . Primary endpoints are copied from study records, not invented. Lp(a)
          percent-lowering bars are from prior trials as summarized by Dr Samuel B
          Hume,{" "}
          <a href={HUME_URL} className="underline underline-offset-2" target="_blank" rel="noreferrer">
            design inspiration
          </a>
          . Static seed. No login, no PHI, no live registry feed.
        </p>
      </footer>
    </div>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-[11px] font-medium tracking-wide text-[#6a675e] uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-[#1c1b17]">{children}</dd>
    </div>
  );
}

