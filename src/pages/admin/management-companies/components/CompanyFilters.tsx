import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { CompanyStatus } from "@/types/company";

import { Input } from "@/components/ui/input";

export type CompanyStatusFilter = "" | CompanyStatus;

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
  const { t } = useTranslation();

  return (
    <section
      className="rounded bg-white p-4 shadow-sm"
      data-section="CompanyFilters"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3 rounded border  bg-white px-4">
          <Search className="size-4 text-slate-400" />
          <Input
            className="border-0 bg-transparent text-sm text-slate-700 shadow-none focus-visible:ring-0"
            placeholder={t("managementCompanies.filters.searchPlaceholder")}
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as CompanyStatusFilter)
            }
          >
            <option value="">
              {t("managementCompanies.filters.allStatuses")}
            </option>
            <option value="APPROVED">
              {t("managementCompanies.status.approved")}
            </option>
            <option value="PENDING">
              {t("managementCompanies.status.pending")}
            </option>
            <option value="REJECTED">
              {t("managementCompanies.status.rejected")}
            </option>
            <option value="SUSPENDED">
              {t("managementCompanies.status.suspended")}
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}
