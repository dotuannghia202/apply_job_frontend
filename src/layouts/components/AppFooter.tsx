import { Globe, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const footerLinks = [
  { labelKey: "appFooter.links.privacyPolicy", to: "/privacy-policy" },
  { labelKey: "appFooter.links.termsOfService", to: "/terms-of-service" },
  { labelKey: "appFooter.links.cookieSettings", to: "/cookie-settings" },
  { labelKey: "appFooter.links.accessibility", to: "/accessibility" },
  { labelKey: "appFooter.links.support", to: "/support" },
];

const languageOptions = [
  { code: "en", labelKey: "appFooter.languages.english" },
  { code: "vi", labelKey: "appFooter.languages.vietnamese" },
] as const;

const AppFooter = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith("vi") ? "vi" : "en";

  return (
    <footer className="pt-6 pb-4 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 py-10 px-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-lg font-bold text-slate-900">
            {t("appFooter.brand")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {t("appFooter.tagline")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
          {footerLinks.map((item) => (
            <Link
              key={item.labelKey}
              to={item.to}
              className="transition-colors hover:text-primary"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={t("appFooter.language")}
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-primary hover:text-white"
              >
                <Globe className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-2">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase text-slate-400">
                {t("appFooter.language")}
              </p>
              <div className="flex flex-col gap-1">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => void i18n.changeLanguage(option.code)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      option.code === currentLanguage
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{t(option.labelKey)}</span>
                    {option.code === currentLanguage ? (
                      <span className="text-[10px] font-semibold">
                        {t("appFooter.selected")}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=support@jobportal.com&su=Job%20Portal%20Support%20Request"
            target="_blank"
            rel="noreferrer"
            aria-label={t("appFooter.contactSupport")}
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
