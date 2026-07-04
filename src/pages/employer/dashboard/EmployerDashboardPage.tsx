import { Building2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useGetHrApplications } from "@/api/applications/application.queries";
import { useGetHrJobs } from "@/api/jobs/job.queries";
import { useGetHrDashboardStats } from "@/api/users/user.queries";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { DashboardHeader } from "./components/DashboardHeader";
import { ActiveJobListings } from "./components/JobList";
import { RecentTalent } from "./components/RecentTalent";
import { StatsGrid } from "./components/StatsGrid";

export default function EmployerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const companyId = useAuthStore((state) => state.company?.id);

  const statsQuery = useGetHrDashboardStats({ enabled: !!companyId });
  const jobsQuery = useGetHrJobs(
    {
      page: 1,
      size: 5,
      active: true,
      sort: "createdAt,desc",
    },
    { enabled: !!companyId },
  );
  const applicationsQuery = useGetHrApplications(
    {
      page: 1,
      size: 5,
    },
    { enabled: !!companyId },
  );

  const activeJobs = jobsQuery.data?.data?.result ?? [];
  const recentTalent = useMemo(() => {
    const applications = applicationsQuery.data?.data?.result ?? [];

    return [...applications]
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, 3);
  }, [applicationsQuery.data?.data?.result]);

  console.log("statsQuery.data?.data:", statsQuery.data?.data);

  return (
    <main className="min-h-screen bg-main-background p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        {!companyId ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-[0_12px_30px_rgba(15,23,42,0.03)] mt-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
              <Building2 className="size-8" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-950">
              {t("employerJobs.noCompany.title")}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              {t("employerJobs.noCompany.message")}
            </p>
            <div className="mt-8">
              <Button
                onClick={() => navigate("/employer/onboarding/company")}
                className="px-6 py-2.5 font-semibold shadow-md transition-transform hover:scale-[1.02]"
              >
                {t("employerJobs.noCompany.setupButton")}
              </Button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}
