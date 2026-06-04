import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";

type UserProfile = {
  name: string;
  title: string;
  isActive: boolean;
  userId: string;
  email: string;
  gender: string;
  age: string;
  avatarUrl?: string;
};

type UserProfileCardProps = {
  profile: UserProfile;
};

export default function UserProfileCard({ profile }: UserProfileCardProps) {
  const { t } = useTranslation();
  const avatarSrc = profile.avatarUrl || avatarPlaceholder;

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative">
          <img
            src={avatarSrc}
            alt={profile.name}
            className="h-28 w-28 rounded-2xl object-cover"
            onError={(event) => {
              event.currentTarget.src = avatarPlaceholder;
            }}
          />
          <button
            type="button"
            className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700"
            aria-label={t("managementUsers.detail.profile.settings")}
            title={t("managementUsers.detail.profile.settings")}
          >
            <Settings className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {profile.name}
              </h2>
              <p className="text-sm font-medium text-emerald-700">
                {profile.title}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                profile.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {profile.isActive
                ? t("managementUsers.status.active")
                : t("managementUsers.status.inactive")}
            </span>
          </div>

          <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t("managementUsers.detail.profile.labels.gender")}
              </p>
              <p className="font-semibold text-slate-800">{profile.gender}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t("managementUsers.detail.profile.labels.email")}
              </p>
              <p className="font-semibold text-slate-800">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t("managementUsers.detail.profile.labels.age")}
              </p>
              <p className="font-semibold text-slate-800">{profile.age}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
