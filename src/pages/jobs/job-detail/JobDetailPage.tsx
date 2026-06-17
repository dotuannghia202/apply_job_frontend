import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetJobById } from "@/api/jobs/job.queries";
import { useToggleSaveJob } from "@/api/users/user.queries";
import { ApplyJobModal } from "@/pages/jobs/components/ApplyJobModal";
import { CandidateList } from "./components/CandidateList";
import { JobDetailHeader } from "./components/JobDetailHeader";
import { JobDetailInfo } from "./components/JobDetailInfo";
import { JobDetailSidebar } from "./components/JobDetailSidebar";
import { formatVND, getCityFromAddress } from "../helper";

const formatJobDetailSalary = (
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
  t: TFunction,
) => {
  const min = minSalary ?? 0;
  const max = maxSalary ?? 0;
  const hasMin = min > 0;
  const hasMax = max > 0;

  if (!hasMin && !hasMax) {
    return t("jobDetail.salary.agree");
  }

  if (hasMin && !hasMax) {
    return t("jobDetail.salary.from", { salary: formatVND(min) });
  }

  if (!hasMin && hasMax) {
    return t("jobDetail.salary.upTo", { salary: formatVND(max) });
  }

  return `${formatVND(min)} - ${formatVND(max)}`;
};

export default function JobDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const jobId = Number(id);
  const jobQuery = useGetJobById(jobId);
  const toggleSaveMutation = useToggleSaveJob();
  const job = jobQuery.data?.data;
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const locale = i18n.language === "vi" ? "vi-VN" : "en-GB";
  const deadlineLabel = t("jobDetail.header.applicationDeadline");
  const formatDateLabel = (value?: string | null) => {
    if (!value) return t("jobDetail.fallbacks.notSpecified");
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return t("jobDetail.fallbacks.notSpecified");
    }

    return new Intl.DateTimeFormat(locale).format(parsed);
  };

  const getDaysLeftLabel = (value?: string | null) => {
    if (!value) return "";
    const end = new Date(value);
    if (Number.isNaN(end.getTime())) return "";
    const diffMs = end.getTime() - Date.now();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (Number.isNaN(daysLeft)) return "";
    if (daysLeft < 0) return t("jobDetail.deadline.expired");
    if (daysLeft === 0) return t("jobDetail.deadline.dueToday");
    return t("jobDetail.deadline.daysLeft", { count: daysLeft });
  };

  useEffect(() => {
    if (job) {
      setIsSaved(job.isSaved);
    }
  }, [job]);

  if (!id || Number.isNaN(jobId)) {
    return (
      <main className="min-h-screen bg-main-background px-4 md:px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border  bg-white p-6 text-slate-600">
            {t("jobDetail.status.notFound")}
          </div>
        </div>
      </main>
    );
  }

  if (jobQuery.isLoading) {
    return (
      <main className="min-h-screen bg-main-background px-4 md:px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            {t("jobDetail.status.loading")}
          </div>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-main-background px-4 md:px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            {t("jobDetail.status.notFound")}
          </div>
        </div>
      </main>
    );
  }

  const handleToggleSave = async () => {
    if (toggleSaveMutation.isPending) return;

    try {
      const response = await toggleSaveMutation.mutateAsync(job.id);
      setIsSaved(Boolean(response.data));
    } catch (error) {
      console.error("Failed to toggle saved job", error);
    }
  };

  const handleApply = () => {
    if (job.isApplied) return;

    setIsApplyModalOpen(true);
  };

  const salaryText = formatJobDetailSalary(job.minSalary, job.maxSalary, t);
  const city =
    getCityFromAddress(job.location) ||
    job.location ||
    t("jobDetail.fallbacks.unknownLocation");
  const timeLeftLabel = `${formatDateLabel(job.endDate)} ${getDaysLeftLabel(
    job.endDate,
  )}`.trim();
  const requirements = job.requirements?.length
    ? job.requirements
    : [t("jobDetail.fallbacks.noRequirements")];
  const specialties = job.skills?.length
    ? job.skills
    : job.specialization?.name
      ? [job.specialization.name]
      : [t("jobDetail.fallbacks.notSpecified")];
  const benefits = job.benefits?.length
    ? job.benefits
    : [t("jobDetail.fallbacks.notSpecified")];
  const description = job.description || t("jobDetail.fallbacks.notSpecified");
  const workplace = job.location || t("jobDetail.fallbacks.notSpecified");
  const workType = t("jobDetail.values.fullTime");
  const education = t("jobDetail.fallbacks.notSpecified");
  const level = job.levels?.length
    ? job.levels.join(", ")
    : t("jobDetail.fallbacks.notSpecified");
  const openings = job.quantity
    ? t("jobDetail.values.openings", { count: job.quantity })
    : t("jobDetail.fallbacks.notSpecified");

  return (
    <main className="min-h-screen bg-main-background px-4 md:px-6 py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-6">
        <JobDetailHeader
          title={job.name}
          salary={salaryText}
          location={city}
          experience={t("jobDetail.fallbacks.notSpecified")}
          deadlineLabel={deadlineLabel}
          timeLeftLabel={timeLeftLabel}
          isSaved={isSaved}
          isApplied={job.isApplied}
          isSaving={toggleSaveMutation.isPending}
          onApply={handleApply}
          onToggleSave={handleToggleSave}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <JobDetailInfo
              requirements={requirements}
              specialties={specialties}
              description={description}
              benefits={benefits}
              workplace={workplace}
              applyInstruction={t("jobDetail.info.applyInstruction")}
              deadline={t("jobDetail.info.deadline", {
                date: formatDateLabel(job.endDate),
              })}
            />

            <CandidateList />
          </div>

          <JobDetailSidebar
            companyId={job.company?.id}
            companyName={
              job.company?.name ?? t("jobDetail.fallbacks.unknownCompany")
            }
            companyLogo={job.company?.logo ?? ""}
            companySize={t("jobDetail.fallbacks.notSpecified")}
            companyField={
              job.specialization?.name ?? t("jobDetail.fallbacks.notSpecified")
            }
            companyLocation={
              job.location || t("jobDetail.fallbacks.notSpecified")
            }
            level={level}
            education={education}
            openings={openings}
            workType={workType}
            relatedCategories={specialties}
            regions={[city]}
          />
        </div>
      </div>
      {isApplyModalOpen ? (
        <ApplyJobModal
          job={job}
          open={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      ) : null}
    </main>
  );
}
