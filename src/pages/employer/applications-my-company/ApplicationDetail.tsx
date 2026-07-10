import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Sparkles,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import {
  useGetApplicationById,
  useUpdateApplicationStatus,
} from "@/api/applications/application.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DetailRow,
  formatApplicationSalary,
  formatAppliedDate,
  getTimelineSteps,
  PageMessage,
  statusBadgeStyles,
} from "@/pages/candidate/my-applications/MyApplicationDetail";
import { AiFitCard } from "@/components/applications/AiFitCard";
import { ApplicationDocumentsCard } from "@/components/applications/ApplicationDocumentsCard";
import { getCandidateInitials } from "@/pages/employer/applications-my-company/helper";
import { InterviewModal } from "@/pages/employer/auto-send-email/InterviewModal";
import type { ApplicationStatus } from "@/types/application";

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

export default function ApplicationDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const applicationId = Number(id);
  const isValidApplicationId = Boolean(id) && Number.isFinite(applicationId);
  const locale = getLocale(i18n.language);

  const applicationQuery = useGetApplicationById(
    isValidApplicationId ? applicationId : 0,
  );
  const updateStatusMutation = useUpdateApplicationStatus();
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const application = applicationQuery.data?.data;
  const status = application?.status;

  // Auto transition PENDING to REVIEWING when employer opens the detail page
  useEffect(() => {
    if (
      application &&
      application.status === "PENDING" &&
      !updateStatusMutation.isPending
    ) {
      updateStatusMutation.mutate({
        id: application.id,
        data: { status: "REVIEWING" },
      });
    }
  }, [application?.status]);

  if (!isValidApplicationId) {
    return (
      <PageMessage>{t("myApplications.detail.status.notFound")}</PageMessage>
    );
  }

  if (applicationQuery.isLoading) {
    return (
      <PageMessage>{t("myApplications.detail.status.loading")}</PageMessage>
    );
  }

  if (applicationQuery.isError) {
    return (
      <PageMessage>
        {t("myApplications.detail.status.loadFailed")}
      </PageMessage>
    );
  }

  if (!application) {
    return (
      <PageMessage>{t("myApplications.detail.status.notFound")}</PageMessage>
    );
  }

  const job = application.job;
  const jobTitle =
    job?.name ?? t("myApplications.detail.fallbacks.untitledRole");
  const candidateName =
    application.candidate?.name ??
    t("employerApplications.fallbacks.unknownCandidate");
  const candidateEmail =
    application.candidate?.email ??
    t("employerApplications.fallbacks.noEmail");
  const candidateAvatar = application.candidate?.avatarUrl;

  const matchScore = Math.max(
    0,
    Math.min(100, Math.round(application.matchScore ?? 0)),
  );
  const matchedSkills = application.matchedSkills;
  const missingSkills = application.missingSkills;
  const cvFileName =
    application.resume?.fileName ?? t("myApplications.detail.fallbacks.resume");
  const cvFileUrl = application.resume?.fileUrl ?? null;
  const coverLetter = application.coverLetter?.trim();
  const salaryRange = formatApplicationSalary(
    job?.minSalary,
    job?.maxSalary,
    locale,
    t,
    // Add raw range if there
    (job as any)?.salaryRange,
  );
  const location =
    job?.location ?? t("myApplications.detail.fallbacks.notSpecified");
  const appliedDate = formatAppliedDate(
    application.appliedAt,
    locale,
    t("myApplications.detail.fallbacks.notAvailable"),
  );
  const timelineSteps = getTimelineSteps(status ?? "PENDING", t);

  const handleUpdateStatusClick = (newStatus: ApplicationStatus) => {
    if (newStatus === "INTERVIEW") {
      setShowInterviewModal(true);
    } else {
      updateStatusMutation.mutate({
        id: applicationId,
        data: { status: newStatus },
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <AppBreadcrumb
              items={[
                {
                  label: t("employerApplications.breadcrumb.dashboard"),
                  to: "/employer/dashboard",
                },
                {
                  label: t("employerApplications.breadcrumb.applicants"),
                  to: "/employer/applicants",
                },
                { label: candidateName },
              ]}
            />
            <Link
              to="/employer/applicants"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft className="size-4" />
              {t("employerApplications.pagination.previous", "Quay lại")}
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] md:flex-row md:items-start">
            <div className="flex items-center min-w-0 gap-4">
              <Avatar className="size-14 shrink-0">
                <AvatarImage
                  src={candidateAvatar || undefined}
                  alt={candidateName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-emerald-100 font-black text-emerald-700 text-lg">
                  {getCandidateInitials(
                    application.candidate?.name,
                    application.candidate?.email,
                    t("employerApplications.fallbacks.initials"),
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                  <Mail className="size-4" aria-hidden="true" />
                  <span>{candidateEmail}</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  {candidateName}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Ứng tuyển vị trí:{" "}
                  <span className="font-semibold text-slate-800">
                    {jobTitle}
                  </span>
                </p>
              </div>
            </div>

            {status && (
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.16em] ${
                  statusBadgeStyles[status] ?? statusBadgeStyles.PENDING
                }`}
              >
                <span className="size-2 rounded-full bg-current" />
                {t(`myApplications.detail.statusLabel.${status}`, status)}
              </span>
            )}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="flex flex-col gap-6">
            <AiFitCard
              matchScore={matchScore}
              matchedSkills={matchedSkills}
              missingSkills={missingSkills}
              role="employer"
            />

            <ApplicationDocumentsCard
              cvFileName={cvFileName}
              cvFileUrl={cvFileUrl}
              coverLetter={coverLetter}
              role="employer"
            />
          </section>

          <aside className="flex flex-col gap-6">
            {/* Status Update Controls */}
            {status && (
              <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-950">
                    Cập nhật trạng thái
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Xử lý trạng thái và tiến trình tuyển dụng.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-500">
                      Hiện tại:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        statusBadgeStyles[status] ?? statusBadgeStyles.PENDING
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {t(`myApplications.detail.statusLabel.${status}`, status)}
                    </span>
                  </div>

                  {status === "ACCEPTED" || status === "REJECTED" ? (
                    <div className="mt-2 border border-dashed border-slate-200 bg-slate-50/50 p-3 text-center text-sm font-medium text-slate-500">
                      Quy trình ứng tuyển đã kết thúc với trạng thái:{" "}
                      <span
                        className={
                          status === "ACCEPTED"
                            ? "font-semibold text-emerald-600"
                            : "font-semibold text-rose-600"
                        }
                      >
                        {t(
                          `myApplications.detail.statusLabel.${status}`,
                          status,
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-col gap-2.5">
                      {status === "PENDING" && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => handleUpdateStatusClick("REVIEWING")}
                        >
                          <Clock3 className="size-4" />
                          Chuyển sang: Đang xem xét
                        </Button>
                      )}

                      {(status === "PENDING" || status === "REVIEWING") && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => handleUpdateStatusClick("INTERVIEW")}
                        >
                          <CalendarPlus className="size-4" />
                          {t("employerApplications.actions.scheduleInterview")}
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleUpdateStatusClick("ACCEPTED")}
                      >
                        <CheckCircle2 className="size-4" />
                        {t("employerApplications.actions.acceptCandidate")}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start gap-2 border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleUpdateStatusClick("REJECTED")}
                      >
                        <XCircle className="size-4" />
                        {t("employerApplications.actions.rejectCandidate")}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-950">
                  Tóm tắt công việc
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Thông tin chính về vị trí ứng tuyển.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <DetailRow
                  icon={WalletCards}
                  label={t("myApplications.detail.snapshot.salary")}
                  value={salaryRange}
                />
                <DetailRow
                  icon={MapPin}
                  label={t("myApplications.detail.snapshot.location")}
                  value={location}
                />
                <DetailRow
                  icon={CalendarDays}
                  label={t("myApplications.detail.snapshot.appliedDate")}
                  value={appliedDate}
                />
              </div>

              {job?.id ? (
                <Link
                  to={`/jobs/detail/${job.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700"
                >
                  Xem tin tuyển dụng gốc
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
            </Card>

            <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-950">
                  {t("myApplications.detail.timeline.title")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tiến trình xử lý hồ sơ.
                </p>
              </div>

              <ol className="relative ml-1 flex flex-col gap-6">
                {timelineSteps.map((step, index) => {
                  const isCompleted = step.state === "completed";
                  const isActive = step.state === "active";
                  const isLast = index === timelineSteps.length - 1;

                  return (
                    <li key={step.title} className="relative flex gap-4">
                      {!isLast ? (
                        <span
                          className={`absolute left-[15px] top-8 h-[calc(100%+1.5rem)] w-px ${
                            isCompleted ? "bg-green-200" : "bg-slate-200"
                          }`}
                          aria-hidden="true"
                        />
                      ) : null}

                      <span
                        className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border ${
                          isCompleted
                            ? "border-green-600 bg-green-600 text-white shadow-sm"
                            : isActive
                              ? "border-amber-200 bg-white text-amber-600"
                              : "border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2
                            className="size-4 stroke-3"
                            aria-hidden="true"
                          />
                        ) : isActive ? (
                          <span className="relative flex size-3">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-70" />
                            <span className="relative inline-flex size-3 rounded-full bg-amber-500" />
                          </span>
                        ) : (
                          <Clock3 className="size-4" aria-hidden="true" />
                        )}
                      </span>

                      <div className="min-w-0 pb-1">
                        <h3
                          className={`text-sm font-semibold ${
                            step.state === "muted"
                              ? "text-slate-500"
                              : "text-slate-950"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          </aside>
        </div>
      </div>

      {showInterviewModal && (
        <InterviewModal
          applicationId={applicationId}
          onClose={() => setShowInterviewModal(false)}
        />
      )}
    </main>
  );
}
