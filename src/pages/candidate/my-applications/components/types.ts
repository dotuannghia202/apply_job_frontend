export type ApplicationStatus =
  | "Pending"
  | "Reviewing"
  | "Interview"
  | "Accepted"
  | "Rejected";

export type ApplicationItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  appliedOn: string;
  resumeName: string;
  resumeUrl?: string;
  fitScore: number;
  status: ApplicationStatus;
  statusLabel?: string;
  statusTone?: "muted" | "primary" | "accent";
  logoUrl?: string;
  coverLetter?: string | null;
  hasCoverLetter?: boolean | null;
  candidateName?: string | null;
  candidateEmail?: string | null;
};

export type CandidateProfile = {
  name: string;
  email?: string | null;
  title: string;
  location: string;
  experienceYears: number;
  statusLabel: string;
  statusTone: "active" | "open" | "hired";
  noticePeriod: string;
  availability: string;
  avatarUrl?: string | null;
};

export type AttachmentFile = {
  id: string;
  name: string;
  size: string;
  type: "file" | "link";
  url?: string | null;
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  period: string;
  summary: string;
};

export type SkillItem = {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  score: number;
};

export type WorkExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  highlights: string[];
};

export type AiInsightMetric = {
  id: string;
  label: string;
  value: string;
  caption: string;
};

export type ApplicationInfo = {
  position: string;
  company: string;
  appliedOn: string;
  status: string;
  stageHint: string;
};

export type InteractionNote = {
  id: string;
  title: string;
  time: string;
  summary: string;
};
