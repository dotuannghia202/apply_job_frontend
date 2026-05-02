import { useState } from "react";

import JobListSection from "@/pages/jobs/components/JobListSection";
import JobSearchFooter from "@/pages/jobs/components/JobSearchFooter";

import JobSearchTopNav from "@/pages/jobs/components/JobSearchTopNav";
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
      <JobSearchTopNav />

      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <JobCategoryHero filters={filters} onSearch={setFilters} />

        <JobListSection filters={filters} />
      </main>

      <JobSearchFooter />
    </div>
  );
};

export default JobListPage;
