import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import type { CompanyStatus } from "@/types/company";

import { Button } from "@/components/ui/button";

export type CompanyRow = {
  id: number;
  name: string;
  industry: string;
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

const statusLabels: Record<CompanyStatus, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export default function CompanyTable({
  rows,
  onApprove,
  onReject,
  onSuspend,
  onRestore,
}: CompanyTableProps) {
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
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
            onClick={() => onReject?.(row)}
          >
            Reject
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
          Suspend
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
          Restore
        </Button>
      );
    }

    return null;
  };

  return (
    <section
      className="rounded-2xl bg-white shadow-sm"
      data-section="CompanyTable"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f3f4ef] text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Employer</th>
              <th className="px-6 py-4">Created at</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-white" : "bg-[#fbfbf7]"}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-800">
                      {row.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{row.name}</p>
                      <p className="text-xs text-slate-500">{row.industry}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {row.employerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {row.employerEmail}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700">{row.createdAt}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      row.status
                        ? statusStyles[row.status]
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.status ? statusLabels[row.status] : "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      title="View detail"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100"
                      asChild
                    >
                      <Link
                        to={`/company/detail/${row.id}`}
                        aria-label="View company detail"
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
    </section>
  );
}
