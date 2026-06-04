import { BriefcaseBusiness, Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminDashboardStats } from "@/types/admin-dashboard";

interface TopIndustriesProps {
  stats?: AdminDashboardStats | null;
  isLoading?: boolean;
  isError?: boolean;
}

const barStyles = [
  "from-[#72b183] to-[#bce3c8]",
  "from-[#6f26f6] to-[#c3acff]",
  "from-[#006b60] to-[#8df5e4]",
  "from-amber-500 to-amber-200",
];

const getLocale = (language: string) => (language === "vi" ? "vi-VN" : "en-US");

const formatNumber = (value: number | undefined, locale: string) =>
  new Intl.NumberFormat(locale).format(value ?? 0);

export default function TopIndustries({
  stats,
  isLoading,
  isError,
}: TopIndustriesProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const industries = stats?.industryStats ?? [];
  const totalIndustryJobs = industries.reduce(
    (sum, industry) => sum + industry.jobCount,
    0,
  );

  return (
    <Card className="h-full rounded-lg border-0 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-[#eaeef3] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-extrabold text-[#2d3338]">
              {t("adminDashboard.topIndustries.title")}
            </CardTitle>
            <p className="mt-2 text-sm text-[#596065]">
              {t("adminDashboard.topIndustries.description")}
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-lg bg-[#72b183]/10 text-[#5a936a]">
            <Layers3 className="size-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <IndustrySkeleton />
        ) : isError ? (
          <div className="rounded-lg bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {t("adminDashboard.topIndustries.error")}
          </div>
        ) : industries.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-[#596065]">
            {t("adminDashboard.topIndustries.empty")}
          </div>
        ) : (
          <div className="space-y-6">
            {industries.map((industry, index) => {
              const percent =
                totalIndustryJobs > 0
                  ? Math.round((industry.jobCount / totalIndustryJobs) * 100)
                  : 0;

              return (
                <div key={industry.industryName} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="min-w-0 truncate font-semibold text-[#2d3338]">
                      {industry.industryName}
                    </span>
                    <span className="shrink-0 text-[#757c81]">
                      {t("adminDashboard.topIndustries.jobsCount", {
                        value: formatNumber(industry.jobCount, locale),
                      })}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#eaeef3]">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        barStyles[index % barStyles.length],
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#596065]">
                    <span>
                      {t("adminDashboard.topIndustries.percentLabel", {
                        percent,
                      })}
                    </span>
                    {index === 0 && (
                      <Badge className="rounded-lg bg-[#bce3c8] text-[#1a4d2e] hover:bg-[#bce3c8]">
                        <BriefcaseBusiness className="size-3" />
                        {t("adminDashboard.topIndustries.topBadge")}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function IndustrySkeleton() {
  return (
    <div className="space-y-6">
      {[0, 1, 2].map((item) => (
        <div key={item} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
