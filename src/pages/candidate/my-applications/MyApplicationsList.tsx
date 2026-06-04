import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useGetApplications } from "@/api/applications/application.queries";
import ApplicationCard from "@/pages/candidate/my-applications/components/ApplicationCard";
import ApplicationsTabs, {
  type ApplicationTab,
} from "@/pages/candidate/my-applications/components/ApplicationsTabs";
import type { ApplicationItem } from "@/pages/candidate/my-applications/components/types";
import type {
  Application,
  ApplicationListFilters,
  ApplicationStatus,
} from "@/types/application";

const PAGE_SIZE = 10;

const statusParamMap: Record<
  Exclude<ApplicationTab, "All">,
  ApplicationStatus
> = {
  Pending: "PENDING",
  Reviewing: "REVIEWING",
  Interview: "INTERVIEW",
  Accepted: "ACCEPTED",
  Rejected: "REJECTED",
};

const statusLabelMap: Record<ApplicationStatus, ApplicationItem["status"]> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

const getStatusLabel = (value?: string | null): ApplicationItem["status"] => {
  if (!value) return "Pending";
  const normalized = value.trim().toUpperCase();
  return statusLabelMap[normalized as ApplicationStatus] ?? "Pending";
};

const MyApplicationsList = () => {
  const { t, i18n } = useTranslation();

  const [activeStatus, setActiveStatus] = useState<ApplicationTab>("All");

  const queryFilters = useMemo<ApplicationListFilters>(() => {
    const status =
      activeStatus === "All" ? undefined : statusParamMap[activeStatus];
    return {
      page: 1,
      size: PAGE_SIZE,
      status,
    };
  }, [activeStatus]);

  const { data, isLoading, isError } = useGetApplications(queryFilters);

  const items = useMemo(() => {
    // Hàm format ngày tháng tự động nhảy theo ngôn ngữ (vi-VN hoặc en-US)
    const formatAppliedDate = (value?: string | null) => {
      if (!value) return t("myApplications.fallbacks.na");
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return t("myApplications.fallbacks.na");

      const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    };

    const mapApplicationToItem = (
      application: Application,
    ): ApplicationItem => {
      const status = getStatusLabel(application.status);
      const score =
        typeof application.matchScore === "number"
          ? Math.round(application.matchScore)
          : 0;

      return {
        id: String(application.id),

        title:
          application.job?.name ?? t("myApplications.fallbacks.untitledRole"),
        company:
          application.job?.companyName ??
          t("myApplications.fallbacks.unknownCompany"),
        location:
          application.job?.location ??
          t("myApplications.fallbacks.unknownLocation"),
        appliedOn: formatAppliedDate(application.appliedAt),
        resumeName:
          application.resume?.fileName ?? t("myApplications.fallbacks.resume"),
        resumeUrl: application.resume?.fileUrl ?? undefined,
        fitScore: Math.max(0, Math.min(100, score)),
        status,
        logoUrl: application.job?.companyLogo ?? undefined,
        coverLetter: application.coverLetter ?? null,
        hasCoverLetter: application.hasCoverLetter ?? null,
        candidateName: application.candidate?.name ?? null,
        candidateEmail: application.candidate?.email ?? null,
      };
    };

    return (data?.data?.result ?? []).map(mapApplicationToItem);
  }, [data?.data?.result, t, i18n.language]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12">
      <section>
        <h1 className="mb-2 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          {t("myApplications.title")}
        </h1>
        <p className="text-base text-muted-foreground">
          {t("myApplications.subtitle")}
        </p>
      </section>

      <ApplicationsTabs activeTab={activeStatus} onChange={setActiveStatus} />

      <section className="flex flex-col gap-6">
        {isError ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t("myApplications.errorLoad")}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t("myApplications.loading")}
          </div>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t("myApplications.empty")}
          </div>
        ) : null}

        {items.map((item) => (
          <ApplicationCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
};

export default MyApplicationsList;
