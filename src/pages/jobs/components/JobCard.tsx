import { Bookmark } from "lucide-react";

import type { Job } from "@/types/job";

const JobCard = ({ job }: { job: Job }) => {
  const companyName = job.company?.name ?? "Unknown";
  const companyLogo = job.company?.logo;

  const formatSalary = (salary: number) => {
    if (!Number.isFinite(salary) || salary <= 0) return "Thỏa thuận";
    if (salary >= 1_000_000) {
      const million = salary / 1_000_000;
      const display =
        million >= 10 ? Math.round(million) : Math.round(million * 10) / 10;
      return `${display} triệu`;
    }
    return `${salary} triệu`;
  };

  const salaryText = formatSalary(job.salary);

  return (
    <article className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={`${companyName} logo`}
            className="size-full object-contain"
          />
        ) : (
          <span className="text-xl font-bold text-slate-600">
            {companyName.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {job.active ? (
                <span className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">
                  HOT
                </span>
              ) : null}

              <h3 className="min-w-0 text-lg font-extrabold leading-snug text-slate-900">
                {job.name}
              </h3>
            </div>

            <p className="mt-1 text-sm text-slate-600">{companyName}</p>
          </div>

          <button
            type="button"
            aria-label={`Save ${job.name}`}
            className="shrink-0 rounded-full border border-green-500/30 p-2 text-green-600 transition-colors hover:bg-green-50"
          >
            <Bookmark className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {salaryText}
          </span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {job.location}
          </span>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
