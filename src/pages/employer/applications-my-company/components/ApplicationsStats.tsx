import { BriefcaseBusiness, CheckCircle2, Clock3, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

type StatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
};

export function ApplicationsStats({
  total,
  pending,
  interviewing,
  hired,
  locale,
}: {
  total: number;
  pending: number;
  interviewing: number;
  hired: number;
  locale: string;
}) {
  const { t } = useTranslation();
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);
  const stats: StatItem[] = [
    {
      label: t("employerApplications.stats.totalApplicants"),
      value: total,
      icon: UsersRound,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: t("employerApplications.stats.pending"),
      value: pending,
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: t("employerApplications.stats.interviewing"),
      value: interviewing,
      icon: BriefcaseBusiness,
      tone: "bg-purple-50 text-purple-700",
    },
    {
      label: t("employerApplications.stats.hired"),
      value: hired,
      icon: CheckCircle2,
      tone: "bg-green-50 text-green-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  {formatNumber(stat.value)}
                </p>
              </div>
              <div className={`flex size-11 items-center justify-center rounded-xl ${stat.tone}`}>
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
