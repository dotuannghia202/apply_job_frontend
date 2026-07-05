import { Filter, RefreshCcw, Search } from "lucide-react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FilterTextField } from "@/pages/employer/jobs-my-company/components/FilterTextField";
import { LevelDropdown } from "@/pages/employer/jobs-my-company/components/LevelDropdown";
import { SkillFilterPopover } from "@/pages/employer/jobs-my-company/components/SkillFilterPopover";
import { SpecializationFilterPopover } from "@/pages/employer/jobs-my-company/components/SpecializationFilterPopover";
import { fieldClass, type EmployerJobFilters } from "@/pages/employer/jobs-my-company/helper";
import { cn } from "@/lib/utils";

type EmployerJobsFilterPanelProps = {
  filters: EmployerJobFilters;
  isFetching: boolean;
  onFilterChange: (patch: Partial<EmployerJobFilters>) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
};

export function EmployerJobsFilterPanel({
  filters,
  isFetching,
  onFilterChange,
  onSubmit,
  onReset,
}: EmployerJobsFilterPanelProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="size-4" aria-hidden="true" />
              {t("employerJobs.filters.title")}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isFetching}>
              <Search className="size-4" aria-hidden="true" />
              {t("employerJobs.filters.search")}
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCcw className="size-4" aria-hidden="true" />
              {t("employerJobs.filters.reset")}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterTextField
            label={t("employerJobs.filters.keyword")}
            value={filters.keyword}
            onChange={(keyword) => onFilterChange({ keyword })}
            placeholder={t("employerJobs.filters.keywordPlaceholder")}
            className="h-9"
          />
          <FilterTextField
            label={t("employerJobs.filters.jobName")}
            value={filters.name}
            onChange={(name) => onFilterChange({ name })}
            placeholder={t("employerJobs.filters.jobNamePlaceholder")}
            className="h-9"
          />
          <FilterTextField
            label={t("employerJobs.filters.location")}
            value={filters.location}
            onChange={(location) => onFilterChange({ location })}
            placeholder={t("employerJobs.filters.locationPlaceholder")}
            className="h-9"
          />
          <SkillFilterPopover
            value={filters.skill}
            onChange={(skill) => onFilterChange({ skill })}
            className="h-9"
          />

          <FilterTextField
            label={t("employerJobs.filters.minSalary")}
            type="number"
            min={0}
            value={filters.minSalary}
            onChange={(minSalary) => onFilterChange({ minSalary })}
            className="h-9"
          />
          <FilterTextField
            label={t("employerJobs.filters.maxSalary")}
            type="number"
            min={0}
            value={filters.maxSalary}
            onChange={(maxSalary) => onFilterChange({ maxSalary })}
            className="h-9"
          />

          <SpecializationFilterPopover
            value={filters.specialization}
            label={filters.specializationName}
            onChange={(specialization) =>
              onFilterChange({
                specialization: specialization.id,
                specializationName: specialization.name,
              })
            }
            className="h-9"
          />

          <LevelDropdown
            value={filters.levels}
            onChange={(levels) => onFilterChange({ levels })}
            className="h-9"
          />

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase text-slate-500">
              {t("employerJobs.filters.status", "Trạng thái")}
            </Label>
            <select
              value={filters.active}
              onChange={(e) => onFilterChange({ active: e.target.value })}
              className={cn(
                fieldClass,
                "w-full cursor-pointer px-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus-visible:ring-primary focus-visible:border-primary focus:outline-none h-9",
              )}
            >
              <option value="all">{t("employerJobs.status.all", "Tất cả")}</option>
              <option value="active">{t("employerJobs.status.active", "Đang hoạt động")}</option>
              <option value="inactive">{t("employerJobs.status.inactive", "Không hoạt động")}</option>
            </select>
          </div>
        </div>
      </form>
    </Card>
  );
}
