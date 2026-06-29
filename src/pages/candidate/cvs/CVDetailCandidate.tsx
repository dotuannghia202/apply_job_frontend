import { CheckCircle2, FileText, Star } from "lucide-react";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useGetResumeById, useSetDefaultResume } from "@/api/resumes/resume.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AIProfileInsights from "@/pages/candidate/cvs/components/AIProfileInsights";
import AttachmentFiles from "@/pages/candidate/cvs/components/AttachmentFiles";
import CandidateProfileCard from "@/pages/candidate/cvs/components/CandidateProfileCard";
import SkillsMatrix from "@/pages/candidate/cvs/components/SkillsMatrix";
import type {
  AiInsightMetric,
  AttachmentFile,
  CandidateProfile,
  SkillItem,
} from "@/pages/candidate/my-applications/components/types";
import type { Resume } from "@/types/resume";

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-GB";

const formatDate = (
  value: string | null | undefined,
  locale: string,
  fallback: string,
) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(locale);
};

const getSkillLevel = (index: number): SkillItem["level"] => {
  if (index < 3) return "Advanced";
  if (index < 6) return "Intermediate";
  return "Beginner";
};

const mapResumeToProfile = (
  resume: Resume,
  t: TFunction,
  locale: string,
): CandidateProfile => ({
  name:
    resume.candidate?.name ??
    t("myCVManagement.detail.fallbacks.unknownCandidate"),
  email: resume.candidate?.email ?? null,
  title:
    resume.specialization?.name ??
    t("myCVManagement.detail.fallbacks.candidateCv"),
  location: t("myCVManagement.detail.fallbacks.notSpecified"),
  experienceYears: 0,
  statusLabel: resume.isDefault
    ? t("myCVManagement.detail.badges.defaultCv")
    : t("myCVManagement.detail.badges.uploadedCv"),
  statusTone: resume.isDefault ? "active" : "open",
  noticePeriod: t("myCVManagement.detail.header.updated", {
    date: formatDate(
      resume.updatedAt ?? resume.createdAt,
      locale,
      t("myCVManagement.detail.fallbacks.empty"),
    ),
  }),
  availability: resume.fileName,
});

const mapResumeToSkills = (resume: Resume): SkillItem[] =>
  (resume.skills ?? []).map((skill, index) => ({
    id: `${resume.id}-${skill}`,
    name: skill,
    level: getSkillLevel(index),
    score: Math.max(52, 92 - index * 6),
  }));

const mapResumeToAttachments = (
  resume: Resume,
  t: TFunction,
): AttachmentFile[] => [
    {
      id: String(resume.id),
      name: resume.fileName,
      size: t("myCVManagement.detail.fallbacks.pdfFile"),
      type: "file",
      url: resume.fileUrl,
    },
  ];

const mapResumeToInsights = (
  resume: Resume,
  t: TFunction,
): AiInsightMetric[] => [
    {
      id: "skills",
      label: t("myCVManagement.detail.insights.metrics.skills.label"),
      value: String(resume.skills?.length ?? 0),
      caption: t("myCVManagement.detail.insights.metrics.skills.caption"),
    },
    {
      id: "specialization",
      label: t("myCVManagement.detail.insights.metrics.specialization.label"),
      value:
        resume.specialization?.name ?? t("myCVManagement.detail.fallbacks.na"),
      caption: t("myCVManagement.detail.insights.metrics.specialization.caption"),
    },
    {
      id: "status",
      label: t("myCVManagement.detail.insights.metrics.status.label"),
      value: resume.isDefault
        ? t("myCVManagement.detail.insights.metrics.status.default")
        : t("myCVManagement.detail.insights.metrics.status.uploaded"),
      caption: t("myCVManagement.detail.insights.metrics.status.caption"),
    },
  ];

const PageMessage = ({ children }: { children: ReactNode }) => (
  <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    <Card className="border-border p-6 text-sm text-muted-foreground">
      {children}
    </Card>
  </main>
);

const CVDetailCandidate = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const resumeId = Number(id);
  const isValidResumeId = Boolean(id) && Number.isFinite(resumeId);
  const locale = getLocale(i18n.language);
  const resumeQuery = useGetResumeById(isValidResumeId ? resumeId : 0);
  const setDefaultResumeMutation = useSetDefaultResume();

  if (!isValidResumeId) {
    return (
      <PageMessage>{t("myCVManagement.detail.status.notFound")}</PageMessage>
    );
  }

  if (resumeQuery.isLoading) {
    return (
      <PageMessage>{t("myCVManagement.detail.status.loading")}</PageMessage>
    );
  }

  if (resumeQuery.isError) {
    return (
      <PageMessage>{t("myCVManagement.detail.status.loadFailed")}</PageMessage>
    );
  }

  const resume = resumeQuery.data?.data;

  if (!resume) {
    return (
      <PageMessage>{t("myCVManagement.detail.status.notFound")}</PageMessage>
    );
  }

  const profile = mapResumeToProfile(resume, t, locale);
  const skills = mapResumeToSkills(resume);
  const attachments = mapResumeToAttachments(resume, t);
  const aiMetrics = mapResumeToInsights(resume, t);
  const updatedDate = formatDate(
    resume.updatedAt ?? resume.createdAt,
    locale,
    t("myCVManagement.detail.fallbacks.empty"),
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="space-y-8">
        <AppBreadcrumb
          items={[
            { label: t("myCVManagement.detail.breadcrumb.jobs"), to: "/jobs" },
            { label: t("myCVManagement.detail.breadcrumb.myCv"), to: "/my-cv" },
            { label: resume.fileName },
          ]}
        />

        <div className="rounded-2xl bg-main-background p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              {/* <p className="uppercase text-muted-foreground">CV detail</p> */}
              <h2 className="text-2xl font-semibold text-foreground">
                {resume.fileName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("myCVManagement.detail.header.description")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {resume.isDefault ? (
                <Badge className="gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 text-amber-700 font-semibold shadow-none hover:bg-amber-50">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                  {t("myCVManagement.detail.badges.defaultCv")}
                </Badge>
              ) : (
                <>
                  <Badge variant="secondary">
                    {t("myCVManagement.detail.badges.uploadedCv")}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-muted-foreground hover:text-primary border-border h-7"
                    disabled={setDefaultResumeMutation.isPending}
                    onClick={() => setDefaultResumeMutation.mutate(resumeId)}
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    {setDefaultResumeMutation.isPending
                      ? t("myCVManagement.card.actions.saving")
                      : t("myCVManagement.card.actions.setDefault")}
                  </Button>
                </>
              )}
              <Badge variant="outline" className="gap-1.5 py-1">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t("myCVManagement.detail.header.updated", {
                  date: updatedDate,
                })}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <CandidateProfileCard profile={profile} cvUrl={resume.fileUrl} />

            {skills.length ? (
              <SkillsMatrix skills={skills} />
            ) : (
              <Card className="border-border p-6 shadow-[0_10px_32px_rgba(25,28,25,0.06)]">
                <h2 className="text-lg font-semibold text-foreground">
                  {t("myCVManagement.detail.skills.title")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("myCVManagement.detail.skills.empty")}
                </p>
              </Card>
            )}

            <AttachmentFiles files={attachments} />
          </div>

          <div className="space-y-6">
            <AIProfileInsights
              metrics={aiMetrics}
              summary={t("myCVManagement.detail.insights.summary")}
            />

            <Card className="border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg text-primary">
                  <FileText className="h-full w-full" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-foreground">
                    {t("myCVManagement.detail.metadata.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("myCVManagement.detail.metadata.description")}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("myCVManagement.detail.metadata.candidate")}
                  </p>
                  <p className="text-foreground">
                    {resume.candidate?.name ??
                      t("myCVManagement.detail.fallbacks.unknown")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("myCVManagement.detail.metadata.email")}
                  </p>
                  <p className="text-foreground">
                    {resume.candidate?.email ??
                      t("myCVManagement.detail.fallbacks.notSpecified")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("myCVManagement.detail.metadata.specialization")}
                  </p>
                  <p className="text-foreground">
                    {resume.specialization?.name ??
                      t("myCVManagement.detail.fallbacks.notSpecified")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CVDetailCandidate;
