import { Globe, Mail } from "lucide-react";

const footerLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Settings",
  "Accessibility",
  "Support",
];

const JobSearchFooter = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-lg font-bold text-slate-900">CognitiveBridge AI</p>
          <p className="mt-1 text-xs text-slate-500">
            © 2026 CognitiveBridge AI. Human-Centric Recruitment.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
          {footerLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="transition-colors hover:text-primary"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Website"
            className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-primary hover:text-white"
          >
            <Globe className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Contact"
            className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-primary hover:text-white"
          >
            <Mail className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default JobSearchFooter;
