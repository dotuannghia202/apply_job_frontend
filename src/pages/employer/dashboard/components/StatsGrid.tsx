// StatsGrid.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Sparkles, Users } from "lucide-react";
import type { StatCard } from "../../types";
import { cn } from "@/lib/utils";
import type { HrDashboardStats } from "@/types/user";

interface StatsGridProps {
  stats?: HrDashboardStats | null;
  isLoading?: boolean;
  isError?: boolean;
}

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-US").format(value ?? 0);

const formatPercent = (value?: number) =>
  `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value ?? 0)}%`;

function createStats(stats?: HrDashboardStats | null): StatCard[] {
  return [
    {
      id: "jobs",
      label: "Total Active Jobs",
      value: formatNumber(stats?.totalActiveJobs),
      badge: "Live data",
      icon: "briefcase",
      variant: "default",
    },
    {
      id: "applicants",
      label: "Total Applicants",
      value: formatNumber(stats?.totalApplicants),
      badge: "All jobs",
      icon: "users",
      variant: "secondary",
    },
    {
      id: "match",
      label: "Avg. AI Match Rate",
      value: formatPercent(stats?.avgAiMatchRate),
      badge: "AI optimized",
      icon: "sparkles",
      variant: "ai",
    },
  ];
}

export function StatsGrid({ stats, isLoading, isError }: StatsGridProps) {
  const statItems = createStats(stats);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {statItems.map((stat) => (
        <StatCardItem
          key={stat.id}
          stat={stat}
          isLoading={isLoading}
          isError={isError}
        />
      ))}
    </section>
  );
}

function StatCardItem({
  stat,
  isLoading,
  isError,
}: {
  stat: StatCard;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const isAI = stat.variant === "ai";
  const isSecondary = stat.variant === "secondary";

  return (
    <Card
      className={cn(
        "h-40 border-transparent transition-all",
        isAI
          ? "bg-linear-to-br from-emerald-600 to-green-700 text-white shadow-emerald-200"
          : "hover:border-primary/30",
      )}
    >
      <CardContent className="flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div
            className={cn(
              "p-2 rounded-lg",
              isAI
                ? "bg-white/20 text-white"
                : isSecondary
                  ? "bg-primary-hover/10 text-primary-hover"
                  : "bg-primary/10 text-primary",
            )}
          >
            <IconByName name={stat.icon} />
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-bold uppercase",
              isAI
                ? "bg-white/20 text-white hover:bg-white/30"
                : isSecondary
                  ? "text-primary-hover"
                  : "text-primary",
            )}
          >
            {isError ? "Unavailable" : stat.badge}
          </Badge>
        </div>
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              isAI ? "text-white/80" : "text-[#596065]",
            )}
          >
            {stat.label}
          </p>
          {isLoading ? (
            <div
              className={cn(
                "mt-3 h-9 w-28 animate-pulse rounded-md",
                isAI ? "bg-white/25" : "bg-slate-200",
              )}
            />
          ) : (
            <h3 className="text-3xl font-extrabold mt-1">
              {isError ? "--" : stat.value}
            </h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IconByName({ name }: { name: string }) {
  if (name === "briefcase") return <Briefcase size={20} />;
  if (name === "users") return <Users size={20} />;

  return <Sparkles size={20} />;
}
