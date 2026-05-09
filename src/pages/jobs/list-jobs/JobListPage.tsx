import { useState } from "react";

import JobListSection from "@/pages/jobs/list-jobs/components/JobListSection";

import JobCategoryHero from "./components/JobCategoryHero";
import type { JobListFilters } from "@/types/job";

type JobSearchFilters = Pick<
  JobListFilters,
  "keyword" | "location" | "maxSalary"
>;

const JobListPage = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({});

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100">
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <JobCategoryHero filters={filters} onSearch={setFilters} />

        <JobListSection filters={filters} />
      </main>
    </div>
  );
};

export default JobListPage;
