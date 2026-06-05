import { useTranslation } from "react-i18next";

import { ApplicationRichCard } from "@/pages/employer/applications-my-company/components/ApplicationRichCard";
import type { Application } from "@/types/application";

type ApplicationsListProps = {
  applications: Application[];
  isLoading: boolean;
  isError: boolean;
};

export function ApplicationsList({
  applications,
  isLoading,
  isError,
}: ApplicationsListProps) {
  const { t } = useTranslation();

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
        {t("employerApplications.list.error")}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500">
        {t("employerApplications.list.loading")}
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-bold text-slate-950">
          {t("employerApplications.list.emptyTitle")}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {t("employerApplications.list.emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {applications.map((application) => (
        <ApplicationRichCard key={application.id} application={application} />
      ))}
    </section>
  );
}
