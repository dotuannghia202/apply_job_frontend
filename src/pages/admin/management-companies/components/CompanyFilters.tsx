import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CompanyStatusFilter = "" | "active" | "pending" | "locked";

interface CompanyFiltersProps {
  keyword: string;
  status: CompanyStatusFilter;
  onKeywordChange: (value: string) => void;
  onStatusChange: (value: CompanyStatusFilter) => void;
}

export default function CompanyFilters({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
}: CompanyFiltersProps) {
  return (
    <section
      className="rounded-2xl bg-white p-4 shadow-sm"
      data-section="CompanyFilters"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search className="size-4 text-slate-400" />
          <Input
            className="border-0 bg-transparent text-sm text-slate-700 shadow-none focus-visible:ring-0"
            placeholder="Search by company name..."
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as CompanyStatusFilter)
            }
          >
            <option value="">All Statuses</option>
            <option value="active">Approved</option>
            <option value="pending">Pending</option>
            <option value="locked">Rejected</option>
          </select>
          <Button
            type="button"
            className="h-10 w-10 rounded-xl bg-emerald-600 p-0 text-white hover:bg-emerald-700"
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
