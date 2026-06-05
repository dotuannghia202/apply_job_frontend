import { useTranslation } from "react-i18next";

export default function ManageUserHeader() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-6 rounded-lg border  bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("managementUsers.header.title")}
        </h1>
        <p className="text-sm text-slate-600">
          {t("managementUsers.header.description")}
        </p>
      </div>
    </section>
  );
}
