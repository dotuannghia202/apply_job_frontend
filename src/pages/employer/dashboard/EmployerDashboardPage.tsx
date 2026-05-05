import { DashboardHeader } from "./components/DashboardHeader";
import { ActiveJobListings } from "./components/JobList";
import { RecentTalent } from "./components/RecentTalent";
import { StatsGrid } from "./components/StatsGrid";

export default function EmployerDashboard() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <ActiveJobListings />
          </div>
          <div className="lg:col-span-4">
            <RecentTalent />
          </div>
        </div>
      </div>
    </main>
  );
}
