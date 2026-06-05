import { Eye, Lock, Mail, Unlock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";
import type { RoleName } from "@/types/auth";

export type ManageUserRow = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role: RoleName;
  status: "active" | "inactive";
  isActive: boolean;
};

type ManageUserTableProps = {
  rows: ManageUserRow[];
  isLoading: boolean;
  isError: boolean;
  isUpdatingId?: number | null;
  total?: number;
  page?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onToggleStatus: (row: ManageUserRow) => void;
};

const statusStyles: Record<ManageUserRow["status"], string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-rose-50 text-rose-700",
};

const roleStyles: Record<ManageUserRow["role"], string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  EMPLOYER: "bg-sky-50 text-sky-700",
  CANDIDATE: "bg-slate-100 text-slate-600",
};

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

export default function ManageUserTable({
  rows,
  isLoading,
  isError,
  isUpdatingId,
  total,
  page,
  pageSize,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  onToggleStatus,
}: ManageUserTableProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value);

  const roleLabels: Record<RoleName, string> = {
    ADMIN: t("managementUsers.roles.admin"),
    EMPLOYER: t("managementUsers.roles.employer"),
    CANDIDATE: t("managementUsers.roles.candidate"),
  };
  const statusLabels: Record<ManageUserRow["status"], string> = {
    active: t("managementUsers.status.active"),
    inactive: t("managementUsers.status.inactive"),
  };

  const resolvedTotal = total ?? rows.length;
  const resolvedPageSize = pageSize ?? rows.length;
  const resolvedPage = page ?? 1;
  const startIndex =
    resolvedTotal === 0 ? 0 : (resolvedPage - 1) * resolvedPageSize + 1;
  const endIndex = Math.min(resolvedTotal, resolvedPage * resolvedPageSize);

  return (
    <section className="overflow-hidden rounded-lg border  bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t("managementUsers.table.title")}
          </h2>
          <p className="text-xs text-slate-500">
            {t("managementUsers.table.description")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
            {t("managementUsers.table.totalUsers", {
              value: formatNumber(resolvedTotal),
            })}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
            {t("managementUsers.table.activeUsers", {
              value: formatNumber(rows.filter((row) => row.isActive).length),
            })}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3">
                {t("managementUsers.table.columns.user")}
              </th>
              <th className="px-6 py-3">
                {t("managementUsers.table.columns.role")}
              </th>
              <th className="px-6 py-3">
                {t("managementUsers.table.columns.status")}
              </th>
              <th className="px-6 py-3 text-right">
                {t("managementUsers.table.columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isError ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-rose-600"
                >
                  {t("managementUsers.table.error")}
                </td>
              </tr>
            ) : null}
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  {t("managementUsers.table.loading")}
                </td>
              </tr>
            ) : null}
            {!isLoading && !isError && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  {t("managementUsers.table.empty")}
                </td>
              </tr>
            ) : null}
            {!isLoading && !isError
              ? rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                          <img
                            src={row.avatarUrl || avatarPlaceholder}
                            alt={
                              row.name || t("managementUsers.table.unknownUser")
                            }
                            className="size-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = avatarPlaceholder;
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {row.name || t("managementUsers.table.unknownUser")}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail className="size-3" />
                            {row.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[row.role]}`}
                      >
                        {roleLabels[row.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}
                      >
                        {statusLabels[row.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className=" text-green-600 hover:bg-green-100 hover:text-green-600"
                          aria-label={t(
                            "managementUsers.table.actions.viewDetail",
                          )}
                          title={t("managementUsers.table.actions.viewDetail")}
                          asChild
                        >
                          <Link to={`/admin/users/detail/${row.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onToggleStatus(row)}
                          disabled={isUpdatingId === row.id}
                          aria-label={
                            row.isActive
                              ? t("managementUsers.table.actions.lock")
                              : t("managementUsers.table.actions.unlock")
                          }
                          title={
                            row.isActive
                              ? t("managementUsers.table.actions.lock")
                              : t("managementUsers.table.actions.unlock")
                          }
                        >
                          {row.isActive ? (
                            <Lock className="size-4" />
                          ) : (
                            <Unlock className="size-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t("managementUsers.table.pagination.summary", {
            start: formatNumber(startIndex),
            end: formatNumber(endIndex),
            total: formatNumber(resolvedTotal),
          })}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200"
            onClick={onPrevPage}
            disabled={!hasPrevPage || isLoading}
          >
            {t("managementUsers.table.pagination.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200"
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
          >
            {t("managementUsers.table.pagination.next")}
          </Button>
        </div>
      </div>
    </section>
  );
}
