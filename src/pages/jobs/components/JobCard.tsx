import {
  BadgeCheck,
  Bookmark,
  Bolt,
  Clock3,
  Globe,
  Share2,
  Wallet,
} from "lucide-react";

import type { JobCardItem } from "@/pages/jobs/helper";

type JobCardProps = {
  job: JobCardItem;
};

const JobCard = ({ job }: JobCardProps) => {
  const badge =
    job.badge?.tone === "secondary"
      ? {
          wrapper: "bg-cyan-100 text-cyan-800",
          icon: <BadgeCheck className="size-3.5" />,
        }
      : {
          wrapper: "bg-violet-100 text-violet-800",
          icon: <Bolt className="size-3.5" />,
        };

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="size-full object-contain"
            />
          </div>
          <button
            type="button"
            aria-label={`Bookmark ${job.title}`}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-500"
          >
            <Bookmark className="size-4" />
          </button>
        </div>

        {job.badge ? (
          <div
            className={`mb-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase ${badge.wrapper}`}
          >
            {badge.icon}
            {job.badge.label}
          </div>
        ) : null}

        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-primary">
          {job.title}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {job.company} • {job.location}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            {job.isRemote ? (
              <Globe className="size-3.5" />
            ) : (
              <Clock3 className="size-3.5" />
            )}
            {job.workType}
          </span>
          <span className="flex items-center gap-1">
            <Wallet className="size-3.5" />
            {job.salary}
          </span>
        </div>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <button
          type="button"
          className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Apply Now
        </button>
        <button
          type="button"
          aria-label={`Share ${job.title}`}
          className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-700 transition-colors hover:bg-slate-100"
        >
          <Share2 className="size-4" />
        </button>
      </div>
    </article>
  );
};

export default JobCard;
