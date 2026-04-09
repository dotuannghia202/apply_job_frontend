import { Sparkles, SlidersHorizontal } from "lucide-react";

import {
  experienceFilters,
  industryFilters,
  jobTypeFilters,
} from "@/pages/jobs/helper";

const pillBaseClassName =
  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors";

const JobFiltersSidebar = () => {
  return (
    <aside className="w-full lg:w-72">
      <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </h3>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            Industry
          </p>
          <div className="space-y-3">
            {industryFilters.map((item) => (
              <label
                key={item.label}
                className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="size-4 rounded border-slate-300"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            Experience Level
          </p>
          <div className="space-y-3">
            {experienceFilters.map((item) => (
              <label
                key={item.label}
                className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
              >
                <input
                  type="radio"
                  name="experience"
                  defaultChecked={item.checked}
                  className="size-4 border-slate-300"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            Job Type
          </p>
          <div className="flex flex-wrap gap-2">
            {jobTypeFilters.map((item) => (
              <span
                key={item.label}
                className={`${pillBaseClassName} ${
                  item.active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/80 p-6 shadow-sm">
        <Sparkles className="mb-3 size-6 text-violet-600" />
        <h4 className="font-bold text-violet-900">AI Talent Agent</h4>
        <p className="mt-2 text-sm text-violet-800/85">
          Let our AI bridge the gap for you. We will discover opportunities that
          align with your profile.
        </p>
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Enable Agent
        </button>
      </div>
    </aside>
  );
};

export default JobFiltersSidebar;
