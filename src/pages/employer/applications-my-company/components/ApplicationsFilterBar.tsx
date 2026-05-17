import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/pages/employer/applications-my-company/components/FilterSelect";
import {
  sortOptions,
  statusOptions,
  type ApplicationFilters,
} from "@/pages/employer/applications-my-company/helper";

type ApplicationsFilterBarProps = {
  filters: ApplicationFilters;
  jobOptions: Array<{ label: string; value: string }>;
  onChange: (patch: Partial<ApplicationFilters>) => void;
};

export function ApplicationsFilterBar({
  filters,
  jobOptions,
  onChange,
}: ApplicationsFilterBarProps) {
  return (
    <section className="sticky top-[73px] z-30 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-[minmax(260px,1.4fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(220px,1.2fr)]">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Search candidate name or email..."
              className="h-10 rounded-md border-slate-200 bg-white pl-9 text-sm shadow-none focus-visible:ring-emerald-500/20"
            />
          </div>
        </div>

        <FilterSelect
          label="Filter by Job"
          value={filters.jobId}
          options={jobOptions}
          searchPlaceholder="Search jobs..."
          onChange={(jobId) => onChange({ jobId })}
        />

        <FilterSelect
          label="Status"
          value={filters.status}
          options={statusOptions}
          onChange={(status) => onChange({ status })}
        />

        <FilterSelect
          label="Sort by"
          value={filters.sort}
          options={sortOptions}
          onChange={(sort) => onChange({ sort })}
        />
      </div>
    </section>
  );
}
