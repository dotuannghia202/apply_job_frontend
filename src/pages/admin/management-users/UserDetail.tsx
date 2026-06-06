import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useGetUserById, useUpdateUserStatus } from "@/api/users/user.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { NotificationPopup } from "@/components/NotificationPopup";
import type { RoleName } from "@/types/auth";
import type { User } from "@/types/user";

import UserAccountStatusCard from "./components/UserAccountStatusCard";
import UserAuditCard from "./components/UserAuditCard";
import UserContactCard from "./components/UserContactCard";

import UserPrimaryAssociationCard from "./components/UserPrimaryAssociationCard";
import UserProfileCard from "./components/UserProfileCard";

const getPrimaryRole = (roles: RoleName[] = []): RoleName => {
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("EMPLOYER")) return "EMPLOYER";
  return "CANDIDATE";
};

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

const getGenderLabelKey = (gender?: User["gender"] | null) => {
  if (gender === "FEMALE") return "female";
  if (gender === "MALE") return "male";
  if (gender === "OTHER") return "other";
  return "notAvailable";
};

type NoticeState = {
  variant: "success" | "error";
  title: string;
  message: string;
};

export default function UserDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const locale = getLocale(i18n.language);
  const userId = Number(id);
  const isValidId = Number.isFinite(userId) && userId > 0;
  const userQuery = useGetUserById(isValidId ? userId : 0);
  const updateStatusMutation = useUpdateUserStatus();
  const user = userQuery.data?.data ?? null;
  const isStatusUpdating = updateStatusMutation.isPending;
  const isLockAction = pendingStatus === false;

  const profile = useMemo(() => {
    if (!user) return null;

    const roleKey = getPrimaryRole(user.roles ?? []).toLowerCase();
    const genderKey = getGenderLabelKey(user.gender);

    return {
      name: user.name ?? t("managementUsers.detail.fallbacks.unknownUser"),
      title: t(`managementUsers.roles.${roleKey}`),
      isActive: Boolean(user.isActive),
      userId: `U-${user.id}`,
      email: user.email ?? "",
      gender: t(`managementUsers.detail.profile.gender.${genderKey}`),
      age: user.age
        ? t("managementUsers.detail.profile.ageYears", {
            value: new Intl.NumberFormat(locale).format(user.age),
          })
        : t("managementUsers.detail.fallbacks.notAvailable"),
      avatarUrl: user.avatarUrl?.trim() || user.avatar?.trim() || undefined,
    };
  }, [locale, t, user]);
  const contact = useMemo(
    () => ({
      address:
        user?.address?.trim() ||
        t("managementUsers.detail.fallbacks.notAvailable"),
      phone: t("managementUsers.detail.fallbacks.notAvailable"),
    }),
    [t, user],
  );
  const audit = useMemo(
    () => ({
      createdAt: t("managementUsers.detail.fallbacks.notAvailable"),
      updatedAt: t("managementUsers.detail.fallbacks.notAvailable"),
      createdBy: t("managementUsers.detail.fallbacks.systemAdmin"),
      updatedBy: t("managementUsers.detail.fallbacks.userSelf"),
    }),
    [t],
  );
  const association = useMemo(
    () => ({
      name:
        user?.company?.name ??
        t("managementUsers.detail.fallbacks.noPrimaryAssociation"),
      subtitle: user?.company?.name
        ? t("managementUsers.detail.fallbacks.parentEnterprise")
        : "",
      logoUrl: user?.company?.logo?.trim() || undefined,
    }),
    [t, user],
  );

  const handleRequestStatusChange = (nextStatus: boolean) => {
    if (!user || isStatusUpdating) return;

    if (nextStatus === Boolean(user.isActive)) return;

    setPendingStatus(nextStatus);
  };

  const handleCloseConfirm = () => {
    if (isStatusUpdating) return;

    setPendingStatus(null);
  };

  const handleConfirmStatus = async () => {
    if (!user || pendingStatus === null || isStatusUpdating) return;

    const nextStatus = pendingStatus;

    try {
      await updateStatusMutation.mutateAsync({
        id: user.id,
        data: {
          isActive: nextStatus,
        },
      });

      setPendingStatus(null);
      setNotice({
        variant: "success",
        title: t("managementUsers.notifications.successTitle"),
        message: nextStatus
          ? t("managementUsers.notifications.unlockSuccess")
          : t("managementUsers.notifications.lockSuccess"),
      });
    } catch {
      setPendingStatus(null);
      setNotice({
        variant: "error",
        title: t("managementUsers.notifications.errorTitle"),
        message: nextStatus
          ? t("managementUsers.notifications.unlockError")
          : t("managementUsers.notifications.lockError"),
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <AppBreadcrumb
          items={[
            {
              label: t("managementUsers.breadcrumb.admin"),
              to: "/admin/dashboard",
            },
            {
              label: t("managementUsers.breadcrumb.users"),
              to: "/admin/users",
            },
            { label: t("managementUsers.detail.breadcrumb") },
          ]}
        />
        {!isValidId ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            {t("managementUsers.detail.invalidId")}
          </div>
        ) : null}

        {userQuery.isError ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            {t("managementUsers.detail.error")}
          </div>
        ) : null}

        {userQuery.isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
            {t("managementUsers.detail.loading")}
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
              <UserAccountStatusCard
                isActive={!!user.isActive}
                isUpdating={isStatusUpdating}
                onStatusChange={handleRequestStatusChange}
              />
              <UserPrimaryAssociationCard association={association} />
            </div>
          </div>
        ) : null}
      </div>

      <NotificationPopup
        open={pendingStatus !== null}
        variant="confirm"
        title={
          isLockAction
            ? t("managementUsers.confirm.lock.title")
            : t("managementUsers.confirm.unlock.title")
        }
        message={
          isLockAction
            ? t("managementUsers.confirm.lock.message")
            : t("managementUsers.confirm.unlock.message")
        }
        actions={[
          {
            label: t("managementUsers.common.cancel"),
            onClick: handleCloseConfirm,
            disabled: isStatusUpdating,
            style: "outline",
          },
          {
            label: isLockAction
              ? t("managementUsers.confirm.lock.confirm")
              : t("managementUsers.confirm.unlock.confirm"),
            onClick: handleConfirmStatus,
            disabled: isStatusUpdating,
            style: isLockAction ? "danger" : "primary",
          },
        ]}
        onDismiss={handleCloseConfirm}
      />

      <NotificationPopup
        open={!!notice}
        variant={notice?.variant ?? "success"}
        title={notice?.title ?? ""}
        message={notice?.message ?? ""}
        dismissLabel={t("managementUsers.common.close")}
        onDismiss={() => setNotice(null)}
      />
    </main>
  );
}
