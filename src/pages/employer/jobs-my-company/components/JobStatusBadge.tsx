import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function JobStatusBadge({ active }: { active: boolean }) {
  const { t } = useTranslation();

  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-bold",
        active
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-slate-200 bg-slate-100 text-slate-600",
      )}
    >
      {active
        ? t("employerJobs.status.active")
        : t("employerJobs.status.inactive")}
    </Badge>
  );
}
