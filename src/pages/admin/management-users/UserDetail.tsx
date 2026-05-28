import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useGetUserById } from "@/api/users/user.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import type { RoleName } from "@/types/auth";
import type { User } from "@/types/user";

import UserAccountStatusCard from "./components/UserAccountStatusCard";
import UserAuditCard from "./components/UserAuditCard";
import UserContactCard from "./components/UserContactCard";

import UserPrimaryAssociationCard from "./components/UserPrimaryAssociationCard";
import UserProfileCard from "./components/UserProfileCard";

const getRoleLabel = (roles: RoleName[] = []) => {
  if (roles.includes("ADMIN")) return "Admin";
  if (roles.includes("EMPLOYER")) return "Employer";
  return "Candidate";
};

const getGenderLabel = (gender?: User["gender"] | null) => {
  if (gender === "FEMALE") return "Female";
  if (gender === "MALE") return "Male";
  if (gender === "OTHER") return "Other";
  return "Not available";
};

const mapUserProfile = (user: User) => ({
  name: user.name ?? "Unknown user",
  title: getRoleLabel(user.roles ?? []),
  tag: user.isActive ? "Active" : "Locked",
  userId: `U-${user.id}`,
  email: user.email ?? "",
  gender: getGenderLabel(user.gender),
  age: user.age ? `${user.age} Years` : "Not available",
  avatarUrl: user.avatarUrl?.trim() || user.avatar?.trim() || undefined,
});

export default function UserDetail() {
  const { id } = useParams();
  const userId = Number(id);
  const isValidId = Number.isFinite(userId) && userId > 0;
  const userQuery = useGetUserById(isValidId ? userId : 0);
  const user = userQuery.data?.data ?? null;

  const profile = useMemo(() => (user ? mapUserProfile(user) : null), [user]);
  const contact = useMemo(
    () => ({
      address: user?.address?.trim() || "Not available",
      phone: "Not available",
    }),
    [user],
  );
  const audit = useMemo(
    () => ({
      createdAt: "Not available",
      updatedAt: "Not available",
      createdBy: "System Admin",
      updatedBy: "User (Self)",
    }),
    [],
  );
  const association = useMemo(
    () => ({
      name: user?.company?.name ?? "No primary association",
      subtitle: user?.company?.name ? "Parent Enterprise" : "",
      logoUrl: user?.company?.logo?.trim() || undefined,
    }),
    [user],
  );

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <AppBreadcrumb
          items={[
            { label: "Quan tri", to: "/admin/dashboard" },
            { label: "Quan ly nguoi dung", to: "/admin/users" },
            { label: "Chi tiet nguoi dung" },
          ]}
        />
        {!isValidId ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            Invalid user id.
          </div>
        ) : null}

        {userQuery.isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            Failed to load user details. Please try again.
          </div>
        ) : null}

        {userQuery.isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Loading user details...
          </div>
        ) : null}

        {user && profile ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <UserProfileCard profile={profile} />
              <UserContactCard contact={contact} />
              <UserAuditCard audit={audit} />
            </div>

            <div className="space-y-6">
              <UserAccountStatusCard isActive={!!user.isActive} />
              <UserPrimaryAssociationCard association={association} />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
