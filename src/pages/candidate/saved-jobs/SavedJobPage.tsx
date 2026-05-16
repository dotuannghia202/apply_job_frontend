import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  useGetSavedJobs,
  useToggleSaveJob,
} from "@/api/users/user.queries";
import SavedJobCard from "@/pages/candidate/saved-jobs/components/SavedJobCard";
import SavedJobEmptyState from "@/pages/candidate/saved-jobs/components/SavedJobEmptyState";
import SavedJobHeader from "@/pages/candidate/saved-jobs/components/SavedJobHeader";
import type { SavedJob } from "@/pages/candidate/saved-jobs/components/types";
import { formatSalaryRange, getCityFromAddress } from "@/pages/jobs/helper";
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

const mapJobToSavedJob = (job: Job): SavedJob => {
  const companyName = job.company?.name ?? "Unknown company";
  const city = getCityFromAddress(job.location) || job.location || "Unknown";

  return {
    id: String(job.id),
    company: companyName,
    title: job.name,
    salary: formatSalaryRange(job.minSalary, job.maxSalary),
    location: city,
    daysLeft: getDaysLeft(job.endDate),
    isClosed: isJobClosed(job),
    logoUrl: job.company?.logo || undefined,
    logoAlt: `${companyName} logo`,
    logoFallback: "building",
  };
};

const SavedJobPage = () => {
  const [page, setPage] = useState(1);
  const savedJobsQuery = useGetSavedJobs({ page, size: PAGE_SIZE });
  const toggleSaveMutation = useToggleSaveJob();

  const apiJobs = savedJobsQuery.data?.data?.result ?? [];
  const meta = savedJobsQuery.data?.data?.meta;
  const savedJobs = useMemo(() => apiJobs.map(mapJobToSavedJob), [apiJobs]);
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

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <SavedJobHeader savedCount={total} />

      {savedJobsQuery.isError ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Failed to load saved jobs. Please try again.
        </div>
      ) : null}

      {savedJobsQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Loading saved jobs...
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
                >
                  <ChevronLeft className="size-5" />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <div className="text-lg font-semibold text-slate-500">
                  <span className="text-primary">{meta.page}</span> /{" "}
                  {meta.pages} pages
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
