import { ChevronLeft, ChevronRight, Grid2x2, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import JobCard from "@/pages/jobs/components/JobCard";
import { useGetJobs } from "@/api/jobs/job.queries";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

const JobListSection = () => {
  const [page, setPage] = useState(1);
  const size = 12;
  const [items, setItems] = useState<Job[]>([]);

  const filters = useMemo(() => ({ page, size }), [page, size]);
  const { data, isLoading, isError, isFetching } = useGetJobs(filters);

  const apiJobs = data?.data?.result ?? [];
  const meta = data?.data?.meta;
  const total = meta?.total ?? items.length;
  const hasNextPage = meta ? meta.page < meta.pages : false;

  useEffect(() => {
    setItems(apiJobs);
  }, [apiJobs, data?.data, page]);

  return (
    <section className="flex-1">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recommended for you
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {isLoading
              ? "Loading opportunities..."
              : `Found ${total} matching career opportunities`}
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            className="rounded-lg bg-primary/10 p-2 text-primary"
          >
            <Grid2x2 className="size-4" />
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Failed to load jobs. Please try again.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((job) => (
          <JobCard key={job.id} job={job} />
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
                  {meta.pages} pages
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
