import { Bell, Settings, SlidersHorizontal } from "lucide-react";

import {
  experienceFilters,
  industryFilters,
  jobTypeFilters,
} from "@/pages/jobs/helper";

const navLinks = ["Find Jobs", "My Applications", "Profile"];

const JobSearchTopNav = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              CognitiveBridge
            </span>
            <div className="hidden gap-6 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className={`border-b-2 py-1 text-sm font-semibold transition-colors ${
                    link === "Find Jobs"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-600 hover:text-primary"
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-primary"
            >
              <Bell className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="rounded-full p-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-primary"
            >
              <Settings className="size-5" />
            </button>
            <div className="size-9 overflow-hidden rounded-full border border-slate-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS0FoW5Z0KfIiipGj8AcqmZ5YsaPYXcsSR8d-2bkj7t_b9wvjcSQbmN_jMPWlxbq81cm08GLH9fkCZecDz7oi7vXDrK9SWLsRKPpAzCraMJ1Agl-oWe268sa9c7Bm84ddjwamlesyzwV_JrNZxXDrJ8xrTTXmqNrLMW33leAgpqSArr85MLRRzuM20dKGQ87KONifn_1WmmQQ-lEtLMpCXRzyPJPb3iN-yKRtyr-HP4LzJNjrDEXCOnKDtt07Qqa432HpLq9BZdkt-"
                alt="User avatar"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200/70 py-3">
          <div className="hidden items-center gap-2 text-sm font-semibold text-slate-700 md:flex">
            <SlidersHorizontal className="size-4 text-primary" />
            Filters
          </div>

          <div className="flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 md:pb-0">
            {industryFilters.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  item.checked
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="mx-2 hidden h-6 w-px bg-slate-200 md:inline-block" />

            {experienceFilters.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  item.checked
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="mx-2 hidden h-6 w-px bg-slate-200 md:inline-block" />

            {jobTypeFilters.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  item.active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default JobSearchTopNav;
