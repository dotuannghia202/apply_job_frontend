import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { AiInsightMetric } from "@/pages/candidate/my-applications/components/types";

const AIProfileInsights = ({
  metrics,
  summary,
}: {
  metrics: AiInsightMetric[];
  summary: string;
}) => (
  <Card className="border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          AI profile insights
        </h2>
        <p className="text-sm text-muted-foreground">Model-based evaluation</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>

    <div className="mt-5 grid gap-3">
      {metrics.map((metric) => (
        <div key={metric.id} className="rounded-xl bg-secondary/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {metric.label}
          </p>
          <p className="text-xl font-semibold text-foreground">
            {metric.value}
          </p>
          <p className="text-xs text-muted-foreground">{metric.caption}</p>
        </div>
      ))}
    </div>

    <p className="mt-4 text-sm text-muted-foreground">{summary}</p>
  </Card>
);

export default AIProfileInsights;
