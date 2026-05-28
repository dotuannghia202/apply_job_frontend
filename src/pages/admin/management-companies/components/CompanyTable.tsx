import { MoreHorizontal } from "lucide-react";

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
}

const statusStyles: Record<CompanyStatus, string> = {
  APPROVED: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-rose-50 text-rose-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

const statusLabels: Record<CompanyStatus, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
};

export default function CompanyTable({ rows }: CompanyTableProps) {
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
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
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
