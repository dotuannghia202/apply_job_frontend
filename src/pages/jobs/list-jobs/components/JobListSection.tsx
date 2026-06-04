import { ChevronLeft, ChevronRight, Grid2x2, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import JobCard from "@/pages/jobs/list-jobs/components/JobCard";
import { useGetJobs } from "@/api/jobs/job.queries";
import type { JobListFilters } from "@/types/job";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

type JobSearchFilters = Pick<
  JobListFilters,
  | "name"
  | "companyName"
  | "location"
  | "minSalary"
  | "maxSalary"
  | "specialization"
>;

interface JobListSectionProps {
  filters?: JobSearchFilters;
}

const PAGE_SIZE = 12;

const JobListSection = ({ filters = {} }: JobListSectionProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const jobTitle = filters.name?.trim() || undefined;
  const companyName = filters.companyName?.trim() || undefined;
  const location = filters.location?.trim() || undefined;
  const specialization = filters.specialization;
  const minSalary = filters.minSalary;
  const maxSalary = filters.maxSalary;

  useEffect(() => {
    setPage(1);
  }, [jobTitle, companyName, location, specialization, minSalary, maxSalary]);

  const queryFilters = useMemo<JobListFilters>(
    () => ({
      page,
      size: PAGE_SIZE,
      name: jobTitle,
      companyName: companyName,
      location,
      specialization,
      minSalary,
      maxSalary,
      active: true,
    }),
    [
      jobTitle,
      companyName,
      location,
      specialization,
      minSalary,
      maxSalary,
      page,
    ],
  );
  const { data, isLoading, isError, isFetching } = useGetJobs(queryFilters);

  const jobs = data?.data?.result ?? [];
  const meta = data?.data?.meta;
  const total = meta?.total ?? jobs.length;
  const hasNextPage = meta ? meta.page < meta.pages : false;

  return (
    <section className="flex-1">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t("jobListSection.title")}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {isLoading
              ? t("jobListSection.loading")
              : t("jobListSection.foundJobs", { count: total })}
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-pressed={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-primary/10 text-primary"
                : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Grid2x2 className="size-4" />
          </button>
          <button
            type="button"
            aria-pressed={viewMode === "list"}
            onClick={() => setViewMode("list")}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === "list"
                ? "bg-primary/10 text-primary"
                : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t("jobListSection.errorLoad")}
        </div>
      ) : null}

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} viewMode={viewMode} />
        ))}
      </div>

      {meta ? (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent className="gap-4">
              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  disabled={isFetching || page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
                >
                  <ChevronLeft className="size-5" />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <div className="text-lg font-semibold text-slate-500">
                  <span className="text-primary">{meta.page}</span> /{" "}
                  {meta.pages} {t("jobListSection.pages")}
                </div>
              </PaginationItem>

              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  disabled={isFetching || !hasNextPage}
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
    </section>
  );
};

export default JobListSection;
