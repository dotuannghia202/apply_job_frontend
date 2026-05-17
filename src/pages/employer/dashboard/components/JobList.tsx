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

interface ActiveJobListingsProps {
  jobs: Job[];
  isLoading?: boolean;
  isError?: boolean;
}

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
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
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold text-[#2d3338]">
          Active Job Listings
        </h4>
        <Button
          variant="link"
          className="text-primary hover:text-primary-hover p-0 h-auto font-semibold"
          asChild
        >
          <Link to="/employer/jobs">View All</Link>
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border border-[#eaeef3] bg-white ">
        <Table>
          <TableHeader>
            <TableRow className="h-13.5 bg-[#e3e9ee] hover:bg-[#e3e9ee] ">
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider pl-4">
                Job Name
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider text-center">
                Applicants
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold text-[#596065] uppercase tracking-wider">
                Posted Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <LoadingRows /> : null}
            {!isLoading && isError ? (
              <MessageRow message="Unable to load active jobs." />
            ) : null}
            {!isLoading && !isError && jobs.length === 0 ? (
              <MessageRow message="No active jobs found." />
            ) : null}
            {!isLoading && !isError
              ? jobs.map((job) => <JobRow key={job.id} job={job} />)
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function JobRow({ job }: { job: Job }) {
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
          {isOpen ? "Open" : "Closed"}
        </Badge>
      </TableCell>

      <TableCell className="text-center font-medium text-[#2d3338]">
        {job.applicantCount ?? 0}
      </TableCell>

      <TableCell className="text-[#596065] text-sm">
        {formatDate(job.createdAt ?? job.startDate)}
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
