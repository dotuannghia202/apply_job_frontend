import { useTranslation } from "react-i18next";

import { Switch } from "@/components/ui/switch";

type UserAccountStatusCardProps = {
  isActive: boolean;
  isUpdating?: boolean;
  onStatusChange?: (nextStatus: boolean) => void;
};

export default function UserAccountStatusCard({
  isActive,
  isUpdating = false,
  onStatusChange,
}: UserAccountStatusCardProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-lg border  bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          {t("managementUsers.detail.accountStatus.title")}
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isActive
            ? t("managementUsers.detail.accountStatus.active")
            : t("managementUsers.detail.accountStatus.locked")}
        </span>
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">
              {t("managementUsers.detail.accountStatus.accessTitle")}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 break-words">
              {t("managementUsers.detail.accountStatus.accessDescription")}
            </p>
          </div>
          <Switch
            checked={isActive}
            disabled={isUpdating}
            onCheckedChange={onStatusChange}
            aria-label={t("managementUsers.detail.accountStatus.toggleAccess")}
            aria-busy={isUpdating}
            className="mt-1 shrink-0"
          />
        </div>
      </div>
    </section>
  );
}
