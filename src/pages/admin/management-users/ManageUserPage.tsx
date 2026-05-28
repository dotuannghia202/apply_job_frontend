import { useEffect, useMemo, useState } from "react";

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

const getRoleLabel = (roles: RoleName[] = []) => {
  if (roles.includes("ADMIN")) return "Quan tri vien";
  if (roles.includes("EMPLOYER")) return "Nha tuyen dung";
  return "Ung vien";
};

const mapUserToRow = (user: User): ManageUserRow => {
  const isActive = Boolean(user.isActive ?? false);

  return {
    id: user.id,
    name: user.name ?? "Khong ro",
    email: user.email ?? "",
    avatarUrl: user.avatarUrl?.trim() || user.avatar?.trim() || undefined,
    role: getRoleLabel(user.roles ?? []),
    status: isActive ? "Hoat dong" : "Tam khoa",
    isActive,
  };
};

export default function ManageUserPage() {
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
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <AppBreadcrumb
          items={[
            { label: "Quan tri", to: "/admin/dashboard" },
            { label: "Quan ly nguoi dung" },
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
            ? "Xac nhan khoa tai khoan"
            : "Xac nhan mo khoa tai khoan"
        }
        message={
          confirmUser
            ? `Ban co chac chan muon ${
                confirmUser.isActive ? "khoa" : "mo khoa"
              } nguoi dung nay khong?`
            : undefined
        }
        confirmLabel={
          confirmUser?.isActive ? "Khoa tai khoan" : "Mo khoa tai khoan"
        }
        confirmVariant={confirmUser?.isActive ? "danger" : "primary"}
        cancelLabel="Huy"
        onConfirm={handleConfirmStatus}
        onCancel={handleCloseConfirm}
        onDismiss={handleCloseConfirm}
      />
    </main>
  );
}
