import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Layers3,
  UserRoundCheck,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AdminDashboardStats } from "@/types/admin-dashboard";

interface RecentActivitiesProps {
  stats?: AdminDashboardStats | null;
  isLoading?: boolean;
  isError?: boolean;
}

type LedgerRow = {
  label: string;
  value: number | undefined;
  scope: string;
  status: string;
  icon: typeof Users;
  tone: string;
};

const getLocale = (language: string) => (language === "vi" ? "vi-VN" : "en-US");

const formatNumber = (value: number | undefined, locale: string) =>
  new Intl.NumberFormat(locale).format(value ?? 0);

export default function RecentActivities({
  stats,
  isLoading,
  isError,
}: RecentActivitiesProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const rows: LedgerRow[] = [
    {
      label: t("adminDashboard.ledger.rows.totalUsers.label"),
      value: stats?.totalUsers,
      scope: t("adminDashboard.ledger.rows.totalUsers.scope"),
      status: t("adminDashboard.ledger.status.core"),
      icon: Users,
      tone: "bg-[#72b183]/10 text-[#5a936a]",
    },
    {
      label: t("adminDashboard.ledger.rows.candidates.label"),
      value: stats?.totalCandidates,
      scope: t("adminDashboard.ledger.rows.candidates.scope"),
      status: t("adminDashboard.ledger.status.user"),
      icon: UserRoundCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: t("adminDashboard.ledger.rows.employers.label"),
      value: stats?.totalEmployers,
      scope: t("adminDashboard.ledger.rows.employers.scope"),
      status: t("adminDashboard.ledger.status.user"),
      icon: UserRoundCog,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: t("adminDashboard.ledger.rows.companies.label"),
      value: stats?.totalCompanies,
      scope: t("adminDashboard.ledger.rows.companies.scope"),
      status: t("adminDashboard.ledger.status.org"),
      icon: Building2,
      tone: "bg-cyan-50 text-cyan-700",
    },
    {
      label: t("adminDashboard.ledger.rows.activeJobs.label"),
      value: stats?.totalActiveJobs,
      scope: t("adminDashboard.ledger.rows.activeJobs.scope"),
      status: t("adminDashboard.ledger.status.hiring"),
      icon: BriefcaseBusiness,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: t("adminDashboard.ledger.rows.applications.label"),
      value: stats?.totalApplications,
      scope: t("adminDashboard.ledger.rows.applications.scope"),
      status: t("adminDashboard.ledger.status.flow"),
      icon: ClipboardList,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: t("adminDashboard.ledger.rows.industries.label"),
      value: stats?.industryStats?.length,
      scope: t("adminDashboard.ledger.rows.industries.scope"),
      status: t("adminDashboard.ledger.status.taxonomy"),
      icon: Layers3,
      tone: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <Card className="overflow-hidden rounded-lg border-0 bg-white py-0 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-[#eaeef3] bg-[#f7f9fc] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-extrabold text-[#2d3338]">
            {t("adminDashboard.ledger.title")}
          </CardTitle>
          <p className="mt-2 text-sm text-[#596065]">
            {t("adminDashboard.ledger.description")}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg border-[#dde3e9] bg-white px-3 py-1 text-[#596065]",
            isError && "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {isError
            ? t("adminDashboard.ledger.badge.error")
            : t("adminDashboard.ledger.badge.admin")}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#e3e9ee] hover:bg-[#e3e9ee]">
              <TableHead className="px-6 py-4 text-[14px] font-bold uppercase  text-[#596065]">
                <p className="ml-8">
                  {t("adminDashboard.ledger.columns.metric")}
                </p>
              </TableHead>
              <TableHead className="px-6 py-4 text-[14px] font-bold uppercase  text-[#596065]">
                {t("adminDashboard.ledger.columns.scope")}
              </TableHead>
              <TableHead className="px-6 py-4 text-[14px] font-bold uppercase  text-[#596065]">
                {t("adminDashboard.ledger.columns.status")}
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-[14px] font-bold uppercase  text-[#596065]">
                {t("adminDashboard.ledger.columns.total")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <LedgerTableRow
                key={row.label}
                isError={isError}
                isLoading={isLoading}
                locale={locale}
                row={row}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LedgerTableRow({
  row,
  isLoading,
  isError,
  locale,
}: {
  row: LedgerRow;
  isLoading?: boolean;
  isError?: boolean;
  locale: string;
}) {
  const Icon = row.icon;

  return (
    <TableRow className="hover:bg-[#f7f9fc]">
      <TableCell className="px-6 py-5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              row.tone,
            )}
          >
            <Icon className="size-4" />
          </span>
          <span className="font-semibold text-[#2d3338]">{row.label}</span>
        </div>
      </TableCell>
      <TableCell className="px-6 py-5 text-sm text-[#596065]">
        {row.scope}
      </TableCell>
      <TableCell className="px-6 py-5">
        <Badge className="rounded-lg bg-[#f1f4f7] text-[#596065] hover:bg-[#f1f4f7]">
          {row.status}
        </Badge>
      </TableCell>
      <TableCell className="px-6 py-5 text-right">
        {isLoading ? (
          <div className="ml-auto h-5 w-16 animate-pulse rounded bg-slate-200" />
        ) : (
          <span className="text-base font-extrabold text-[#2d3338]">
            {isError ? "--" : formatNumber(row.value, locale)}
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}
