import { BriefcaseBusiness, Plus } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { useGetHrJobs, useUpdateJob } from "@/api/jobs/job.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { EmployerJobStats } from "@/pages/employer/jobs-my-company/components/EmployerJobStats";
import { EmployerJobsFilterPanel } from "@/pages/employer/jobs-my-company/components/EmployerJobsFilterPanel";
import { EmployerJobsTable } from "@/pages/employer/jobs-my-company/components/EmployerJobsTable";
import { UpdateJobPanel } from "@/pages/employer/jobs-my-company/components/UpdateJobPanel";
import {
  createInitialFilters,
  DEFAULT_PAGE_SIZE,
  getUpdatePayload,
  mapJobToUpdateForm,
  toQueryFilters,
  type EmployerJobFilters,
  type UpdateJobFormState,
} from "@/pages/employer/jobs-my-company/helper";
import type { Job } from "@/types/job";

export default function EmployerJobsPage() {
  const [filters, setFilters] = useState<EmployerJobFilters>(
    createInitialFilters,
  );
  const [appliedFilters, setAppliedFilters] = useState<EmployerJobFilters>(
    createInitialFilters,
  );
  const [page, setPage] = useState(1);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateJobFormState | null>(null);
  const queryFilters = useMemo(
    () => toQueryFilters(appliedFilters, page, DEFAULT_PAGE_SIZE),
    [appliedFilters, page],
  );

  const hrJobsQuery = useGetHrJobs(queryFilters);
  const updateJobMutation = useUpdateJob();

  const jobs = hrJobsQuery.data?.data?.result ?? [];
  const meta = hrJobsQuery.data?.data?.meta;
  const total = meta?.total ?? jobs.length;
  const activeCount = jobs.filter((job) => job.active).length;
  const inactiveCount = jobs.length - activeCount;
  const hasNextPage = meta ? meta.page < meta.pages : false;

  const updateFilters = (patch: Partial<EmployerJobFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    const nextFilters = createInitialFilters();
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  const openUpdatePanel = (job: Job) => {
    setEditingJob(job);
    setUpdateForm(mapJobToUpdateForm(job));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeUpdatePanel = () => {
    setEditingJob(null);
    setUpdateForm(null);
  };

  const handleUpdateJob = () => {
    if (!editingJob || !updateForm || updateJobMutation.isPending) return;

    updateJobMutation.mutate(
      {
        id: editingJob.id,
        data: getUpdatePayload(updateForm),
      },
      {
        onSuccess: closeUpdatePanel,
      },
    );
  };

  return (
    <main className="min-h-screen bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppBreadcrumb
          items={[
            { label: "Dashboard", to: "/employer/dashboard" },
            { label: "My Jobs" },
          ]}
        />

        <header className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              Employer workspace
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              My Jobs
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Manage job posts from your current company, filter openings, and
              update active listings.
            </p>
          </div>

          <Button asChild>
            <Link to="/jobs/jd-generator">
              <Plus className="size-4" aria-hidden="true" />
              Post new job
            </Link>
          </Button>
        </header>

        <EmployerJobStats
          total={total}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />

        {editingJob && updateForm ? (
          <UpdateJobPanel
            job={editingJob}
            form={updateForm}
            onChange={setUpdateForm}
            onCancel={closeUpdatePanel}
            onSubmit={handleUpdateJob}
            isSubmitting={updateJobMutation.isPending}
          />
        ) : null}

        <EmployerJobsFilterPanel
          filters={filters}
          isFetching={hrJobsQuery.isFetching}
          onFilterChange={updateFilters}
          onSubmit={handleSearch}
          onReset={handleReset}
        />

        <EmployerJobsTable
          jobs={jobs}
          isLoading={hrJobsQuery.isLoading}
          isError={hrJobsQuery.isError}
          onUpdate={openUpdatePanel}
        />

        {meta && meta.pages > 1 ? (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent className="gap-4">
                <PaginationItem>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={hrJobsQuery.isFetching || page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm font-semibold text-slate-600">
                    Page <span className="text-primary">{meta.page}</span> /{" "}
                    {meta.pages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={hrJobsQuery.isFetching || !hasNextPage}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </div>
    </main>
  );
}
