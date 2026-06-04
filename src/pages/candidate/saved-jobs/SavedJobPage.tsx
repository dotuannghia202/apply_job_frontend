import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AppBreadcrumb from "@/components/AppBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useGetSavedJobs, useToggleSaveJob } from "@/api/users/user.queries";
import SavedJobCard from "@/pages/candidate/saved-jobs/components/SavedJobCard";
import SavedJobEmptyState from "@/pages/candidate/saved-jobs/components/SavedJobEmptyState";
import SavedJobHeader from "@/pages/candidate/saved-jobs/components/SavedJobHeader";
import type { SavedJob } from "@/pages/candidate/saved-jobs/components/types";
import { formatVND, getCityFromAddress } from "@/pages/jobs/helper";
import type { Job } from "@/types/job";

const PAGE_SIZE = 10;

const getDaysLeft = (value?: string | null) => {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const diffMs = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const isJobClosed = (job: Job) => {
  if (!job.active) return true;

  const endDate = job.endDate ? new Date(job.endDate) : null;
  if (!endDate || Number.isNaN(endDate.getTime())) return false;

  return endDate.getTime() < Date.now();
};

const formatSavedSalaryRange = (
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
  t: TFunction,
) => {
  const min = minSalary ?? 0;
  const max = maxSalary ?? 0;
  const hasMin = min > 0;
  const hasMax = max > 0;

  if (!hasMin && !hasMax) {
    return t("savedJobs.salary.agree");
  }

  if (hasMin && !hasMax) {
    return t("savedJobs.salary.from", { salary: formatVND(min) });
  }

  if (!hasMin && hasMax) {
    return t("savedJobs.salary.upTo", { salary: formatVND(max) });
  }

  return `${formatVND(min)} - ${formatVND(max)}`;
};

const mapJobToSavedJob = (job: Job, t: TFunction): SavedJob => {
  const companyName = job.company?.name ?? t("savedJobs.fallbacks.unknownCompany");
  const city =
    getCityFromAddress(job.location) ||
    job.location ||
    t("savedJobs.fallbacks.unknownLocation");

  return {
    id: String(job.id),
    company: companyName,
    title: job.name,
    salary: formatSavedSalaryRange(job.minSalary, job.maxSalary, t),
    location: city,
    daysLeft: getDaysLeft(job.endDate),
    isClosed: isJobClosed(job),
    isApplied: job.isApplied,
    logoUrl: job.company?.logo || undefined,
    logoAlt: t("savedJobs.card.logoAlt", { company: companyName }),
    logoFallback: "building",
  };
};

const SavedJobPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const savedJobsQuery = useGetSavedJobs({ page, size: PAGE_SIZE });
  const toggleSaveMutation = useToggleSaveJob();

  const apiJobs = savedJobsQuery.data?.data?.result ?? [];
  const meta = savedJobsQuery.data?.data?.meta;
  const savedJobs = useMemo(
    () => apiJobs.map((job) => mapJobToSavedJob(job, t)),
    [apiJobs, t],
  );
  const total = meta?.total ?? savedJobs.length;
  const hasSavedJobs = savedJobs.length > 0;
  const hasNextPage = meta ? meta.page < meta.pages : false;
  const unsavingJobId = toggleSaveMutation.isPending
    ? String(toggleSaveMutation.variables ?? "")
    : undefined;

  const handleUnsave = (jobId: string) => {
    const numericJobId = Number(jobId);
    if (!Number.isFinite(numericJobId) || toggleSaveMutation.isPending) return;

    toggleSaveMutation.mutate(numericJobId);
  };

  // console.log("Saved jobs data:", savedJobs);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12">
      <AppBreadcrumb
        items={[
          { label: t("savedJobs.breadcrumb.jobs"), to: "/jobs" },
          { label: t("savedJobs.breadcrumb.savedJobs") },
        ]}
      />

      <SavedJobHeader savedCount={total} />

      {savedJobsQuery.isError ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          {t("savedJobs.status.loadFailed")}
        </div>
      ) : null}

      {savedJobsQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          {t("savedJobs.status.loading")}
        </div>
      ) : null}

      {!savedJobsQuery.isLoading && !savedJobsQuery.isError && !hasSavedJobs ? (
        <SavedJobEmptyState />
      ) : null}

      {hasSavedJobs ? (
        <section className="flex flex-col gap-6">
          {savedJobs.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              isUnsaving={unsavingJobId === job.id}
              onUnsave={handleUnsave}
            />
          ))}
        </section>
      ) : null}

      {meta && meta.pages > 1 ? (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="gap-4">
              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  disabled={savedJobsQuery.isFetching || page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
                  aria-label={t("savedJobs.pagination.previous")}
                >
                  <ChevronLeft className="size-5" />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <div className="text-lg font-semibold text-slate-500">
                  <span className="text-primary">{meta.page}</span> /{" "}
                  {meta.pages} {t("savedJobs.pagination.pages")}
                </div>
              </PaginationItem>

              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  disabled={savedJobsQuery.isFetching || !hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
                  aria-label={t("savedJobs.pagination.next")}
                >
                  <ChevronRight className="size-5" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </main>
  );
};

export default SavedJobPage;
