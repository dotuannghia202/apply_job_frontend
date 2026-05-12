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
  fitScore: number;
  status: ApplicationStatus;
  statusLabel?: string;
  statusTone?: "muted" | "primary" | "accent";
  logoUrl?: string;
};
