import { Building2, CheckCircle2, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useGetCompanyDashboardStats } from "@/api/companies/company.queries";

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

export default function KPIStats() {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value);

  const statsQuery = useGetCompanyDashboardStats();
  const stats = statsQuery.data?.data;
  const items = [
    {
      label: t("managementCompanies.kpi.totalCompanies"),
      value: formatNumber(stats?.totalCompanies ?? 0),
      note: undefined,
      icon: Building2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: t("managementCompanies.kpi.pendingApproval"),
      value: formatNumber(stats?.pendingApproval ?? 0),
      note: undefined,
      icon: ClipboardCheck,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      label: t("managementCompanies.kpi.approved"),
      value: formatNumber(stats?.approved ?? 0),
      note: undefined,
      icon: CheckCircle2,
      tone: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3" data-section="KPIStats">
      {statsQuery.isError ? (
        <div className="rounded-2xl bg-white p-5 text-sm text-rose-600 shadow-sm">
          {t("managementCompanies.kpi.error")}
        </div>
      ) : null}
      {statsQuery.isLoading ? (
        <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">
          {t("managementCompanies.kpi.loading")}
        </div>
      ) : null}
      {!statsQuery.isLoading && !statsQuery.isError
        ? items.map(({ label, value, note, icon: Icon, tone }) => (
            <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${tone}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                    {label}
                  </p>
                </div>
                {note ? (
                  <span className="text-xs font-semibold text-emerald-700">
                    {note}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-3xl font-semibold text-slate-900">{value}</p>
              </div>
            </article>
          ))
        : null}
    </section>
  );
}
