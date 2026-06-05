// JobListings.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Job } from "@/types/job";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ActiveJobListingsProps {
  jobs: Job[];
  isLoading?: boolean;
  isError?: boolean;
}

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

const formatDate = (value: string | null | undefined, locale: string, fallback: string) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export function ActiveJobListings({
  jobs,
  isLoading,
  isError,
}: ActiveJobListingsProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold text-[#2d3338]">
          {t("employerDashboard.jobs.title")}
        </h4>
        <Button
          variant="link"
          className="text-primary hover:text-primary-hover p-0 h-auto font-semibold"
          asChild
        >
          <Link to="/employer/jobs">
            {t("employerDashboard.jobs.viewAll")}
          </Link>
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border border-[#eaeef3] bg-white ">
        <Table>
          <TableHeader>
            <TableRow className="h-13.5 bg-[#e3e9ee] hover:bg-[#e3e9ee] ">
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider pl-4">
                {t("employerDashboard.jobs.columns.jobName")}
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider">
                {t("employerDashboard.jobs.columns.status")}
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider text-center">
                {t("employerDashboard.jobs.columns.applicants")}
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider">
                {t("employerDashboard.jobs.columns.postedDate")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <LoadingRows /> : null}
            {!isLoading && isError ? (
              <MessageRow message={t("employerDashboard.jobs.error")} />
            ) : null}
            {!isLoading && !isError && jobs.length === 0 ? (
              <MessageRow message={t("employerDashboard.jobs.empty")} />
            ) : null}
            {!isLoading && !isError
              ? jobs.map((job) => (
                  <JobRow key={job.id} job={job} locale={locale} />
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function JobRow({ job, locale }: { job: Job; locale: string }) {
  const { t } = useTranslation();
  const isOpen = job.active;

  return (
    <TableRow className="hover:bg-primary/10 transition-colors h-16">
      <TableCell>
        <span className="pl-3 font-semibold text-[#2d3338]">{job.name}</span>
      </TableCell>

      <TableCell>
        <Badge
          variant="secondary"
          className={
            isOpen
              ? "rounded-full bg-primary/12 text-primary font-bold hover:bg-primary/18 border-0"
              : "rounded-full bg-destructive/10 text-destructive/80 font-bold border-0"
          }
        >
          {isOpen
            ? t("employerDashboard.jobs.status.open")
            : t("employerDashboard.jobs.status.closed")}
        </Badge>
      </TableCell>

      <TableCell className="text-center font-medium text-[#2d3338]">
        {job.applicantCount ?? 0}
      </TableCell>

      <TableCell className="text-[#596065] text-sm">
        {formatDate(
          job.createdAt ?? job.startDate,
          locale,
          t("employerDashboard.common.notAvailable"),
        )}
      </TableCell>
    </TableRow>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="h-16">
          <TableCell>
            <div className="ml-3 h-4 w-44 animate-pulse rounded bg-slate-200" />
          </TableCell>
          <TableCell>
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          </TableCell>
          <TableCell>
            <div className="mx-auto h-4 w-8 animate-pulse rounded bg-slate-200" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function MessageRow({ message }: { message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={4} className="h-28 text-center text-sm text-[#596065]">
        {message}
      </TableCell>
    </TableRow>
  );
}
