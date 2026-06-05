import { Activity, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  isLoading?: boolean;
  isError?: boolean;
}

export default function DashboardHeader({
  isLoading,
  isError,
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  const statusLabel = isLoading
    ? t("adminDashboard.header.status.syncing")
    : isError
      ? t("adminDashboard.header.status.unavailable")
      : t("adminDashboard.header.status.liveData");
  const StatusIcon = isError
    ? TriangleAlert
    : isLoading
      ? Activity
      : ShieldCheck;

  return (
    <header className="flex flex-col gap-5 border-b border-[#dde3e9] pb-7 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#72b183]">
          {t("adminDashboard.header.eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#2d3338] md:text-4xl">
          {t("adminDashboard.header.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#596065]">
          {t("adminDashboard.header.description")}
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "h-10 rounded-full border px-4 text-sm font-semibold",
          isError
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : "border-[#bce3c8] bg-white text-[#1a4d2e]",
        )}
      >
        <StatusIcon className={cn("size-4", isLoading && "animate-spin")} />
        {statusLabel}
      </Badge>
    </header>
  );
}
