import { useTranslation } from "react-i18next";

export default function PageHeader() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4" data-section="PageHeader">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t("managementCompanies.header.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            {t("managementCompanies.header.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
