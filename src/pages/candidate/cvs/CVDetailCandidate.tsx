import { CheckCircle2, FileText, Star } from "lucide-react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";

import { useGetResumeById } from "@/api/resumes/resume.queries";
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

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB");
};

const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.target = "_blank";
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const getSkillLevel = (index: number): SkillItem["level"] => {
  if (index < 3) return "Advanced";
  if (index < 6) return "Intermediate";
  return "Beginner";
};

const mapResumeToProfile = (resume: Resume): CandidateProfile => ({
  name: resume.candidate?.name ?? "Unknown candidate",
  email: resume.candidate?.email ?? null,
  title: resume.specialization?.name ?? "Candidate CV",
  location: "Not specified",
  experienceYears: 0,
  statusLabel: resume.active ? "Default CV" : "Uploaded CV",
  statusTone: resume.active ? "active" : "open",
  noticePeriod: `Updated: ${formatDate(resume.updatedAt ?? resume.createdAt)}`,
  availability: resume.fileName,
});

const mapResumeToSkills = (resume: Resume): SkillItem[] =>
  (resume.skills ?? []).map((skill, index) => ({
    id: `${resume.id}-${skill}`,
    name: skill,
    level: getSkillLevel(index),
    score: Math.max(52, 92 - index * 6),
  }));

const mapResumeToAttachments = (resume: Resume): AttachmentFile[] => [
  {
    id: String(resume.id),
    name: resume.fileName,
    size: "PDF file",
    type: "file",
    url: resume.fileUrl,
  },
];

const mapResumeToInsights = (resume: Resume): AiInsightMetric[] => [
  {
    id: "skills",
    label: "Skills",
    value: String(resume.skills?.length ?? 0),
    caption: "Parsed skills from this CV",
  },
  {
    id: "specialization",
    label: "Specialization",
    value: resume.specialization?.name ?? "N/A",
    caption: "Primary CV category",
  },
  {
    id: "status",
    label: "Status",
    value: resume.active ? "Default" : "Uploaded",
    caption: "Current CV usage state",
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
  const { id } = useParams();
  const resumeId = Number(id);
  const isValidResumeId = Boolean(id) && Number.isFinite(resumeId);
  const resumeQuery = useGetResumeById(isValidResumeId ? resumeId : 0);

  if (!isValidResumeId) {
    return <PageMessage>CV not found.</PageMessage>;
  }

  if (resumeQuery.isLoading) {
    return <PageMessage>Loading CV details...</PageMessage>;
  }

  if (resumeQuery.isError) {
    return (
      <PageMessage>Unable to load CV details. Please try again.</PageMessage>
    );
  }

  const resume = resumeQuery.data?.data;

  if (!resume) {
    return <PageMessage>CV not found.</PageMessage>;
  }

  const profile = mapResumeToProfile(resume);
  const skills = mapResumeToSkills(resume);
  const attachments = mapResumeToAttachments(resume);
  const aiMetrics = mapResumeToInsights(resume);
  const handleDownload = () => downloadFile(resume.fileUrl, resume.fileName);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="space-y-8">
        <AppBreadcrumb
          items={[
            { label: "Jobs", to: "/jobs" },
            { label: "My CV", to: "/my-cv" },
            { label: resume.fileName },
          ]}
        />

        <div className="rounded-2xl bg-secondary/30 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                CV detail
              </p>
              <h2 className="text-2xl font-semibold text-foreground">
                {resume.fileName}
              </h2>
              <p className="text-sm text-muted-foreground">
                Review parsed CV data, attachments, and AI insights in one
                place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {resume.active ? (
                <Badge className="gap-1.5 bg-primary/10 px-3 py-1 text-primary">
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  Default CV
                </Badge>
              ) : (
                <Badge variant="secondary">Uploaded CV</Badge>
              )}
              <Badge variant="outline" className="gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Updated {formatDate(resume.updatedAt ?? resume.createdAt)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <CandidateProfileCard
              profile={profile}
              onDownload={handleDownload}
            />

            {skills.length ? (
              <SkillsMatrix skills={skills} />
            ) : (
              <Card className="border-border p-6 shadow-[0_10px_32px_rgba(25,28,25,0.06)]">
                <h2 className="text-lg font-semibold text-foreground">
                  Skills matrix
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No skills were parsed from this CV.
                </p>
              </Card>
            )}

            <AttachmentFiles files={attachments} />
          </div>

          <div className="space-y-6">
            <AIProfileInsights
              metrics={aiMetrics}
              summary="AI insights are generated from the current parsed CV metadata."
            />

            <Card className="border-border p-6 shadow-[0_12px_40px_rgba(25,28,25,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Resume metadata
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Candidate-owned CV record
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Candidate
                  </p>
                  <p className="text-foreground">
                    {resume.candidate?.name ?? "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Email
                  </p>
                  <p className="text-foreground">
                    {resume.candidate?.email ?? "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Specialization
                  </p>
                  <p className="text-foreground">
                    {resume.specialization?.name ?? "Not specified"}
                  </p>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                type="button"
                onClick={handleDownload}
              >
                Download CV
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CVDetailCandidate;
