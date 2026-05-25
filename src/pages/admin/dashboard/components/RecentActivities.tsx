import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Layers3,
  UserRoundCheck,
  UserRoundCog,
  Users,
} from "lucide-react";

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

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("vi-VN").format(value ?? 0);

export default function RecentActivities({
  stats,
  isLoading,
  isError,
}: RecentActivitiesProps) {
  const rows: LedgerRow[] = [
    {
      label: "Tổng người dùng",
      value: stats?.totalUsers,
      scope: "Toàn hệ thống",
      status: "Core",
      icon: Users,
      tone: "bg-[#72b183]/10 text-[#5a936a]",
    },
    {
      label: "Ứng viên",
      value: stats?.totalCandidates,
      scope: "Tài khoản candidate",
      status: "User",
      icon: UserRoundCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Nhà tuyển dụng",
      value: stats?.totalEmployers,
      scope: "Tài khoản employer",
      status: "User",
      icon: UserRoundCog,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Công ty",
      value: stats?.totalCompanies,
      scope: "Hồ sơ doanh nghiệp",
      status: "Org",
      icon: Building2,
      tone: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "Việc đang mở",
      value: stats?.totalActiveJobs,
      scope: "Job active",
      status: "Hiring",
      icon: BriefcaseBusiness,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Lượt ứng tuyển",
      value: stats?.totalApplications,
      scope: "Application submitted",
      status: "Flow",
      icon: ClipboardList,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "Ngành có việc làm",
      value: stats?.industryStats.length,
      scope: "Industry buckets",
      status: "Taxonomy",
      icon: Layers3,
      tone: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <Card className="overflow-hidden rounded-lg border-0 bg-white py-0 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-[#eaeef3] bg-[#f7f9fc] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-extrabold text-[#2d3338]">
            Bảng chỉ số hệ thống
          </CardTitle>
          <p className="mt-2 text-sm text-[#596065]">
            Tổng hợp dữ liệu theo phạm vi quản trị.
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg border-[#dde3e9] bg-white px-3 py-1 text-[#596065]",
            isError && "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {isError ? "Mất kết nối" : "Quản trị"}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#e3e9ee] hover:bg-[#e3e9ee]">
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#596065]">
                Chỉ số
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#596065]">
                Phạm vi
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#596065]">
                Trạng thái
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.18em] text-[#596065]">
                Tổng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <LedgerTableRow
                key={row.label}
                isError={isError}
                isLoading={isLoading}
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
}: {
  row: LedgerRow;
  isLoading?: boolean;
  isError?: boolean;
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
            {isError ? "--" : formatNumber(row.value)}
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}
