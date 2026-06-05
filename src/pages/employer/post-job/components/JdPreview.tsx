import {
  RefreshCw,
  CheckCircle2,
  Stethoscope,
  PlaneTakeoff,
  BrainCircuit,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

// ── Static preview data ────────────────────────────────────────────
const DEFAULT_REQUIREMENT_KEYS = ["experience", "react", "ai"] as const;

const BENEFITS = [
  { id: "1", icon: "health", textKey: "health" },
  { id: "2", icon: "flight", textKey: "flight" },
  { id: "3", icon: "mind", textKey: "mind" },
];

function BenefitIcon({ icon }: { icon: string }) {
  const cls = "text-[#6f26f6]";
  const props = { size: 16, className: cls };
  if (icon === "flight") return <PlaneTakeoff {...props} />;
  if (icon === "mind") return <BrainCircuit {...props} />;
  return <Stethoscope {...props} />;
}

// ── Sub-components ─────────────────────────────────────────────────
type JDPreviewData = {
  title?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
};

type PreviewHeaderProps = {
  onRegenerate?: () => void;
  onPublish?: () => void;
  isGenerating?: boolean;
  isPublishDisabled?: boolean;
};

function PreviewHeader({
  onRegenerate,
  onPublish,
  isGenerating,
  isPublishDisabled,
}: PreviewHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#eaeef3]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#f1f4f7] rounded-lg flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#72b183"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg text-[#2d3338] leading-none">
            {t("employerPostJob.jdPreview.headerTitle")}
          </h3>
          <span className="text-[10px] font-bold text-[#72b183] uppercase tracking-widest flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 bg-[#72b183] rounded-full animate-pulse" />
            {t("employerPostJob.jdPreview.aiOptimized")}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#596065] hover:shadow-lg transition-shadow hover:bg-[#f1f4f7] rounded-xl font-bold gap-2"
          onClick={onRegenerate}
          disabled={isGenerating}
        >
          <RefreshCw size={14} />
          {isGenerating
            ? t("employerPostJob.jdPreview.generating")
            : t("employerPostJob.jdPreview.regenerate")}
        </Button>
        <Button
          size="sm"
          className="rounded-full font-bold text-white px-5 shadow-md hover:shadow-lg transition-shadow"
          style={{
            background: "linear-gradient(135deg, #72b183 0%, #aed6ba 100%)",
          }}
          onClick={onPublish}
          disabled={isPublishDisabled}
        >
          {t("employerPostJob.jdPreview.publishJob")}
        </Button>
      </div>
    </div>
  );
}

function RoleSection({ title, description }: JDPreviewData) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-[10px] font-bold text-[#72b183] uppercase tracking-[0.2em] mb-3">
        {t("employerPostJob.jdPreview.role")}
      </p>
      <h2 className="text-3xl font-extrabold text-[#2d3338] mb-3">
        {title || t("employerPostJob.jdPreview.roleTitlePlaceholder")}
      </h2>
      <p className="text-[#596065] leading-relaxed text-sm">
        {description ||
          t("employerPostJob.jdPreview.descriptionPlaceholder")}
      </p>
    </div>
  );
}

function RequirementsAndBenefits({
  requirements,
  benefits,
}: {
  requirements: string[];
  benefits: string[];
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Requirements */}
      <div>
        <p className="text-[10px] font-bold text-[#72b183] uppercase tracking-[0.2em] mb-4">
          {t("employerPostJob.jdPreview.requirements")}
        </p>
        <ul className="space-y-3">
          {requirements.map((req, index) => (
            <li
              key={`${req}-${index}`}
              className="flex gap-3 text-sm text-[#596065]"
            >
              <CheckCircle2
                size={16}
                className="text-[#72b183] shrink-0 mt-0.5"
                fill="#72b183"
                stroke="white"
              />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div>
        <p className="text-[10px] font-bold text-[#72b183] uppercase tracking-[0.2em] mb-4">
          {t("employerPostJob.jdPreview.benefits")}
        </p>
        <ul className="space-y-3">
          {benefits.map((b, index) => (
            <li
              key={`${b}-${index}`}
              className="flex gap-3 text-sm text-[#596065]"
            >
              <BenefitIcon
                icon={BENEFITS[index % BENEFITS.length]?.icon || "health"}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MatchBadge() {
  const { t } = useTranslation();

  return (
    <div className="absolute -bottom-4 -right-4 bg-white px-3 py-2 rounded-lg shadow-lg shadow-[#72b183]/10 border border-[#72b183]/10 flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-[#d4e8d9] flex items-center justify-center">
        <span className="text-[8px] font-bold text-[#72b183]">AI</span>
      </div>
      <span className="text-[11px] font-bold text-[#596065]">
        {t("employerPostJob.jdPreview.matchScore", { score: 98 })}
      </span>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────
export function JDPreview({
  data,
  onPublish,
  onRegenerate,
  isGenerating,
}: {
  data?: JDPreviewData;
  onPublish?: () => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}) {
  const { t } = useTranslation();
  const requirements =
    data?.requirements && data.requirements.length
      ? data.requirements
      : DEFAULT_REQUIREMENT_KEYS.map((key) =>
          t(`employerPostJob.jdPreview.defaultRequirements.${key}`),
        );
  const benefits =
    data?.benefits && data.benefits.length
      ? data.benefits
      : BENEFITS.map((item) =>
          t(`employerPostJob.jdPreview.defaultBenefits.${item.textKey}`),
        );
  const isPublishDisabled = !data?.description;

  return (
    <section className="lg:col-span-7">
      <div className="relative group">
        {/* Ambient glow border */}
        <div className="absolute -inset-1 bg-linear-to-r from-[#72b183] via-[#6f26f6] to-[#006b60] opacity-15 group-hover:opacity-30 blur transition duration-1000 group-hover:duration-200 rounded-lg" />

        {/* Card */}
        <div className="relative bg-white rounded-lg p-8 min-h-122 shadow-xl border border-[#eaeef3]/50 space-y-8">
          <PreviewHeader
            onRegenerate={onRegenerate}
            onPublish={onPublish}
            isGenerating={isGenerating}
            isPublishDisabled={isPublishDisabled}
          />
          <RoleSection title={data?.title} description={data?.description} />
          <RequirementsAndBenefits
            requirements={requirements}
            benefits={benefits}
          />
          <MatchBadge />
        </div>
      </div>
    </section>
  );
}
