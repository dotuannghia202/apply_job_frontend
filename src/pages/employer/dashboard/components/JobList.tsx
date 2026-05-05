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

import type { JobPosted } from "../../types";

const JOBS: JobPosted[] = [
  {
    id: 1,
    name: "Senior UX Designer",

    status: "Open",
    applicants: 42,
    postedDate: "Oct 12, 2023",
  },
  {
    id: 2,
    name: "Lead Data Scientist",

    status: "Open",
    applicants: 18,
    postedDate: "Oct 10, 2023",
  },
  {
    id: 3,
    name: "Marketing Director",

    status: "Closed",
    applicants: 156,
    postedDate: "Sept 28, 2023",
  },
];

export function ActiveJobListings() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold text-[#2d3338]">
          Active Job Listings
        </h4>
        <Button
          variant="link"
          className="text-primary hover:text-primary-hover p-0 h-auto font-semibold"
        >
          View All
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
            {JOBS.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function JobRow({ job }: { job: JobPosted }) {
  const isOpen = job.status === "Open";

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
          {job.status}
        </Badge>
      </TableCell>

      <TableCell className="text-center font-medium text-[#2d3338]">
        {job.applicants}
      </TableCell>

      <TableCell className="text-[#596065] text-sm">{job.postedDate}</TableCell>
    </TableRow>
  );
}
