import { ChevronDown, Grid2x2, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import JobCard from "@/pages/jobs/components/JobCard";
import { useGetJobs } from "@/api/jobs/job.queries";
import type { Job } from "@/types/job";

const JobListSection = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [items, setItems] = useState<Job[]>([]);

  const filters = useMemo(() => ({ page, pageSize }), [page, pageSize]);
  const { data, isLoading, isError, isFetching } = useGetJobs(filters);

  const apiJobs = data?.data?.result ?? [];
  const meta = data?.data?.meta;
  const total = meta?.total ?? items.length;
  const hasNextPage = meta ? meta.page < meta.pages : false;

  useEffect(() => {
    if (!data?.data) return;

    setItems((prev) => {
      if (page === 1) return apiJobs;

      const seenIds = new Set(prev.map((job) => job.id));
      const next = apiJobs.filter((job) => !seenIds.has(job.id));
      return [...prev, ...next];
    });
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

      {!isError && hasNextPage ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            disabled={isFetching}
            onClick={() => setPage((prev) => prev + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetching ? "Loading..." : "Load More Opportunities"}
            <ChevronDown className="size-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default JobListSection;
