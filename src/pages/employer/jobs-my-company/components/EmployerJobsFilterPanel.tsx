import { Filter, RefreshCcw, Search } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FilterTextField } from "@/pages/employer/jobs-my-company/components/FilterTextField";
import { LevelToggleGroup } from "@/pages/employer/jobs-my-company/components/LevelToggleGroup";
import { SkillFilterPopover } from "@/pages/employer/jobs-my-company/components/SkillFilterPopover";
import { SpecializationFilterPopover } from "@/pages/employer/jobs-my-company/components/SpecializationFilterPopover";
import { type EmployerJobFilters } from "@/pages/employer/jobs-my-company/helper";

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
  return (
    <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="size-4" aria-hidden="true" />
              Filters
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Calls `GET /jobs/hr` with the same query parameters as the backend
              endpoint.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isFetching}>
              <Search className="size-4" aria-hidden="true" />
              Search
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterTextField
            label="Keyword"
            value={filters.keyword}
            onChange={(keyword) => onFilterChange({ keyword })}
            placeholder="Search all fields"
          />
          <FilterTextField
            label="Job name"
            value={filters.name}
            onChange={(name) => onFilterChange({ name })}
            placeholder="Frontend Developer"
          />
          <FilterTextField
            label="Location"
            value={filters.location}
            onChange={(location) => onFilterChange({ location })}
            placeholder="Ho Chi Minh"
          />
          <SkillFilterPopover
            value={filters.skill}
            onChange={(skill) => onFilterChange({ skill })}
          />

          <FilterTextField
            label="Min salary"
            type="number"
            min={0}
            value={filters.minSalary}
            onChange={(minSalary) => onFilterChange({ minSalary })}
          />
          <FilterTextField
            label="Max salary"
            type="number"
            min={0}
            value={filters.maxSalary}
            onChange={(maxSalary) => onFilterChange({ maxSalary })}
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
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Levels
          </Label>
          <LevelToggleGroup
            value={filters.levels}
            onChange={(levels) => onFilterChange({ levels })}
          />
        </div>
      </form>
    </Card>
  );
}
