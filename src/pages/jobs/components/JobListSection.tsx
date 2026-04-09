import { ChevronDown, Grid2x2, List } from "lucide-react";

import JobCard from "@/pages/jobs/components/JobCard";
import { jobCards } from "@/pages/jobs/helper";

const JobListSection = () => {
  return (
    <section className="flex-1">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recommended for you
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Found 48 matching career opportunities
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {jobCards.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          Load More Opportunities
          <ChevronDown className="size-4" />
        </button>
      </div>
    </section>
  );
};

export default JobListSection;
