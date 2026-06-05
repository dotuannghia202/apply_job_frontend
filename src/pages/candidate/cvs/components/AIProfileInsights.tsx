import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import type { AiInsightMetric } from "@/pages/candidate/my-applications/components/types";

const AIProfileInsights = ({
  metrics,
  summary,
}: {
  metrics: AiInsightMetric[];
  summary: string;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
      <div className="flex items-center justify-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full text-primary">
          <Sparkles className="h-8 w-8" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("myCVManagement.detail.insights.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("myCVManagement.detail.insights.subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-xl bg-secondary/40 p-4">
            <p className="text-xs uppercase text-muted-foreground">
              {metric.label}:
            </p>
            <p className="font-semibold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.caption}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{summary}</p>
    </Card>
  );
};

export default AIProfileInsights;
