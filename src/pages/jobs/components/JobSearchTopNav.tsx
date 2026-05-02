import { Bell, MessageCircleMore } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import UserAvatarMenu from "@/pages/jobs/components/UserAvatarMenu";

const navLinks = [
  { label: "Find Jobs", to: "/jobs", end: true },
  { label: "My Applications", to: "/jobs/applications" },
  { label: "My CV", to: "/jobs/my-cv" },
  { label: "Saved Jobs", to: "/jobs/saved" },
];

const employerModePaths = ["/employer", "/jobs/jd-generator"];

const JobSearchTopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployerMode = employerModePaths.some((path) =>
    location.pathname.startsWith(path),
  );

  const handleModeChange = (checked: boolean) => {
    navigate(checked ? "/employer/dashboard" : "/jobs");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-extrabold tracking-tight text-primary">
              Job Portal
            </span>
            <div className="hidden gap-6 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "border-b-2 py-1 text-sm font-semibold transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-600 hover:text-primary",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 sm:px-3">
              <span
                className={cn(
                  "hidden text-xs font-semibold transition-colors sm:inline",
                  !isEmployerMode ? "text-primary" : "text-slate-500",
                )}
              >
                Candidate
              </span>
              <Switch
                checked={isEmployerMode}
                onCheckedChange={handleModeChange}
                aria-label="Switch between candidate and employer mode"
              />
              <span
                className={cn(
                  "hidden text-xs font-semibold transition-colors sm:inline",
                  isEmployerMode ? "text-primary" : "text-slate-500",
                )}
              >
                Employer
              </span>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-primary"
            >
              <Bell className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Messages"
              className="rounded-full p-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-primary"
            >
              <MessageCircleMore className="size-5" />
            </button>

            <UserAvatarMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default JobSearchTopNav;
