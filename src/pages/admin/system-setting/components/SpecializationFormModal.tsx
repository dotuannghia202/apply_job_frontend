import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Industry } from "@/types/industry";

interface SpecializationFormModalProps {
  open: boolean;
  initialData?: { id: number; name: string } | null;
  isPending?: boolean;
  industries: Industry[];
  selectedIndustryId?: number | null;
  onSubmit: (name: string, industryId: number) => void;
  onClose: () => void;
}

export default function SpecializationFormModal({
  open,
  initialData,
  isPending,
  industries,
  selectedIndustryId,
  onSubmit,
  onClose,
}: SpecializationFormModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState<number>(0);

  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setIndustryId(selectedIndustryId ?? industries[0]?.id ?? 0);
    }
  }, [open, initialData, selectedIndustryId, industries]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !industryId) return;
    onSubmit(trimmed, industryId);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="text-lg font-bold text-slate-900">
            {isEdit
              ? t("systemSetting.specialization.modal.editTitle")
              : t("systemSetting.specialization.modal.createTitle")}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? t("systemSetting.specialization.modal.editDescription")
              : t("systemSetting.specialization.modal.createDescription")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            <div>
              <label
                htmlFor="spec-industry"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                {t("systemSetting.specialization.modal.industryLabel")}
              </label>
              <select
                id="spec-industry"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary"
                value={industryId}
                onChange={(e) => setIndustryId(Number(e.target.value))}
                disabled={isPending || isEdit}
              >
                <option value={0} disabled>
                  {t(
                    "systemSetting.specialization.modal.industryPlaceholder",
                  )}
                </option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="spec-name"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                {t("systemSetting.specialization.modal.nameLabel")}
              </label>
              <Input
                id="spec-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(
                  "systemSetting.specialization.modal.namePlaceholder",
                )}
                autoFocus
                disabled={isPending}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {t("systemSetting.common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !industryId || isPending}
            >
              {isPending
                ? t("systemSetting.common.saving")
                : isEdit
                  ? t("systemSetting.common.update")
                  : t("systemSetting.common.create")}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
