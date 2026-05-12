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
