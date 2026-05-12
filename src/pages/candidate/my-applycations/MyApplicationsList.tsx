import { useMemo, useState } from "react";

import { useGetApplications } from "@/api/applications/application.queries";
import ApplicationCard from "@/pages/candidate/my-applycations/components/ApplicationCard";
import ApplicationsTabs, {
  type ApplicationTab,
} from "@/pages/candidate/my-applycations/components/ApplicationsTabs";
import type { ApplicationItem } from "@/pages/candidate/my-applycations/components/types";
import type {
  Application,
  ApplicationListFilters,
  ApplicationStatus,
} from "@/types/application";

const PAGE_SIZE = 10;

const statusParamMap: Record<
  Exclude<ApplicationTab, "All">,
  ApplicationStatus
> = {
  Pending: "PENDING",
  Reviewing: "REVIEWING",
  Interview: "INTERVIEW",
  Accepted: "ACCEPTED",
  Rejected: "REJECTED",
};

const statusLabelMap: Record<ApplicationStatus, ApplicationItem["status"]> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

const formatAppliedDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getStatusLabel = (value?: string | null): ApplicationItem["status"] => {
  if (!value) return "Pending";
  const normalized = value.trim().toUpperCase();
  return statusLabelMap[normalized as ApplicationStatus] ?? "Pending";
};

const mapApplicationToItem = (application: Application): ApplicationItem => {
  const status = getStatusLabel(application.status);
  const score =
    typeof application.matchScore === "number"
      ? Math.round(application.matchScore)
      : 0;

  return {
    id: String(application.id),
    title: application.job?.name ?? "Untitled role",
    company: application.job?.companyName ?? "Unknown company",
    location: application.job?.location ?? "Unknown location",
    appliedOn: formatAppliedDate(application.appliedAt),
    resumeName: application.resume?.fileName ?? "Resume",
    resumeUrl: application.resume?.fileUrl ?? undefined,
    fitScore: Math.max(0, Math.min(100, score)),
    status,
    logoUrl: application.job?.companyLogo ?? undefined,
    coverLetter: application.coverLetter ?? null,
    hasCoverLetter: application.hasCoverLetter ?? null,
    candidateName: application.candidate?.name ?? null,
    candidateEmail: application.candidate?.email ?? null,
  };
};

const MyApplicationsList = () => {
  const [activeStatus, setActiveStatus] = useState<ApplicationTab>("All");

  const queryFilters = useMemo<ApplicationListFilters>(() => {
    const status =
      activeStatus === "All" ? undefined : statusParamMap[activeStatus];

    return {
      page: 1,
      size: PAGE_SIZE,
      status,
    };
  }, [activeStatus]);

  const { data, isLoading, isError } = useGetApplications(queryFilters);
  const items = useMemo(
    () => (data?.data?.result ?? []).map(mapApplicationToItem),
    [data?.data?.result],
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12">
      <section>
        <h1 className="mb-2 text-[2.75rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          My Applications
        </h1>
        <p className="text-base text-muted-foreground">
          Track and manage your job applications
        </p>
      </section>

      <ApplicationsTabs activeTab={activeStatus} onChange={setActiveStatus} />

      <section className="flex flex-col gap-6">
        {isError ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Failed to load applications. Please try again.
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading applications...
          </div>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No applications found for this status.
          </div>
        ) : null}

        {items.map((item) => (
          <ApplicationCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
};

export default MyApplicationsList;
