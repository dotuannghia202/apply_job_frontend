import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";

import { useGetHrApplications } from "@/api/applications/application.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ApplicationsFilterBar } from "@/pages/employer/applications-my-company/components/ApplicationsFilterBar";
import { ApplicationsList } from "@/pages/employer/applications-my-company/components/ApplicationsList";
import { ApplicationsStats } from "@/pages/employer/applications-my-company/components/ApplicationsStats";
import {
  applyLocalApplicationFilters,
  createInitialApplicationFilters,
  DEFAULT_PAGE_SIZE,
  getApplicationStats,
  getJobOptions,
  type ApplicationFilters,
} from "@/pages/employer/applications-my-company/helper";
import { useDebounce } from "@/hooks/useDebounce";
import type { ApplicationListFilters } from "@/types/application";

export default function EmployerApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilters>(
    createInitialApplicationFilters,
  );
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search);

  const queryFilters = useMemo<ApplicationListFilters>(
    () => ({
      page,
      size: DEFAULT_PAGE_SIZE,
      filter: debouncedSearch || undefined,
      status: filters.status === "ALL" ? undefined : filters.status,
    }),
    [debouncedSearch, filters.status, page],
  );

  const applicationsQuery = useGetHrApplications(queryFilters);
  const applications = applicationsQuery.data?.data?.result ?? [];
  const meta = applicationsQuery.data?.data?.meta;
  const total = meta?.total ?? applications.length;
  const jobOptions = useMemo(() => getJobOptions(applications), [applications]);
  const visibleApplications = useMemo(
    () => applyLocalApplicationFilters(applications, filters),
    [applications, filters],
  );
  const stats = useMemo(
    () => getApplicationStats(applications, total),
    [applications, total],
  );
  const hasNextPage = meta ? meta.page < meta.pages : false;

  const updateFilters = (patch: Partial<ApplicationFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppBreadcrumb
          items={[
            { label: "Dashboard", to: "/employer/dashboard" },
            { label: "Applicants" },
          ]}
        />

        <header className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <ClipboardList className="size-4" aria-hidden="true" />
              Applicant Tracking System
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Manage Applications
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review and track candidates across your job postings.
            </p>
          </div>
        </header>

        <ApplicationsStats
          total={stats.total}
          pending={stats.pending}
          interviewing={stats.interviewing}
          hired={stats.hired}
        />

        <ApplicationsFilterBar
          filters={filters}
          jobOptions={jobOptions}
          onChange={updateFilters}
        />

        <ApplicationsList
          applications={visibleApplications}
          isLoading={applicationsQuery.isLoading}
          isError={applicationsQuery.isError}
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
                    disabled={applicationsQuery.isFetching || page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm font-semibold text-slate-600">
                    Page <span className="text-emerald-600">{meta.page}</span>{" "}
                    / {meta.pages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={applicationsQuery.isFetching || !hasNextPage}
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
