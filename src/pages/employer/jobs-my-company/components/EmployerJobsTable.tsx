import {
  CalendarDays,
  Eye,
  MapPin,
  PencilLine,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateLabel } from "@/pages/employer/jobs-my-company/helper";
import type { Job } from "@/types/job";
import { JobStatusBadge } from "./JobStatusBadge";

type EmployerJobsTableProps = {
  jobs: Job[];
  isLoading: boolean;
  isError: boolean;
  onUpdate: (job: Job) => void;
  onDelete: (job: Job) => void;
  deletingJobId: number | null;
  locale: string;
};

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatSalaryRange = (
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
  locale: string,
  labels: {
    agree: string;
    from: (salary: string) => string;
    upTo: (salary: string) => string;
  },
) => {
  const min = minSalary ?? 0;
  const max = maxSalary ?? 0;
  const hasMin = min > 0;
  const hasMax = max > 0;

  if (!hasMin && !hasMax) return labels.agree;
  if (hasMin && !hasMax) return labels.from(formatCurrency(min, locale));
  if (!hasMin && hasMax) return labels.upTo(formatCurrency(max, locale));

  return `${formatCurrency(min, locale)} - ${formatCurrency(max, locale)}`;
};

export function EmployerJobsTable({
  jobs,
  isLoading,
  isError,
  onUpdate,
  onDelete,
  deletingJobId,
  locale,
}: EmployerJobsTableProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      {isError ? (
        <div className="p-6 text-sm text-destructive">
          {t("employerJobs.table.error")}
        </div>
      ) : null}

      {isLoading ? (
        <div className="p-6 text-sm text-slate-500">
          {t("employerJobs.table.loading")}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary">
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase  text-white">
                {t("employerJobs.table.columns.job")}
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase  text-white">
                {t("employerJobs.table.columns.status")}
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase  text-white">
                {t("employerJobs.table.columns.salary")}
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase  text-white">
                {t("employerJobs.table.columns.location")}
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase  text-white">
                {t("employerJobs.table.columns.dates")}
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase  text-white">
                {t("employerJobs.table.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length ? (
              jobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-primary/5">
                  <TableCell className="max-w-[320px] px-4 py-4 whitespace-normal">
                    <div className="font-semibold text-slate-950">
                      {job.name}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(job.levels ?? []).map((level) => (
                        <Badge
                          key={level}
                          variant="outline"
                          className="bg-white text-[11px]"
                        >
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <JobStatusBadge active={job.active} />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-2">
                      <WalletCards
                        className="size-4 text-slate-400"
                        aria-hidden="true"
                      />
                      {formatSalaryRange(job.minSalary, job.maxSalary, locale, {
                        agree: t("employerJobs.salary.agree"),
                        from: (salary) =>
                          t("employerJobs.salary.from", { salary }),
                        upTo: (salary) =>
                          t("employerJobs.salary.upTo", { salary }),
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[260px] px-4 py-4 whitespace-normal text-sm text-slate-600">
                    <span className="inline-flex items-start gap-2">
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                      {job.location || t("employerJobs.fallbacks.notSpecified")}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        className="size-4 text-slate-400"
                        aria-hidden="true"
                      />
                      <span>
                        {formatDateLabel(
                          job.startDate,
                          locale,
                          t("employerJobs.fallbacks.notSet"),
                        )}{" "}
                        -{" "}
                        {formatDateLabel(
                          job.endDate,
                          locale,
                          t("employerJobs.fallbacks.notSet"),
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/jobs/detail/${job.id}`}>
                          <Eye className="size-4" aria-hidden="true" />
                          {t("employerJobs.table.actions.view")}
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onUpdate(job)}
                      >
                        <PencilLine className="size-4" aria-hidden="true" />
                        {t("employerJobs.table.actions.update")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onDelete(job)}
                        disabled={deletingJobId === job.id}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {deletingJobId === job.id
                          ? t("employerJobs.table.actions.deleting")
                          : t("employerJobs.table.actions.delete")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {t("employerJobs.table.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : null}
    </Card>
  );
}
