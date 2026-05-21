import React from "react";
import { AlertCircle, Settings2 } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useGetAccountInfo } from "@/api/users/user.queries";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types/user";
import ChangePasswordForm from "./components/ChangePasswordForm";
import ProfileForm from "./components/ProfileForm";

function resolveAccountUser(payload: User | { user: User } | null | undefined) {
  if (!payload) return null;
  return "user" in payload ? payload.user : payload;
}

function AccountSettingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
      <div className="h-[620px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
      <div className="h-[430px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
    </div>
  );
}

export default function AccountSettingPage() {
  const location = useLocation();
  const storeUser = useAuthStore((state) => state.user);
  const accountQuery = useGetAccountInfo();

  const accountUser = resolveAccountUser(accountQuery.data?.data);
  const fallbackUser = storeUser ? ({ ...storeUser } as User) : null;
  const user = accountUser ?? fallbackUser;

  React.useEffect(() => {
    if (!location.hash) return;

    const target = document.querySelector(location.hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16a34a]/20 bg-[#16a34a]/10 px-3 py-1 text-sm font-semibold text-[#15803d]">
              <Settings2 className="size-4" />
              Account
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Account Settings
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-500">
              Manage your personal information and security.
            </p>
          </div>
        </header>

        {accountQuery.isError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>
              We could not refresh your account details. Showing the latest
              saved session data instead.
            </p>
          </div>
        )}

        {accountQuery.isLoading && !user ? (
          <AccountSettingSkeleton />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
            <ProfileForm user={user} isLoading={accountQuery.isLoading} />
            <ChangePasswordForm />
          </div>
        )}
      </div>
    </main>
  );
}
