import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabels } from "@/pages/employer/applications-my-company/helper";
import type { ApplicationStatus } from "@/types/application";

const statusStyles: Record<ApplicationStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  REVIEWING: "border-sky-200 bg-sky-50 text-sky-700",
  INTERVIEW: "border-purple-200 bg-purple-50 text-purple-700",
  ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-slate-200 bg-slate-100 text-slate-600",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]",
        statusStyles[status],
      )}
    >
      {statusLabels[status] ?? status}
    </Badge>
  );
}
