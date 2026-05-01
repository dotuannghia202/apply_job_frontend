import JobListSection from "@/pages/jobs/components/JobListSection";
import JobSearchFooter from "@/pages/jobs/components/JobSearchFooter";

import JobSearchTopNav from "@/pages/jobs/components/JobSearchTopNav";
import JobCategoryHero from "./components/JobCategoryHero";

const JobListPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100">
      <JobSearchTopNav />

      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <JobCategoryHero />

        <JobListSection />
      </main>

      <JobSearchFooter />
    </div>
  );
};

export default JobListPage;
