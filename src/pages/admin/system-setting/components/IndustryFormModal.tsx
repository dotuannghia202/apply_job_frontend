import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IndustryFormModalProps {
  open: boolean;
  initialData?: { id: number; name: string } | null;
  isPending?: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export default function IndustryFormModal({
  open,
  initialData,
  isPending,
  onSubmit,
  onClose,
}: IndustryFormModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
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
              ? t("systemSetting.industry.modal.editTitle")
              : t("systemSetting.industry.modal.createTitle")}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? t("systemSetting.industry.modal.editDescription")
              : t("systemSetting.industry.modal.createDescription")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            <div>
              <label
                htmlFor="industry-name"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                {t("systemSetting.industry.modal.nameLabel")}
              </label>
              <Input
                id="industry-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(
                  "systemSetting.industry.modal.namePlaceholder",
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
            <Button type="submit" disabled={!name.trim() || isPending}>
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
