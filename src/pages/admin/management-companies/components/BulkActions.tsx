import { CheckCircle2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
}

export default function BulkActions({ selectedCount }: BulkActionsProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f1f4f7] px-4 py-3"
      data-section="BulkActions"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {t("managementCompanies.bulk.selectedCompanies", {
          count: selectedCount,
        })}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="border-slate-200 bg-white text-slate-700"
          disabled={selectedCount === 0}
        >
          <CheckCircle2 className="size-4" />
          {t("managementCompanies.bulk.approveSelected")}
        </Button>
        <Button
          variant="outline"
          className="border-slate-200 bg-white text-slate-700"
          disabled={selectedCount === 0}
        >
          <Lock className="size-4" />
          {t("managementCompanies.bulk.suspendSelected")}
        </Button>
      </div>
    </div>
  );
}
