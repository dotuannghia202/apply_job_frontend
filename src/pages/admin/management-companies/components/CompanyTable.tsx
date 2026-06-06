import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { CompanyStatus } from "@/types/company";

import { Button } from "@/components/ui/button";

export type CompanyRow = {
  id: number;
  name: string;
  logo: string;
  employerName: string;
  employerEmail: string;
  status?: CompanyStatus;
  jobs: number;
  createdAt: string;
};

interface CompanyTableProps {
  rows: CompanyRow[];
  onApprove?: (company: CompanyRow) => void;
  onReject?: (company: CompanyRow) => void;
  onSuspend?: (company: CompanyRow) => void;
  onRestore?: (company: CompanyRow) => void;
}

const statusStyles: Record<CompanyStatus, string> = {
  APPROVED: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-rose-50 text-rose-700",
  REJECTED: "bg-rose-100 text-rose-700",
  SUSPENDED: "bg-amber-100 text-amber-900",
};

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

export default function CompanyTable({
  rows,
  onApprove,
  onReject,
  onSuspend,
  onRestore,
}: CompanyTableProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const statusLabels: Record<CompanyStatus, string> = {
    APPROVED: t("managementCompanies.status.approved"),
    PENDING: t("managementCompanies.status.pending"),
    REJECTED: t("managementCompanies.status.rejected"),
    SUSPENDED: t("managementCompanies.status.suspended"),
  };

  const renderActionButtons = (row: CompanyRow) => {
    if (row.status === "PENDING") {
      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
            onClick={() => onApprove?.(row)}
          >
            {t("managementCompanies.table.actions.approve")}
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
            onClick={() => onReject?.(row)}
          >
            {t("managementCompanies.table.actions.reject")}
          </Button>
        </div>
      );
    }

    if (row.status === "APPROVED") {
      return (
        <Button
          type="button"
          size="sm"
          className="rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white hover:bg-amber-700"
          onClick={() => onSuspend?.(row)}
        >
          {t("managementCompanies.table.actions.suspend")}
        </Button>
      );
    }

    if (row.status === "SUSPENDED") {
      return (
        <Button
          type="button"
          size="sm"
          className="rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
          onClick={() => onRestore?.(row)}
        >
          {t("managementCompanies.table.actions.restore")}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="overflow-x-auto border border-primary rounded">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-primary text-[12px] text-white font-semibold uppercase">
          <tr>
            <th className="px-6 py-4">
              {t("managementCompanies.table.columns.company")}
            </th>
            <th className="px-6 py-4">
              {t("managementCompanies.table.columns.employer")}
            </th>
            <th className="px-6 py-4">
              {t("managementCompanies.table.columns.createdAt")}
            </th>
            <th className="px-6 py-4">
              {t("managementCompanies.table.columns.status")}
            </th>
            <th className="px-6 py-4 text-right">
              {t("managementCompanies.table.columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className={index % 2 === 0 ? "bg-white" : "bg-primary/10"}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {row.logo ? (
                    <img
                      src={row.logo}
                      alt={row.name}
                      className="flex size-10 items-center justify-center rounded border border-primary/20 text-sm font-semibold text-emerald-800"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-800">
                      {row.name.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">{row.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {row.employerName}
                  </p>
                  <p className="text-xs text-slate-500">{row.employerEmail}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-700">
                {formatDate(row.createdAt)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    row.status
                      ? statusStyles[row.status]
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {row.status
                    ? statusLabels[row.status]
                    : t("managementCompanies.table.unknown")}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Button
                    title={t("managementCompanies.table.actions.viewDetail")}
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100"
                    asChild
                  >
                    <Link
                      to={`/company/detail/${row.id}`}
                      aria-label={t(
                        "managementCompanies.table.actions.viewDetail",
                      )}
                    >
                      <Eye className="size-4" />
                    </Link>
                  </Button>
                  {renderActionButtons(row)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
