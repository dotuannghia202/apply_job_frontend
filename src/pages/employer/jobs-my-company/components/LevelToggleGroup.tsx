import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { LEVEL_OPTIONS } from "@/pages/employer/jobs-my-company/helper";

type LevelToggleGroupProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export function LevelToggleGroup({ value, onChange }: LevelToggleGroupProps) {
  const { t } = useTranslation();

  const toggle = (level: string) => {
    if (value.includes(level)) {
      onChange(value.filter((item) => item !== level));
      return;
    }

    onChange([...value, level]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {LEVEL_OPTIONS.map((level) => {
        const checked = value.includes(level);

        return (
          <button
            key={level}
            type="button"
            onClick={() => toggle(level)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              checked
                ? "border-primary bg-primary/10 text-primary"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary/40",
            )}
          >
            {t(`employerJobs.levels.${level}`)}
          </button>
        );
      })}
    </div>
  );
}
