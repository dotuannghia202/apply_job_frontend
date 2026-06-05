// SkillTag.tsx
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Skill } from "../../types";

interface Props {
  skill: Skill;
  onRemove: (id: string) => void;
}

export function SkillTag({ skill, onRemove }: Props) {
  const { t } = useTranslation();

  return (
    <span className="bg-[#8df5e4] text-[#005c53] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 select-none">
      {skill.label}
      <button
        onClick={() => onRemove(skill.id)}
        className="ml-0.5 hover:opacity-70 transition-opacity"
        aria-label={t("employerPostJob.common.removeItem", {
          item: skill.label,
        })}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}
