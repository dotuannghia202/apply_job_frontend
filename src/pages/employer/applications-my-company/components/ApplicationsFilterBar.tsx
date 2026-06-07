import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/pages/employer/applications-my-company/components/FilterSelect";
import {
  type ApplicationFilters,
  type ApplicationSort,
  type ApplicationStatusFilter,
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
  const { t } = useTranslation();
  const statusOptions: Array<{
    label: string;
    value: ApplicationStatusFilter;
  }> = [
    { label: t("employerApplications.status.all"), value: "ALL" },
    { label: t("employerApplications.status.PENDING"), value: "PENDING" },
    { label: t("employerApplications.status.REVIEWING"), value: "REVIEWING" },
    { label: t("employerApplications.status.INTERVIEW"), value: "INTERVIEW" },
    { label: t("employerApplications.status.ACCEPTED"), value: "ACCEPTED" },
    { label: t("employerApplications.status.REJECTED"), value: "REJECTED" },
  ];
  const sortOptions: Array<{ label: string; value: ApplicationSort }> = [
    {
      label: t("employerApplications.sort.matchHighToLow"),
      value: "MATCH_DESC",
    },
    {
      label: t("employerApplications.sort.matchLowToHigh"),
      value: "MATCH_ASC",
    },
    {
      label: t("employerApplications.sort.dateNewest"),
      value: "DATE_DESC",
    },
    {
      label: t("employerApplications.sort.dateOldest"),
      value: "DATE_ASC",
    },
  ];

  return (
    <section className="sticky top-18.25 z-30 rounded-xl border border-primary bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-[minmax(260px,1.4fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(220px,1.2fr)]">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase  text-slate-500">
            {t("employerApplications.filters.search")}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder={t("employerApplications.filters.searchPlaceholder")}
              className="h-10 rounded-md border-primary bg-white pl-9 text-sm shadow-none"
            />
          </div>
        </div>

        <FilterSelect
          label={t("employerApplications.filters.job")}
          value={filters.jobId}
          options={jobOptions}
          searchPlaceholder={t("employerApplications.filters.searchJobs")}
          onChange={(jobId) => onChange({ jobId })}
        />

        <FilterSelect
          label={t("employerApplications.filters.status")}
          value={filters.status}
          options={statusOptions}
          onChange={(status) => onChange({ status })}
        />

        <FilterSelect
          label={t("employerApplications.filters.sortBy")}
          value={filters.sort}
          options={sortOptions}
          onChange={(sort) => onChange({ sort })}
        />
      </div>
    </section>
  );
}
