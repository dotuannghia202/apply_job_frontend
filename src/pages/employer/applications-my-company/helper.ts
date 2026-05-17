import type { Application, ApplicationStatus } from "@/types/application";

export const DEFAULT_PAGE_SIZE = 10;

export type ApplicationStatusFilter = "ALL" | ApplicationStatus;
export type ApplicationSort = "MATCH_DESC" | "MATCH_ASC" | "DATE_DESC" | "DATE_ASC";

export type ApplicationFilters = {
  search: string;
  jobId: string;
  status: ApplicationStatusFilter;
  sort: ApplicationSort;
};

export const createInitialApplicationFilters = (): ApplicationFilters => ({
  search: "",
  jobId: "ALL",
  status: "ALL",
  sort: "MATCH_DESC",
});

export const statusLabels: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const statusOptions: Array<{
  label: string;
  value: ApplicationStatusFilter;
}> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Reviewing", value: "REVIEWING" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
];

export const sortOptions: Array<{ label: string; value: ApplicationSort }> = [
  { label: "AI Match Score: High to Low", value: "MATCH_DESC" },
  { label: "AI Match Score: Low to High", value: "MATCH_ASC" },
  { label: "Application Date: Newest", value: "DATE_DESC" },
  { label: "Application Date: Oldest", value: "DATE_ASC" },
];

export const formatApplicationDate = (value?: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const getCandidateInitials = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
};

export const getMatchScore = (application: Application) => {
  const score =
    typeof application.matchScore === "number" ? application.matchScore : 0;

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const getAppliedTimestamp = (application: Application) => {
  const date = application.appliedAt ? new Date(application.appliedAt) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
};

export const getJobOptions = (applications: Application[]) => {
  const map = new Map<number, string>();

  applications.forEach((application) => {
    if (!application.job?.id) return;
    map.set(application.job.id, application.job.name || "Untitled role");
  });

  return [
    { label: "All Jobs", value: "ALL" },
    ...Array.from(map.entries()).map(([id, label]) => ({
      label,
      value: String(id),
    })),
  ];
};

export const applyLocalApplicationFilters = (
  applications: Application[],
  filters: ApplicationFilters,
) => {
  const byJob =
    filters.jobId === "ALL"
      ? applications
      : applications.filter((application) => String(application.job?.id) === filters.jobId);

  return [...byJob].sort((a, b) => {
    if (filters.sort === "MATCH_ASC") {
      return getMatchScore(a) - getMatchScore(b);
    }

    if (filters.sort === "DATE_DESC") {
      return getAppliedTimestamp(b) - getAppliedTimestamp(a);
    }

    if (filters.sort === "DATE_ASC") {
      return getAppliedTimestamp(a) - getAppliedTimestamp(b);
    }

    return getMatchScore(b) - getMatchScore(a);
  });
};

export const getApplicationStats = (applications: Application[], total: number) => ({
  total,
  pending: applications.filter((item) => item.status === "PENDING").length,
  interviewing: applications.filter((item) => item.status === "INTERVIEW").length,
  hired: applications.filter((item) => item.status === "ACCEPTED").length,
});
