import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  ShieldCheck,
  FileText,
  Cookie,
  Accessibility,
  LifeBuoy,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type PlaceholderPageType =
  | "privacy"
  | "terms"
  | "cookies"
  | "accessibility"
  | "support";

type PlaceholderPageProps = {
  type: PlaceholderPageType;
};

const pageConfig: Record<
  PlaceholderPageType,
  {
    icon: typeof ShieldCheck;
    translationKey: `placeholderPages.${PlaceholderPageType}`;
  }
> = {
  privacy: {
    icon: ShieldCheck,
    translationKey: "placeholderPages.privacy",
  },
  terms: {
    icon: FileText,
    translationKey: "placeholderPages.terms",
  },
  cookies: {
    icon: Cookie,
    translationKey: "placeholderPages.cookies",
  },
  accessibility: {
    icon: Accessibility,
    translationKey: "placeholderPages.accessibility",
  },
  support: {
    icon: LifeBuoy,
    translationKey: "placeholderPages.support",
  },
};

const sectionIndexes = [0, 1, 2] as const;

export default function PlaceholderPage({ type }: PlaceholderPageProps) {
  const { t } = useTranslation();
  const { icon: Icon, translationKey } = pageConfig[type];

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {t("placeholderPages.common.backToHome")}
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Icon className="size-4" />
                {t(`${translationKey}.label`)}
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                {t(`${translationKey}.title`)}
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                {t(`${translationKey}.subtitle`)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
              {t("placeholderPages.common.updated")}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {sectionIndexes.map((index) => (
              <article
                key={`${type}-${index}`}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                  <CheckCircle2 className="size-4 text-primary" />
                  {t("placeholderPages.common.section", { number: index + 1 })}
                </div>

                <h2 className="mt-3 text-sm font-semibold text-slate-900">
                  {t(`${translationKey}.sections.${index}.heading`)}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t(`${translationKey}.sections.${index}.description`)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <Trans
              i18nKey="placeholderPages.common.demoNotice"
              components={{
                supportLink: (
                  <a
                    href="mailto:support@jobportal.com"
                    className="font-semibold text-primary hover:underline"
                  />
                ),
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
