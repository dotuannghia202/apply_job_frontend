import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  MapPin,
  // PencilLine,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { useGetApplicationById } from "@/api/applications/application.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Application, ApplicationStatus } from "@/types/application";

type TimelineState = "completed" | "active" | "muted";

type ApplicationWithOptionalDetails = Application & {
  job?: Application["job"] & {
    salaryRange?: string | null;
    skills?: string[] | null;
    company?: {
      name?: string | null;
      logo?: string | null;
    } | null;
  };
};

const statusBadgeStyles: Record<ApplicationStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  REVIEWING: "border-sky-200 bg-sky-50 text-sky-700",
  INTERVIEW: "border-green-200 bg-green-50 text-green-700",
  ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
};

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

const formatAppliedDate = (
  value: string | null | undefined,
  locale: string,
  fallback: string,
) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatVND = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatApplicationSalary = (
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
  locale: string,
  t: TFunction,
  rawSalaryRange?: string | null,
) => {
  const min = minSalary ?? 0;
  const max = maxSalary ?? 0;
  const hasMin = min > 0;
  const hasMax = max > 0;

  if (hasMin && !hasMax) {
    return t("myApplications.detail.salary.from", {
      salary: formatVND(min, locale),
    });
  }

  if (!hasMin && hasMax) {
    return t("myApplications.detail.salary.upTo", {
      salary: formatVND(max, locale),
    });
  }

  if (hasMin && hasMax) {
    return `${formatVND(min, locale)} - ${formatVND(max, locale)}`;
  }

  const normalizedSalaryRange = rawSalaryRange?.trim();
  if (
    normalizedSalaryRange &&
    normalizedSalaryRange.toLowerCase() !== "agree on salary"
  ) {
    return normalizedSalaryRange;
  }

  return t("myApplications.detail.salary.agree");
};

const getCompanyInitial = (companyName: string) =>
  companyName.trim().slice(0, 1).toUpperCase() || "?";

const getTimelineStates = (status: ApplicationStatus): TimelineState[] => {
  if (status === "INTERVIEW")
    return ["completed", "completed", "active", "muted"];
  if (status === "ACCEPTED" || status === "REJECTED") {
    return ["completed", "completed", "completed", "active"];
  }

  return ["completed", "active", "muted", "muted"];
};

const getTimelineSteps = (status: ApplicationStatus, t: TFunction) => {
  const states = getTimelineStates(status);

  return [
    {
      title: t("myApplications.detail.timeline.submittedTitle"),
      description: t("myApplications.detail.timeline.submittedDescription"),
      state: states[0],
    },
    {
      title: t("myApplications.detail.timeline.reviewTitle"),
      description: t("myApplications.detail.timeline.reviewDescription"),
      state: states[1],
    },
    {
      title: t("myApplications.detail.timeline.interviewTitle"),
      description: t("myApplications.detail.timeline.interviewDescription"),
      state: states[2],
    },
    {
      title: t("myApplications.detail.timeline.finalTitle"),
      description:
        status === "ACCEPTED"
          ? t("myApplications.detail.timeline.finalAccepted")
          : status === "REJECTED"
            ? t("myApplications.detail.timeline.finalRejected")
            : t("myApplications.detail.timeline.finalPending"),
      state: states[3],
    },
  ] as const;
};

const CircularMatchScore = ({
  score,
  label,
  ariaLabel,
}: {
  score: number;
  label: string;
  ariaLabel: string;
}) => {
  const radius = 52;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex size-38 items-center justify-center sm:size-42">
      <svg
        className="size-full -rotate-90"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        role="img"
        aria-label={ariaLabel}
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="#16a34a"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-slate-950">
          {score}%
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>
      </div>
    </div>
  );
};

const SkillTag = ({
  label,
  tone,
}: {
  label: string;
  tone: "matched" | "missing";
}) => {
  const className =
    tone === "matched"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-medium ${className}`}
    >
      {label}
    </span>
  );
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-md  text-green-600">
      <Icon className="size-5" aria-hidden="true" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  </div>
);

const PageMessage = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-slate-50/70 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <div className="mx-auto w-full max-w-7xl rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
      {children}
    </div>
  </main>
);

const MyApplicationDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const applicationId = Number(id);
  const isValidApplicationId = Boolean(id) && Number.isFinite(applicationId);
  const locale = getLocale(i18n.language);
  const applicationQuery = useGetApplicationById(
    isValidApplicationId ? applicationId : 0,
  );

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

  const application = applicationQuery.data?.data as
    | ApplicationWithOptionalDetails
    | null
    | undefined;

  if (!application) {
    return (
      <PageMessage>{t("myApplications.detail.status.notFound")}</PageMessage>
    );
  }

  const job = application.job;
  const jobTitle =
    job?.name ?? t("myApplications.detail.fallbacks.untitledRole");
  const companyName =
    job?.companyName ??
    job?.company?.name ??
    t("myApplications.detail.fallbacks.unknownCompany");
  const companyLogo = job?.companyLogo ?? job?.company?.logo ?? null;
  const status = application.status;
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
    job?.salaryRange,
  );
  const location =
    job?.location ?? t("myApplications.detail.fallbacks.notSpecified");
  const appliedDate = formatAppliedDate(
    application.appliedAt,
    locale,
    t("myApplications.detail.fallbacks.notAvailable"),
  );
  const timelineSteps = getTimelineSteps(status, t);
  // const canUpdateApplication = status === "PENDING";

  return (
    <main className="min-h-screen bg-slate-50/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-6">
          <AppBreadcrumb
            items={[
              {
                label: t("myApplications.detail.breadcrumb.jobs"),
                to: "/jobs",
              },
              {
                label: t("myApplications.detail.breadcrumb.myApplications"),
                to: "/applications",
              },
              { label: jobTitle },
            ]}
          />

          <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] md:flex-row md:items-start">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-green-200 bg-green-50 text-xl font-bold text-green-700">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={t("myApplications.detail.logoAlt", {
                      company: companyName,
                    })}
                    className="size-full object-contain"
                  />
                ) : (
                  getCompanyInitial(companyName)
                )}
              </div>
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                  <BriefcaseBusiness className="size-4" aria-hidden="true" />
                  <span>{companyName}</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {jobTitle}
                </h1>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.16em] ${
                statusBadgeStyles[status] ?? statusBadgeStyles.PENDING
              }`}
            >
              <span className="size-2 rounded-full bg-current" />
              {t(`myApplications.detail.statusLabel.${status}`, status)}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="flex flex-col gap-6">
            <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f0fdf4_0%,#ffffff_54%,#fffbeb_100%)] p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm">
                      <Sparkles className="size-4" aria-hidden="true" />
                      {t("myApplications.detail.ai.badge")}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                      {matchScore >= 80
                        ? t("myApplications.detail.ai.strongFit")
                        : t("myApplications.detail.ai.potentialFit")}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {t("myApplications.detail.ai.description")}
                    </p>
                  </div>

                  <CircularMatchScore
                    score={matchScore}
                    label={t("myApplications.detail.matchLabel")}
                    ariaLabel={t("myApplications.detail.matchScoreAria", {
                      score: matchScore,
                    })}
                  />
                </div>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                    {t("myApplications.detail.ai.matchedSkills")}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {matchedSkills === null || matchedSkills === undefined ? (
                      <span className="text-sm italic text-slate-500">
                        {t("myApplications.detail.ai.noData")}
                      </span>
                    ) : matchedSkills.length === 0 ? (
                      <span className="text-sm italic text-slate-500">
                        {t("myApplications.detail.ai.noMatched")}
                      </span>
                    ) : (
                      matchedSkills.map((skill) => (
                        <SkillTag key={skill} label={skill} tone="matched" />
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                    {t("myApplications.detail.ai.missingSkills")}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {missingSkills === null || missingSkills === undefined ? (
                      <span className="text-sm italic text-slate-500">
                        {t("myApplications.detail.ai.noData")}
                      </span>
                    ) : missingSkills.length === 0 ? (
                      <span className="text-sm italic text-slate-500">
                        {t("myApplications.detail.ai.noMissing")}
                      </span>
                    ) : (
                      missingSkills.map((skill) => (
                        <SkillTag key={skill} label={skill} tone="missing" />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-950">
                    {t("myApplications.detail.documents.title")}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {t("myApplications.detail.documents.description")}
                  </p>
                </div>
              </div>

              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
                      <FileText className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {cvFileName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t("myApplications.detail.documents.pdfResume")}
                      </p>
                    </div>
                  </div>

                  {cvFileUrl ? (
                    <a
                      href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                        cvFileUrl,
                      )}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition hover:text-green-700"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("myApplications.detail.documents.viewFile")}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-slate-400">
                      {t("myApplications.detail.fallbacks.noFileUrl")}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t("myApplications.detail.documents.coverLetter")}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {coverLetter ||
                    t("myApplications.detail.documents.noCoverLetter")}
                </p>
              </div>

              {/* {canUpdateApplication ? (
                <div className="rounded-xl border border-green-200 bg-green-50/70 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-green-800">
                      {t("myApplications.detail.documents.updateHint")}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full rounded-md border-green-600 bg-white text-green-700 hover:bg-green-50 hover:text-green-800 sm:w-auto"
                    >
                      <PencilLine className="size-4" aria-hidden="true" />
                      {t("myApplications.detail.documents.updateAction")}
                    </Button>
                  </div>
                </div>
              ) : null} */}
            </Card>
          </section>

          <aside className="flex flex-col gap-6">
            <Card className="border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-950">
                  {t("myApplications.detail.snapshot.title")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {t("myApplications.detail.snapshot.description")}
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
                  {t("myApplications.detail.snapshot.viewOriginal")}
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
                  {t("myApplications.detail.timeline.description")}
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
                          <Check
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
    </main>
  );
};

export default MyApplicationDetail;
