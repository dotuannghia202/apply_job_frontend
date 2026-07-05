import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { fieldClass, LEVEL_OPTIONS } from "@/pages/employer/jobs-my-company/helper";
import { Label } from "@/components/ui/label";

type LevelDropdownProps = {
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
};

export function LevelDropdown({ value, onChange, className }: LevelDropdownProps) {
  const { t } = useTranslation();

  const selectedValue = value[0] || "";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    if (val === "") {
      onChange([]);
    } else {
      onChange([val]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold uppercase text-slate-500">
        {t("employerJobs.filters.levels")}
      </Label>
      <select
        value={selectedValue}
        onChange={handleChange}
        className={cn(
          fieldClass,
          "w-full cursor-pointer px-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus-visible:ring-primary focus-visible:border-primary focus:outline-none",
          className,
        )}
      >
        <option value="">{t("employerJobs.filters.allLevels", "Tất cả cấp bậc")}</option>
        {LEVEL_OPTIONS.map((level) => (
          <option key={level} value={level}>
            {t(`employerJobs.levels.${level}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
