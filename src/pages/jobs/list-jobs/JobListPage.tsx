import { useState } from "react";

import JobListSection from "@/pages/jobs/list-jobs/components/JobListSection";

import JobCategoryHero from "./components/JobCategoryHero";
import type { JobListFilters } from "@/types/job";

type JobSearchFilters = Pick<
  JobListFilters,
  | "name"
  | "companyName"
  | "location"
  | "minSalary"
  | "maxSalary"
  | "specialization"
>;

const JobListPage = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({});

  return (
    <main className="main-wrapper">
      <JobCategoryHero filters={filters} onSearch={setFilters} />

      <JobListSection filters={filters} />
    </main>
  );
};

export default JobListPage;
