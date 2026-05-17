import { useMemo } from "react";

import { useGetHrApplications } from "@/api/applications/application.queries";
import { useGetHrJobs } from "@/api/jobs/job.queries";
import { useGetHrDashboardStats } from "@/api/users/user.queries";
import { DashboardHeader } from "./components/DashboardHeader";
import { ActiveJobListings } from "./components/JobList";
import { RecentTalent } from "./components/RecentTalent";
import { StatsGrid } from "./components/StatsGrid";

export default function EmployerDashboard() {
  const statsQuery = useGetHrDashboardStats();
  const jobsQuery = useGetHrJobs({
    page: 1,
    size: 5,
    active: true,
    sort: "createdAt,desc",
  });
  const applicationsQuery = useGetHrApplications({
    page: 1,
    size: 5,
  });

  const activeJobs = jobsQuery.data?.data?.result ?? [];
  const recentTalent = useMemo(() => {
    const applications = applicationsQuery.data?.data?.result ?? [];

    return [...applications]
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, 3);
  }, [applicationsQuery.data?.data?.result]);

  return (
    <main className="min-h-screen bg-[#f7f9fc] p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <StatsGrid
          stats={statsQuery.data?.data}
          isLoading={statsQuery.isLoading}
          isError={statsQuery.isError}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <ActiveJobListings
              jobs={activeJobs}
              isLoading={jobsQuery.isLoading}
              isError={jobsQuery.isError}
            />
          </div>
          <div className="lg:col-span-4">
            <RecentTalent
              applications={recentTalent}
              isLoading={applicationsQuery.isLoading}
              isError={applicationsQuery.isError}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
