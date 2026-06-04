import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Layers3,
  UserRoundCheck,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminDashboardStats } from "@/types/admin-dashboard";

interface StatsOverviewProps {
  stats?: AdminDashboardStats | null;
  isLoading?: boolean;
  isError?: boolean;
}

type MetricCardConfig = {
  label: string;
  value: number | undefined;
  helper: string;
  icon: typeof Users;
  tone: string;
};

const getLocale = (language: string) => (language === "vi" ? "vi-VN" : "en-US");

const formatNumber = (value: number | undefined, locale: string) =>
  new Intl.NumberFormat(locale).format(value ?? 0);

const getShare = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

export default function StatsOverview({
  stats,
  isLoading,
  isError,
}: StatsOverviewProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const candidates = stats?.totalCandidates ?? 0;
  const employers = stats?.totalEmployers ?? 0;
  const roleTotal = candidates + employers;
  const candidateShare = getShare(candidates, roleTotal);
  const employerShare = getShare(employers, roleTotal);

  const metricCards: MetricCardConfig[] = [
    {
      label: t("adminDashboard.overview.metrics.activeJobs.label"),
      value: stats?.totalActiveJobs,
      helper: t("adminDashboard.overview.metrics.activeJobs.helper"),
      icon: BriefcaseBusiness,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: t("adminDashboard.overview.metrics.applications.label"),
      value: stats?.totalApplications,
      helper: t("adminDashboard.overview.metrics.applications.helper"),
      icon: ClipboardList,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: t("adminDashboard.overview.metrics.candidates.label"),
      value: stats?.totalCandidates,
      helper: t("adminDashboard.overview.metrics.candidates.helper", {
        percent: candidateShare,
      }),
      icon: UserRoundCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: t("adminDashboard.overview.metrics.employers.label"),
      value: stats?.totalEmployers,
      helper: t("adminDashboard.overview.metrics.employers.helper", {
        percent: employerShare,
      }),
      icon: UserRoundCog,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: t("adminDashboard.overview.metrics.companies.label"),
      value: stats?.totalCompanies,
      helper: t("adminDashboard.overview.metrics.companies.helper"),
      icon: Building2,
      tone: "bg-cyan-50 text-cyan-700",
    },
    {
      label: t("adminDashboard.overview.metrics.industryGroups.label"),
      value: stats?.industryStats?.length,
      helper: t("adminDashboard.overview.metrics.industryGroups.helper"),
      icon: Layers3,
      tone: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="relative overflow-hidden rounded-lg border-0 bg-white py-0 shadow-sm md:col-span-2">
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-[#72b183]/10" />
        <CardContent className="relative flex min-h-56 flex-col justify-between gap-8 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#757c81]">
                {t("adminDashboard.overview.totalUsers")}
              </p>
              <MetricValue
                className="mt-3 text-5xl"
                isError={isError}
                isLoading={isLoading}
                locale={locale}
                value={stats?.totalUsers}
              />
            </div>
            <span className="flex size-11 items-center justify-center rounded-lg bg-[#72b183]/10 text-[#5a936a]">
              <Users className="size-5" />
            </span>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <RoleStat
                isError={isError}
                isLoading={isLoading}
                label={t("adminDashboard.overview.roles.candidates")}
                locale={locale}
                value={stats?.totalCandidates}
              />
              <div className="h-8 w-px bg-[#dde3e9]" />
              <RoleStat
                isError={isError}
                isLoading={isLoading}
                label={t("adminDashboard.overview.roles.employers")}
                locale={locale}
                value={stats?.totalEmployers}
              />
              <Badge className="ml-auto rounded-lg bg-[#bce3c8] text-[#1a4d2e] hover:bg-[#bce3c8]">
                {roleTotal > 0
                  ? t("adminDashboard.overview.roleBadge.categorized")
                  : t("adminDashboard.overview.roleBadge.noData")}
              </Badge>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-[#eaeef3]">
              <div
                className="bg-[#72b183]"
                style={{ width: `${candidateShare}%` }}
              />
              <div
                className="bg-[#6f26f6]"
                style={{ width: `${employerShare}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {metricCards.map((card) => (
        <MetricCard
          key={card.label}
          card={card}
          isError={isError}
          isLoading={isLoading}
          locale={locale}
        />
      ))}
    </section>
  );
}

function RoleStat({
  label,
  value,
  isLoading,
  isError,
  locale,
}: {
  label: string;
  value?: number;
  isLoading?: boolean;
  isError?: boolean;
  locale: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#596065]">{label}</p>
      <MetricValue
        className="mt-1 text-lg"
        isError={isError}
        isLoading={isLoading}
        locale={locale}
        value={value}
      />
    </div>
  );
}

function MetricCard({
  card,
  isLoading,
  isError,
  locale,
}: {
  card: MetricCardConfig;
  isLoading?: boolean;
  isError?: boolean;
  locale: string;
}) {
  const Icon = card.icon;

  return (
    <Card className="rounded-lg border-0 bg-white py-0 shadow-sm">
      <CardContent className="flex min-h-40 flex-col justify-between gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#757c81]">
              {card.label}
            </p>
            <MetricValue
              className="mt-3 text-3xl"
              isError={isError}
              isLoading={isLoading}
              locale={locale}
              value={card.value}
            />
          </div>
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              card.tone,
            )}
          >
            <Icon className="size-5" />
          </span>
        </div>
        <p className="text-xs font-medium text-[#596065]">{card.helper}</p>
      </CardContent>
    </Card>
  );
}

function MetricValue({
  value,
  isLoading,
  isError,
  className,
  locale,
}: {
  value?: number;
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
  locale: string;
}) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "h-10 w-28 animate-pulse rounded-md bg-slate-200",
          className,
        )}
      />
    );
  }

  return (
    <p className={cn("font-extrabold tracking-tight text-[#2d3338]", className)}>
      {isError ? "--" : formatNumber(value, locale)}
    </p>
  );
}
