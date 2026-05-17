import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const getScoreStyles = (score: number) => {
  if (score > 80) {
    return {
      text: "text-emerald-700",
      bg: "bg-emerald-500",
      track: "bg-emerald-100",
      chip: "bg-emerald-50 border-emerald-200",
    };
  }

  if (score >= 50) {
    return {
      text: "text-amber-700",
      bg: "bg-amber-400",
      track: "bg-amber-100",
      chip: "bg-amber-50 border-amber-200",
    };
  }

  return {
    text: "text-slate-600",
    bg: "bg-slate-400",
    track: "bg-slate-100",
    chip: "bg-slate-50 border-slate-200",
  };
};

export function AiFitScore({ score }: { score: number }) {
  const styles = getScoreStyles(score);

  return (
    <div className={cn("rounded-xl border p-3", styles.chip)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className={cn("size-4", styles.text)} aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            AI Fit
          </span>
        </div>
        <span className={cn("text-lg font-black", styles.text)}>{score}%</span>
      </div>
      <div className={cn("mt-3 h-2 overflow-hidden rounded-full", styles.track)}>
        <div
          className={cn("h-full rounded-full transition-all", styles.bg)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
