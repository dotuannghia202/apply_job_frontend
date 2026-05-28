import type { CompanyStatus } from "@/types/company";
import type { RoleName } from "@/types/auth";

interface CompanyHeaderProps {
  title: string;
  subtitle: string;
  status: CompanyStatus;
  role: RoleName;
  onStatusChange?: (nextStatus: CompanyStatus) => void;
}

export default function CompanyHeader({
  title,
  subtitle,
  status,
  role,
  onStatusChange,
}: CompanyHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        {role === "ADMIN" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Update status
            </span>
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none"
              value={status}
              onChange={(event) =>
                onStatusChange?.(event.target.value as CompanyStatus)
              }
            >
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        ) : null}
      </div>
    </header>
  );
}
