import { CheckCircle2, MapPin, Timer, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PostJobFormData } from "./PostJobForm";

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[#7b848a] font-semibold">{label}</span>
      <span className="text-[#2d3338] font-semibold text-right">{value}</span>
    </div>
  );
}

export function PostJobPreview({ value }: { value: PostJobFormData }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("vi") ? "vi-VN" : "en-US";
  const minSalary = value.minSalary ? Number(value.minSalary) : null;
  const maxSalary = value.maxSalary ? Number(value.maxSalary) : null;
  const formatNumber = (numberValue: number) =>
    new Intl.NumberFormat(locale).format(numberValue);
  const salaryLabel =
    minSalary !== null || maxSalary !== null
      ? `${formatNumber(minSalary ?? 0)} - ${formatNumber(maxSalary ?? 0)}`
      : t("employerPostJob.preview.notSet");

  return (
    <aside className="lg:col-span-5">
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-[#72b183] via-[#6f26f6] to-[#006b60] opacity-10 blur transition duration-700 rounded-lg" />
        <div className="relative bg-white rounded-lg p-8 shadow-xl border border-[#eaeef3]/50 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                {t("employerPostJob.preview.eyebrow")}
              </p>
              <h3 className="text-2xl font-extrabold text-[#2d3338]">
                {value.name || t("employerPostJob.preview.untitledRole")}
              </h3>
            </div>
            <span className="text-xs font-bold text-primary bg-[#e8f4ec] px-3 py-1 rounded-full">
              {value.active
                ? t("employerPostJob.preview.active")
                : t("employerPostJob.preview.inactive")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2 text-sm text-[#596065]">
              <MapPin size={16} className="text-primary" />
              {value.location || t("employerPostJob.preview.locationNotSet")}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#596065]">
              <Wallet size={16} className="text-primary" />
              {salaryLabel}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#596065]">
              <Timer size={16} className="text-primary" />
              {value.startDate && value.endDate
                ? `${value.startDate} - ${value.endDate}`
                : t("employerPostJob.preview.timelineNotSet")}
            </div>
          </div>

          <div className="space-y-3 border-t border-[#eaeef3] pt-4">
            <PreviewRow
              label={t("employerPostJob.preview.rows.quantity")}
              value={value.quantity || "-"}
            />
            <PreviewRow
              label={t("employerPostJob.preview.rows.levels")}
              value={
                value.levels.length
                  ? value.levels
                      .map((level) => t(`employerPostJob.levels.${level}`))
                      .join(", ")
                  : "-"
              }
            />
            <PreviewRow
              label={t("employerPostJob.preview.rows.industry")}
              value={value.industryName || "-"}
            />
            <PreviewRow
              label={t("employerPostJob.preview.rows.specialization")}
              value={value.specializationName || "-"}
            />
            <PreviewRow
              label={t("employerPostJob.preview.rows.skills")}
              value={
                value.skillNames.length ? value.skillNames.join(", ") : "-"
              }
            />
          </div>

          <div className="border-t border-[#eaeef3] pt-4">
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
              {t("employerPostJob.preview.description")}
            </p>
            <p className="text-sm text-[#596065] leading-relaxed">
              {value.description || t("employerPostJob.preview.noDescription")}
            </p>
          </div>

          <div className="space-y-3 border-t border-[#eaeef3] pt-4">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
                {t("employerPostJob.preview.requirements")}
              </p>
              {value.requirements.length ? (
                <ul className="space-y-2">
                  {value.requirements.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-2 text-sm">
                      <CheckCircle2
                        size={14}
                        className="text-primary mt-0.5 shrink-0"
                      />
                      <span className="text-[#596065] leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#7b848a]">
                  {t("employerPostJob.preview.noRequirements")}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
                {t("employerPostJob.preview.benefits")}
              </p>
              {value.benefits.length ? (
                <ul className="space-y-2">
                  {value.benefits.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="text-sm text-[#596065]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#7b848a]">
                  {t("employerPostJob.preview.noBenefits")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
