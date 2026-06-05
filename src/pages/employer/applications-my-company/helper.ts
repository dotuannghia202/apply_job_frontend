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

export const formatApplicationDate = (
  value: string | null | undefined,
  locale: string,
  fallback: string,
) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const getCandidateInitials = (
  name: string | null | undefined,
  email: string | null | undefined,
  fallback: string,
) => {
  const source = name?.trim() || email?.trim() || fallback;
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

export const getJobOptions = (
  applications: Application[],
  labels: { allJobs: string; untitledRole: string },
) => {
  const map = new Map<number, string>();

  applications.forEach((application) => {
    if (!application.job?.id) return;
    map.set(application.job.id, application.job.name || labels.untitledRole);
  });

  return [
    { label: labels.allJobs, value: "ALL" },
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
