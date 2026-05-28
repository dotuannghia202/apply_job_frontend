import { Settings } from "lucide-react";

import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";

type UserProfile = {
  name: string;
  title: string;
  tag: string;
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
            aria-label="Settings"
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
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {profile.tag}
            </span>
          </div>

          <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Gender
              </p>
              <p className="font-semibold text-slate-800">{profile.gender}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Email Address
              </p>
              <p className="font-semibold text-slate-800">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Age
              </p>
              <p className="font-semibold text-slate-800">{profile.age}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
