import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboardStats } from "@/types/admin-dashboard";

interface UserGrowthChartProps {
  stats?: AdminDashboardStats | null;
  isLoading?: boolean;
  isError?: boolean;
}

const chartColors = ["#72b183", "#6f26f6", "#006b60"];

const axisStyle = {
  fontSize: 11,
  fill: "#757c81",
};

const getLocale = (language: string) => (language === "vi" ? "vi-VN" : "en-US");

const formatNumber = (value: number | undefined, locale: string) =>
  new Intl.NumberFormat(locale).format(value ?? 0);

type CustomTooltipProps = TooltipProps<number, string> & {
  locale: string;
};

function CustomTooltip({
  active,
  payload,
  label,
  locale,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#dde3e9] bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-semibold text-[#596065]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#2d3338]">
        {formatNumber(Number(payload[0].value), locale)}
      </p>
    </div>
  );
}

export default function UserGrowthChart({
  stats,
  isLoading,
  isError,
}: UserGrowthChartProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const chartData = [
    {
      name: t("adminDashboard.chart.series.candidates"),
      value: stats?.totalCandidates ?? 0,
    },
    {
      name: t("adminDashboard.chart.series.employers"),
      value: stats?.totalEmployers ?? 0,
    },
    {
      name: t("adminDashboard.chart.series.companies"),
      value: stats?.totalCompanies ?? 0,
    },
  ];

  return (
    <Card className="h-full rounded-lg border-0 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-[#eaeef3] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-extrabold text-[#2d3338]">
              {t("adminDashboard.chart.title")}
            </CardTitle>
            <p className="mt-2 text-sm text-[#596065]">
              {t("adminDashboard.chart.description")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#596065]">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: chartColors[index] }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-80 p-6">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-lg bg-slate-100" />
        ) : isError ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-rose-50 text-sm font-semibold text-rose-700">
            {t("adminDashboard.chart.error")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 12, top: 8 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e3e9ee" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={axisStyle}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={axisStyle}
                tickFormatter={(value) => formatNumber(Number(value), locale)}
              />
              <Tooltip content={<CustomTooltip locale={locale} />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
