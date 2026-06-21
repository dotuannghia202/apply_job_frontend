// PostJobPage.tsx — Root component (no nav/footer)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "./components/PageHero";
import { RoleParametersForm } from "./components/RoleParameters";
import { JDPreview } from "./components/JdPreview";
import { useGenerateJdAi } from "@/api/jobs/job.queries";
import type { GenerateJdAiResult } from "@/api/jobs/job.api";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "react-i18next";

type Skill = {
  id: string;
  label: string;
};

type RoleParams = {
  jobTitle: string;
  skills: Skill[];

  levels: string[];
};

type GeneratedDraft = {
  name: string;
  description: string;
  requirements: string[];
  benefits: string[];
  levels: string[];
  skillNames: string[];
  skillIds: string[];
};

interface PopupState {
  open: boolean;
  variant: "success" | "error" | "info";
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel: string;
  onCancel: () => void;
  closeOnBackdrop: boolean;
  onDismiss: () => void;
}

export default function AIGenerationJob() {
  const { t, i18n } = useTranslation();
  const company = useAuthStore((state) => state.company);
  const navigate = useNavigate();
  const [roleParams, setRoleParams] = useState<RoleParams | null>(null);
  const [generated, setGenerated] = useState<GenerateJdAiResult | null>(null);
  const { mutate: generateJd, isPending } = useGenerateJdAi();
  const [popup, setPopup] = useState<PopupState>({
    open: false,
    variant: "info",
    title: "",
    message: "",
    onConfirm: () => {},
    confirmLabel: "",
    onCancel: () => {},
    closeOnBackdrop: true,
    onDismiss: () => {},
  });

  const handleClickBtnPostJob = () => {
    if (!company) {
      setPopup({
        open: true,
        variant: "error",
        title: t("employerPostJob.postJobClick.noCompanyTitle"),
        message: t("employerPostJob.postJobClick.noCompanyMessage"),
        onConfirm: () => navigate("/employer/onboarding/company"),
        confirmLabel: t("employerPostJob.postJobClick.redirectToCompanySetup"),
        onCancel: () => setPopup((prev) => ({ ...prev, open: false })),
        closeOnBackdrop: true,
        onDismiss: () => setPopup((prev) => ({ ...prev, open: false })),
      });
      return;
    }
    navigate("/jobs/publish");
  };

  const handleGenerate = (data: RoleParams) => {
    if (!company) {
      setPopup({
        open: true,
        variant: "error",
        title: t("employerPostJob.postJobClick.noCompanyTitle"),
        message: t("employerPostJob.postJobClick.noCompanyMessage"),
        onConfirm: () => navigate("/employer/onboarding/company"),
        confirmLabel: t("employerPostJob.postJobClick.redirectToCompanySetup"),
        onCancel: () => setPopup((prev) => ({ ...prev, open: false })),
        closeOnBackdrop: true,
        onDismiss: () => setPopup((prev) => ({ ...prev, open: false })),
      });
      return;
    }
    setRoleParams(data);

    generateJd(
      {
        title: data.jobTitle.trim(),
        skills: data.skills.map((skill) => skill.label).join(", "),

        levels: data.levels.join(", "),
      },
      {
        onSuccess: (response) => {
          setGenerated(response.data ?? null);
        },
      },
    );
  };

  const handlePublish = () => {
    if (!roleParams || !generated) return;

    const draft: GeneratedDraft = {
      name: roleParams.jobTitle.trim(),
      description: generated.description || "",
      requirements: generated.requirements || [],
      benefits: generated.benefits || [],
      levels: roleParams.levels,
      skillNames: roleParams.skills.map((skill) => skill.label),
      skillIds: roleParams.skills.map((skill) => skill.id),
    };

    navigate("/jobs/publish", { state: { generatedJob: draft } });
  };

  return (
    <main className="min-h-screen bg-main-background px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <PageHero handleClickBtn={handleClickBtnPostJob} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <RoleParametersForm onGenerate={handleGenerate} />
          <JDPreview
            data={{
              title: roleParams?.jobTitle,
              description: generated?.description,
              requirements: generated?.requirements,
              benefits: generated?.benefits,
            }}
            onRegenerate={() => roleParams && handleGenerate(roleParams)}
            onPublish={handlePublish}
            isGenerating={isPending}
          />
        </div>
      </div>
      <NotificationPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        message={popup.message}
        onCancel={popup.onCancel}
        confirmLabel={popup.confirmLabel}
        onConfirm={popup.onConfirm}
        closeOnBackdrop={popup.closeOnBackdrop}
        onDismiss={popup.onDismiss}
      />
    </main>
  );
}
