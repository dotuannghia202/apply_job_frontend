import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

type EmployerJobStatsProps = {
  total: number;
  activeCount: number;
  inactiveCount: number;
};

export function EmployerJobStats({
  total,
  activeCount,
  inactiveCount,
}: EmployerJobStatsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("vi") ? "vi-VN" : "en-US";
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-500">
          {t("employerJobs.stats.totalFound")}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-950">
          {formatNumber(total)}
        </p>
      </Card>
      <Card className="border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-500">
          {t("employerJobs.stats.activeOnPage")}
        </p>
        <p className="mt-2 text-3xl font-bold text-green-700">
          {formatNumber(activeCount)}
        </p>
      </Card>
      <Card className="border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-500">
          {t("employerJobs.stats.inactiveOnPage")}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-700">
          {formatNumber(inactiveCount)}
        </p>
      </Card>
    </div>
  );
}
