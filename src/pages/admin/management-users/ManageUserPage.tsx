import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AppBreadcrumb from "@/components/AppBreadcrumb";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useGetUsers, useUpdateUserStatus } from "@/api/users/user.queries";
import type { RoleName } from "@/types/auth";
import type { User } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";

import ManageUserFilters from "./components/ManageUserFilters";
import ManageUserHeader from "./components/ManageUserHeader";
import ManageUserTable, {
  type ManageUserRow,
} from "./components/ManageUserTable";

const PAGE_SIZE = 10;

const getPrimaryRole = (roles: RoleName[] = []): RoleName => {
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("EMPLOYER")) return "EMPLOYER";
  return "CANDIDATE";
};

const mapUserToRow = (user: User): ManageUserRow => {
  const isActive = Boolean(user.isActive ?? false);

  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    avatarUrl: user.avatarUrl?.trim() || user.avatar?.trim() || undefined,
    role: getPrimaryRole(user.roles ?? []),
    status: isActive ? "active" : "inactive",
    isActive,
  };
};

export default function ManageUserPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<"" | RoleName>("");
  const [status, setStatus] = useState<"" | "active" | "inactive">("");
  const [confirmUser, setConfirmUser] = useState<ManageUserRow | null>(null);
  const debouncedKeyword = useDebounce(keyword);
  const isActiveFilter =
    status === "" ? undefined : status === "active" ? true : false;

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, role, status]);

  const usersQuery = useGetUsers({
    page,
    size: PAGE_SIZE,
    keyword: debouncedKeyword || undefined,
    role: role || undefined,
    isActive: isActiveFilter,
  });
  const updateStatusMutation = useUpdateUserStatus();
  const users = usersQuery.data?.data?.result ?? [];
  const meta = usersQuery.data?.data?.meta;
  const rows = useMemo(() => users.map(mapUserToRow), [users]);

  const isUpdatingId = updateStatusMutation.isPending
    ? (updateStatusMutation.variables?.id ?? null)
    : null;

  const handleToggleStatus = (row: ManageUserRow) => {
    setConfirmUser(row);
  };

  const handleConfirmStatus = async () => {
    if (!confirmUser) return;

    const nextStatus = !confirmUser.isActive;
    await updateStatusMutation.mutateAsync({
      id: confirmUser.id,
      data: {
        isActive: nextStatus,
      },
    });
    setConfirmUser(null);
  };

  const handleCloseConfirm = () => {
    if (updateStatusMutation.isPending) return;
    setConfirmUser(null);
  };

  const hasPrevPage = meta ? meta.page > 1 : page > 1;
  const hasNextPage = meta ? meta.page < meta.pages : false;

  const handleResetFilters = () => {
    setKeyword("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-main-background">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <AppBreadcrumb
          items={[
            {
              label: t("managementUsers.breadcrumb.admin"),
              to: "/admin/dashboard",
            },
            { label: t("managementUsers.breadcrumb.users") },
          ]}
        />
        <ManageUserHeader />

        <ManageUserFilters
          keyword={keyword}
          role={role}
          status={status}
          onKeywordChange={setKeyword}
          onRoleChange={setRole}
          onStatusChange={setStatus}
          onReset={handleResetFilters}
        />
        <ManageUserTable
          rows={rows}
          isLoading={usersQuery.isLoading}
          isError={usersQuery.isError}
          isUpdatingId={isUpdatingId}
          total={meta?.total}
          page={meta?.page ?? page}
          pageSize={meta?.pageSize ?? PAGE_SIZE}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
          onNextPage={() => setPage((prev) => prev + 1)}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <NotificationPopup
        open={!!confirmUser}
        variant="confirm"
        title={
          confirmUser?.isActive
            ? t("managementUsers.confirm.lock.title")
            : t("managementUsers.confirm.unlock.title")
        }
        message={
          confirmUser
            ? confirmUser.isActive
              ? t("managementUsers.confirm.lock.message")
              : t("managementUsers.confirm.unlock.message")
            : undefined
        }
        confirmLabel={
          confirmUser?.isActive
            ? t("managementUsers.confirm.lock.confirm")
            : t("managementUsers.confirm.unlock.confirm")
        }
        confirmVariant={confirmUser?.isActive ? "danger" : "primary"}
        cancelLabel={t("managementUsers.common.cancel")}
        onConfirm={handleConfirmStatus}
        onCancel={handleCloseConfirm}
        onDismiss={handleCloseConfirm}
      />
    </main>
  );
}
