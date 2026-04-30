import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Job } from "@/types/job";
import { formatVND, getCityFromAddress } from "../helper";

const JobCard = ({ job }: { job: Job }) => {
  const companyName = job.company?.name ?? "Unknown";
  const companyLogo = job.company?.logo;
  const salaryText = formatVND(job.salary);

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Logo */}
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5">
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={`${companyName} logo`}
            className="size-full object-contain"
          />
        ) : (
          <span className="text-lg font-bold text-slate-600">
            {companyName.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {/* HOT badge + Title */}
            <div className="flex flex-wrap items-center gap-1.5">
              {job.active && (
                <Badge className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-rose-600">
                  HOT
                </Badge>
              )}
              <h3
                className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-slate-900"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={job.name}
              >
                {job.name}
              </h3>
            </div>

            {/* Company name */}
            <p
              className="mt-0.5 truncate text-[11.5px] font-medium uppercase tracking-wide text-slate-400"
              title={companyName}
            >
              {companyName}
            </p>
          </div>

          {/* Heart button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Save ${job.name}`}
            className="size-9 shrink-0 rounded-full border border-green-400 text-green-500 hover:bg-green-50 hover:text-green-600"
          >
            <Heart className="size-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            {salaryText}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            {getCityFromAddress(job.location)}
          </Badge>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
