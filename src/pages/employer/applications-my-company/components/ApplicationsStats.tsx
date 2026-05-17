import { BriefcaseBusiness, CheckCircle2, Clock3, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
}: {
  total: number;
  pending: number;
  interviewing: number;
  hired: number;
}) {
  const stats: StatItem[] = [
    {
      label: "Total Applicants",
      value: total,
      icon: UsersRound,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Unreviewed (Pending)",
      value: pending,
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Interviewing",
      value: interviewing,
      icon: BriefcaseBusiness,
      tone: "bg-purple-50 text-purple-700",
    },
    {
      label: "Hired",
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
                  {stat.value}
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
