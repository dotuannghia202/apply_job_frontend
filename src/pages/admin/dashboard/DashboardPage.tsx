import { useGetAdminDashboardStats } from "@/api/admin/dashboard.queries";
import DashboardHeader from "./components/DashboardHeader";
import RecentActivities from "./components/RecentActivities";
import StatsOverview from "./components/StatsOverview";
import TopIndustries from "./components/TopIndustries";
import UserGrowthChart from "./components/UserGrowthChart";

function DashboardPage() {
  const statsQuery = useGetAdminDashboardStats();
  const stats = statsQuery.data?.data;

  return (
    <main className="min-h-screen bg-main-background">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <DashboardHeader
          isError={statsQuery.isError}
          isLoading={statsQuery.isLoading}
        />
        <StatsOverview
          isError={statsQuery.isError}
          isLoading={statsQuery.isLoading}
          stats={stats}
        />
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <UserGrowthChart
            isError={statsQuery.isError}
            isLoading={statsQuery.isLoading}
            stats={stats}
          />
          <TopIndustries
            isError={statsQuery.isError}
            isLoading={statsQuery.isLoading}
            stats={stats}
          />
        </section>
        <RecentActivities
          isError={statsQuery.isError}
          isLoading={statsQuery.isLoading}
          stats={stats}
        />
      </div>
    </main>
  );
}

export default DashboardPage;
