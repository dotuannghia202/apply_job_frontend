import JobFiltersSidebar from "@/pages/jobs/components/JobFiltersSidebar";
import JobListSection from "@/pages/jobs/components/JobListSection";
import JobSearchFooter from "@/pages/jobs/components/JobSearchFooter";
import JobSearchHero from "@/pages/jobs/components/JobSearchHero";
import JobSearchTopNav from "@/pages/jobs/components/JobSearchTopNav";

const JobListPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <JobSearchTopNav />

      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <JobSearchHero />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <JobFiltersSidebar />
          <JobListSection />
        </div>
      </main>

      <JobSearchFooter />
    </div>
  );
};

export default JobListPage;
