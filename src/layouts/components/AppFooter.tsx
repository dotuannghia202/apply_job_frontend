import { useState } from "react";
import { Globe, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const footerLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
  { label: "Cookie Settings", to: "/cookie-settings" },
  { label: "Accessibility", to: "/accessibility" },
  { label: "Support", to: "/support" },
];

const languageOptions = ["English", "Vietnamese"] as const;

const AppFooter = () => {
  const [language, setLanguage] =
    useState<(typeof languageOptions)[number]>("English");

  return (
    <footer className="pt-6 pb-4 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 py-10 px-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-lg font-bold text-slate-900">Job Portal</p>
          <p className="mt-1 text-xs text-slate-500">
            © 2026 Job Portal. Human-Centric Recruitment.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
          {footerLinks.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Language"
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-primary hover:text-white"
              >
                <Globe className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-2">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase text-slate-400">
                Language
              </p>
              <div className="flex flex-col gap-1">
                {languageOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLanguage(option)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      option === language
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{option}</span>
                    {option === language ? (
                      <span className="text-[10px] font-semibold">
                        Selected
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <a
            href="mailto:support@jobportal.com"
            aria-label="Contact"
            className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-primary hover:text-white"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
