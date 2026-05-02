import { Bell, MessageCircleMore } from "lucide-react";

import UserAvatarMenu from "@/pages/jobs/components/UserAvatarMenu";

const navLinks = ["Find Jobs", "My Applications", "Profile"];

const JobSearchTopNav = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Job Portal
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
