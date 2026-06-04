import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

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
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700"
        >
          <Download className="size-4" />
          {t("managementCompanies.header.exportCsv")}
        </Button>
      </div>
    </section>
  );
}
