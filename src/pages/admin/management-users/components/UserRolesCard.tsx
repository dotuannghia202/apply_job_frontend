import { useTranslation } from "react-i18next";

import type { RoleName } from "@/types/auth";

type UserRolesCardProps = {
  roles: RoleName[];
};

const roleStyles: Record<UserRolesCardProps["roles"][number], string> = {
  CANDIDATE: "bg-emerald-100 text-emerald-700",
  EMPLOYER: "bg-emerald-100 text-emerald-700",
  ADMIN: "bg-slate-100 text-slate-400",
};

export default function UserRolesCard({ roles }: UserRolesCardProps) {
  const { t } = useTranslation();

  const roleLabels: Record<RoleName, string> = {
    ADMIN: t("managementUsers.roles.admin"),
    EMPLOYER: t("managementUsers.roles.employer"),
    CANDIDATE: t("managementUsers.roles.candidate"),
  };

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        {t("managementUsers.detail.rolesCard.title")}
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {roles.map((role) => (
          <span
            key={role}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${roleStyles[role]}`}
          >
            {roleLabels[role]}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-emerald-700 hover:underline"
      >
        {t("managementUsers.detail.rolesCard.managePermissions")}
      </button>
    </section>
  );
}
