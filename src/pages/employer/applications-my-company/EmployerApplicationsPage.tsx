import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

export default function EmployerApplicationsPage() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState<ApplicationFilters>(
    createInitialApplicationFilters,
  );
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search);
  const locale = getLocale(i18n.language);

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
  const jobOptions = useMemo(
    () =>
      getJobOptions(applications, {
        allJobs: t("employerApplications.filters.allJobs"),
        untitledRole: t("employerApplications.fallbacks.untitledRole"),
      }),
    [applications, t],
  );
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
            {
              label: t("employerApplications.breadcrumb.dashboard"),
              to: "/employer/dashboard",
            },
            { label: t("employerApplications.breadcrumb.applicants") },
          ]}
        />

        <header className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <ClipboardList className="size-4" aria-hidden="true" />
              {t("employerApplications.header.eyebrow")}
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t("employerApplications.header.title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {t("employerApplications.header.description")}
            </p>
          </div>
        </header>

        <ApplicationsStats
          total={stats.total}
          pending={stats.pending}
          interviewing={stats.interviewing}
          hired={stats.hired}
          locale={locale}
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
                    {t("employerApplications.pagination.previous")}
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm font-semibold text-slate-600">
                    {t("employerApplications.pagination.page")}{" "}
                    <span className="text-emerald-600">
                      {new Intl.NumberFormat(locale).format(meta.page)}
                    </span>{" "}
                    / {new Intl.NumberFormat(locale).format(meta.pages)}
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
                    {t("employerApplications.pagination.next")}
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
