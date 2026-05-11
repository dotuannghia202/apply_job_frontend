import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

const FitScoreCard = ({ score }: { score: number }) => (
  <Card className="w-full bg-secondary/40 p-3 shadow-none">
    <div className="flex items-center justify-center gap-1 text-sm font-medium text-primary">
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      AI Fit Score
    </div>
    <div className="mt-2 text-center text-[1.375rem] font-bold text-foreground">
      {score}%
    </div>
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${score}%` }}
      />
    </div>
  </Card>
);

export default FitScoreCard;
