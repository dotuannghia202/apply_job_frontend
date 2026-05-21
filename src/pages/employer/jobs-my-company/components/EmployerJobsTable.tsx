import {
  CalendarDays,
  Eye,
  MapPin,
  PencilLine,
  Trash2,
  WalletCards,
} from "lucide-react";
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
import { formatSalaryRange } from "@/pages/jobs/helper";
import type { Job } from "@/types/job";

type EmployerJobsTableProps = {
  jobs: Job[];
  isLoading: boolean;
  isError: boolean;
  onUpdate: (job: Job) => void;
  onDelete: (job: Job) => void;
  deletingJobId: number | null;
};

export function EmployerJobsTable({
  jobs,
  isLoading,
  isError,
  onUpdate,
  onDelete,
  deletingJobId,
}: EmployerJobsTableProps) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      {isError ? (
        <div className="p-6 text-sm text-destructive">
          Failed to load your jobs. Please try again.
        </div>
      ) : null}

      {isLoading ? (
        <div className="p-6 text-sm text-slate-500">Loading jobs...</div>
      ) : null}

      {!isLoading && !isError ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100 hover:bg-slate-100">
              <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Job
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Salary
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Location
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Dates
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Actions
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
                  <TableCell className="px-4 py-4 text-sm font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-2">
                      <WalletCards
                        className="size-4 text-slate-400"
                        aria-hidden="true"
                      />
                      {formatSalaryRange(job.minSalary, job.maxSalary)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[260px] px-4 py-4 whitespace-normal text-sm text-slate-600">
                    <span className="inline-flex items-start gap-2">
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                      {job.location || "Not specified"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        className="size-4 text-slate-400"
                        aria-hidden="true"
                      />
                      <span>
                        {formatDateLabel(job.startDate)} -{" "}
                        {formatDateLabel(job.endDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/jobs/detail/${job.id}`}>
                          <Eye className="size-4" aria-hidden="true" />
                          View
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onUpdate(job)}
                      >
                        <PencilLine className="size-4" aria-hidden="true" />
                        Update
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
                        {deletingJobId === job.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  No jobs match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : null}
    </Card>
  );
}
