import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import {
  CircularMatchScore,
  SkillTag,
} from "@/pages/candidate/my-applications/MyApplicationDetail";

interface AiFitCardProps {
  matchScore: number;
  matchedSkills?: string[] | null;
  missingSkills?: string[] | null;
  role: "candidate" | "employer";
}

export function AiFitCard({
  matchScore,
  matchedSkills,
  missingSkills,
  role,
}: AiFitCardProps) {
  const { t } = useTranslation();
  const isCandidate = role === "candidate";

  const badgeText = isCandidate
    ? t("myApplications.detail.ai.badge")
    : t("employerApplications.aiFit.badge", "Điểm phù hợp AI");

  const fitTitle =
    matchScore >= 80
      ? isCandidate
        ? t("myApplications.detail.ai.strongFit")
        : t("employerApplications.aiFit.strongFit", "Ứng viên rất phù hợp với vị trí này")
      : isCandidate
        ? t("myApplications.detail.ai.potentialFit")
        : t("employerApplications.aiFit.potentialFit", "Ứng viên có tiềm năng phù hợp với vị trí này");

  const descriptionText = isCandidate
    ? t("myApplications.detail.ai.description")
    : t(
        "employerApplications.aiFit.description",
        "Hệ thống tự động phân tích và so sánh kỹ năng trong CV của ứng viên với mô tả công việc.",
      );

  const matchedSkillsTitle = isCandidate
    ? t("myApplications.detail.ai.matchedSkills")
    : t("employerApplications.aiFit.matchedSkills", "Kỹ năng phù hợp");

  const missingSkillsTitle = isCandidate
    ? t("myApplications.detail.ai.missingSkills")
    : t("employerApplications.aiFit.missingSkills", "Kỹ năng còn thiếu");

  const noDataText = t("myApplications.detail.ai.noData");
  const noMatchedText = t("myApplications.detail.ai.noMatched");
  const noMissingText = t("myApplications.detail.ai.noMissing");
  const matchLabel = t("myApplications.detail.matchLabel");

  return (
    <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f0fdf4_0%,#ffffff_54%,#fffbeb_100%)] p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm">
              <Sparkles className="size-4" aria-hidden="true" />
              {badgeText}
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
              {fitTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {descriptionText}
            </p>
          </div>

          <CircularMatchScore
            score={matchScore}
            label={matchLabel}
            ariaLabel={`${matchScore}% ${matchLabel}`}
          />
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-500">
            {matchedSkillsTitle}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {matchedSkills === null || matchedSkills === undefined ? (
              <span className="text-sm italic text-slate-500">
                {noDataText}
              </span>
            ) : matchedSkills.length === 0 ? (
              <span className="text-sm italic text-slate-500">
                {noMatchedText}
              </span>
            ) : (
              matchedSkills.map((skill) => (
                <SkillTag key={skill} label={skill} tone="matched" />
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-slate-500">
            {missingSkillsTitle}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {missingSkills === null || missingSkills === undefined ? (
              <span className="text-sm italic text-slate-500">
                {noDataText}
              </span>
            ) : missingSkills.length === 0 ? (
              <span className="text-sm italic text-slate-500">
                {noMissingText}
              </span>
            ) : (
              missingSkills.map((skill) => (
                <SkillTag key={skill} label={skill} tone="missing" />
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
