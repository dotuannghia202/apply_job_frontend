import { Eye, Lock, Mail, Unlock } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";

export type ManageUserRow = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "Quan tri vien" | "Nha tuyen dung" | "Ung vien";
  status: "Hoat dong" | "Tam khoa";
  isActive: boolean;
};

type ManageUserTableProps = {
  rows: ManageUserRow[];
  isLoading: boolean;
  isError: boolean;
  isUpdatingId?: number | null;
  total?: number;
  page?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onToggleStatus: (row: ManageUserRow) => void;
};

const statusStyles: Record<ManageUserRow["status"], string> = {
  "Hoat dong": "bg-emerald-50 text-emerald-700",
  "Tam khoa": "bg-rose-50 text-rose-700",
};

const roleStyles: Record<ManageUserRow["role"], string> = {
  "Quan tri vien": "bg-purple-50 text-purple-700",
  "Nha tuyen dung": "bg-sky-50 text-sky-700",
  "Ung vien": "bg-slate-100 text-slate-600",
};

export default function ManageUserTable({
  rows,
  isLoading,
  isError,
  isUpdatingId,
  total,
  page,
  pageSize,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  onToggleStatus,
}: ManageUserTableProps) {
  const resolvedTotal = total ?? rows.length;
  const resolvedPageSize = pageSize ?? rows.length;
  const resolvedPage = page ?? 1;
  const startIndex =
    resolvedTotal === 0 ? 0 : (resolvedPage - 1) * resolvedPageSize + 1;
  const endIndex = Math.min(resolvedTotal, resolvedPage * resolvedPageSize);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Danh sach nguoi dung
          </h2>
          <p className="text-xs text-slate-500">
            Cap nhat theo thoi gian thuc, uu tien tai khoan co hoat dong.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
            {resolvedTotal} nguoi dung
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
            {rows.filter((row) => row.isActive).length} dang hoat dong
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3">Nguoi dung</th>
              <th className="px-6 py-3">Vai tro</th>
              <th className="px-6 py-3">Trang thai</th>
              <th className="px-6 py-3 text-right">Hanh dong</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isError ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-rose-600"
                >
                  Khong the tai danh sach nguoi dung. Vui long thu lai.
                </td>
              </tr>
            ) : null}
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  Dang tai danh sach nguoi dung...
                </td>
              </tr>
            ) : null}
            {!isLoading && !isError && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  Khong co nguoi dung phu hop bo loc hien tai.
                </td>
              </tr>
            ) : null}
            {!isLoading && !isError
              ? rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                          <img
                            src={row.avatarUrl || avatarPlaceholder}
                            alt={row.name}
                            className="size-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = avatarPlaceholder;
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {row.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail className="size-3" />
                            {row.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[row.role]}`}
                      >
                        {row.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="border border-slate-200 text-slate-600 hover:bg-slate-100"
                          aria-label="Xem chi tiet"
                          asChild
                        >
                          <Link to={`/admin/users/detail/${row.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="border border-slate-200 text-slate-600 hover:bg-slate-100"
                          onClick={() => onToggleStatus(row)}
                          disabled={isUpdatingId === row.id}
                          aria-label={
                            row.isActive
                              ? "Khoa tai khoan"
                              : "Mo khoa tai khoan"
                          }
                        >
                          {row.isActive ? (
                            <Lock className="size-4" />
                          ) : (
                            <Unlock className="size-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Hien thi {startIndex}-{endIndex} tren {resolvedTotal} nguoi dung
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200"
            onClick={onPrevPage}
            disabled={!hasPrevPage || isLoading}
          >
            Truoc
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200"
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
          >
            Sau
          </Button>
        </div>
      </div>
    </section>
  );
}
