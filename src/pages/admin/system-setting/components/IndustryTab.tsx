import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationPopup } from "@/components/NotificationPopup";
import {
  useGetIndustries,
  useCreateIndustry,
  useUpdateIndustry,
  useDeleteIndustry,
} from "@/api/industries/industry.queries";
import { useDebounce } from "@/hooks/useDebounce";
import type { Industry } from "@/types/industry";

import IndustryFormModal from "./IndustryFormModal";

const PAGE_SIZE = 8;

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

export default function IndustryTab() {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Industry | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Industry | null>(null);

  // Notification state
  const [notice, setNotice] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const industriesQuery = useGetIndustries({
    page,
    size: PAGE_SIZE,
    name: debouncedKeyword || undefined,
  });

  const createMutation = useCreateIndustry();
  const updateMutation = useUpdateIndustry();
  const deleteMutation = useDeleteIndustry();

  const industries = industriesQuery.data?.data?.result ?? [];
  const meta = industriesQuery.data?.data?.meta;
  const totalPages = Math.max(1, meta?.pages ?? 1);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Industry) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (name: string) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: { name } },
        {
          onSuccess: () => {
            setNotice({
              variant: "success",
              title: t("systemSetting.notifications.successTitle"),
              message: t("systemSetting.industry.notifications.updateSuccess"),
            });
            handleCloseModal();
          },
          onError: () => {
            setNotice({
              variant: "error",
              title: t("systemSetting.notifications.errorTitle"),
              message: t("systemSetting.industry.notifications.updateError"),
            });
          },
        },
      );
    } else {
      createMutation.mutate(
        { name },
        {
          onSuccess: () => {
            setNotice({
              variant: "success",
              title: t("systemSetting.notifications.successTitle"),
              message: t("systemSetting.industry.notifications.createSuccess"),
            });
            handleCloseModal();
          },
          onError: () => {
            setNotice({
              variant: "error",
              title: t("systemSetting.notifications.errorTitle"),
              message: t("systemSetting.industry.notifications.createError"),
            });
          },
        },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setNotice({
          variant: "success",
          title: t("systemSetting.notifications.successTitle"),
          message: t("systemSetting.industry.notifications.deleteSuccess"),
        });
        setDeleteTarget(null);
      },
      onError: () => {
        setNotice({
          variant: "error",
          title: t("systemSetting.notifications.errorTitle"),
          message: t("systemSetting.industry.notifications.deleteError"),
        });
        setDeleteTarget(null);
      },
    });
  };

  const pageNumbers = [page, page + 1, page + 2].filter(
    (v) => v <= totalPages,
  );

  return (
    <div className="space-y-5">
      {/* Search + Add */}
      <section className="flex flex-col gap-4 rounded bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded border bg-white px-4">
          <Search className="size-4 text-slate-400" />
          <Input
            className="border-0 bg-transparent text-sm text-slate-700 shadow-none focus-visible:ring-0"
            placeholder={t("systemSetting.industry.searchPlaceholder")}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="size-4" />
          {t("systemSetting.industry.addButton")}
        </Button>
      </section>

      {/* Table */}
      {industriesQuery.isLoading ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
          {t("systemSetting.common.loading")}
        </div>
      ) : industriesQuery.isError ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-rose-600 shadow-sm">
          {t("systemSetting.common.errorLoading")}
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-primary">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary text-[12px] font-semibold uppercase text-white">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">
                  {t("systemSetting.industry.table.name")}
                </th>
                <th className="px-6 py-4">
                  {t("systemSetting.industry.table.createdAt")}
                </th>
                <th className="px-6 py-4">
                  {t("systemSetting.industry.table.updatedAt")}
                </th>
                <th className="px-6 py-4 text-right">
                  {t("systemSetting.industry.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {industries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    {t("systemSetting.common.noData")}
                  </td>
                </tr>
              ) : (
                industries.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-primary/10"}
                  >
                    <td className="px-6 py-4 text-slate-500">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                          title={t("systemSetting.common.edit")}
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                          title={t("systemSetting.common.delete")}
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <div className="flex flex-col gap-3 rounded bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {t("systemSetting.pagination.summary", {
              start:
                meta.total === 0
                  ? 0
                  : new Intl.NumberFormat(locale).format(
                      (page - 1) * PAGE_SIZE + 1,
                    ),
              end: new Intl.NumberFormat(locale).format(
                Math.min(meta.total, page * PAGE_SIZE),
              ),
              total: new Intl.NumberFormat(locale).format(meta.total),
            })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 rounded-lg border-slate-200 bg-slate-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {pageNumbers.map((v) => (
              <span
                key={v}
                className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                  v === page
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {v}
              </span>
            ))}
            {totalPages > page + 2 && (
              <span className="px-1 text-slate-400">...</span>
            )}
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 rounded-lg border-slate-200 bg-slate-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <IndustryFormModal
        open={modalOpen}
        initialData={editingItem}
        isPending={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />

      {/* Delete Confirm */}
      <NotificationPopup
        open={!!deleteTarget}
        variant="confirm"
        title={t("systemSetting.industry.confirm.deleteTitle")}
        message={t("systemSetting.industry.confirm.deleteMessage", {
          name: deleteTarget?.name,
        })}
        confirmLabel={t("systemSetting.common.delete")}
        confirmVariant="danger"
        cancelLabel={t("systemSetting.common.cancel")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        onDismiss={() => setDeleteTarget(null)}
      />

      {/* Success/Error Notification */}
      <NotificationPopup
        open={!!notice}
        variant={notice?.variant ?? "success"}
        title={notice?.title ?? ""}
        message={notice?.message ?? ""}
        onDismiss={() => setNotice(null)}
        dismissLabel={t("systemSetting.common.close")}
      />
    </div>
  );
}
