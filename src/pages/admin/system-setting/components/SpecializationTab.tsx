import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationPopup } from "@/components/NotificationPopup";
import {
  useGetSpecializations,
  useCreateSpecialization,
  useUpdateSpecialization,
  useDeleteSpecialization,
} from "@/api/specializations/specialization.queries";
import { useGetIndustries } from "@/api/industries/industry.queries";
import { useDebounce } from "@/hooks/useDebounce";
import type { Industry, Specialization } from "@/types/industry";

import SpecializationFormModal from "./SpecializationFormModal";

const PAGE_SIZE = 8;

const getLocale = (language: string) =>
  language.startsWith("vi") ? "vi-VN" : "en-US";

export default function SpecializationTab() {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [filterIndustryId, setFilterIndustryId] = useState<number | "">("");
  const debouncedKeyword = useDebounce(keyword);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Specialization | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Specialization | null>(null);

  // Notification state
  const [notice, setNotice] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Fetch all industries for dropdown (no pagination, fetch large batch)
  const industriesQuery = useGetIndustries({ page: 1, size: 100 });
  const allIndustries: Industry[] =
    industriesQuery.data?.data?.result ?? [];

  const specializationsQuery = useGetSpecializations({
    page,
    size: PAGE_SIZE,
    name: debouncedKeyword || undefined,
  });

  const createMutation = useCreateSpecialization();
  const updateMutation = useUpdateSpecialization();
  const deleteMutation = useDeleteSpecialization();

  const specializations = specializationsQuery.data?.data?.result ?? [];
  const meta = specializationsQuery.data?.data?.meta;
  const totalPages = Math.max(1, meta?.pages ?? 1);

  // Filter by industry on client side (API may not support industryId filter in list)
  const filteredSpecializations = filterIndustryId
    ? specializations.filter((s) => s.industry?.id === filterIndustryId)
    : specializations;

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, filterIndustryId]);

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

  const handleOpenEdit = (item: Specialization) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (name: string, industryId: number) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: { name } },
        {
          onSuccess: () => {
            setNotice({
              variant: "success",
              title: t("systemSetting.notifications.successTitle"),
              message: t(
                "systemSetting.specialization.notifications.updateSuccess",
              ),
            });
            handleCloseModal();
          },
          onError: () => {
            setNotice({
              variant: "error",
              title: t("systemSetting.notifications.errorTitle"),
              message: t(
                "systemSetting.specialization.notifications.updateError",
              ),
            });
          },
        },
      );
    } else {
      createMutation.mutate(
        { name, industryId },
        {
          onSuccess: () => {
            setNotice({
              variant: "success",
              title: t("systemSetting.notifications.successTitle"),
              message: t(
                "systemSetting.specialization.notifications.createSuccess",
              ),
            });
            handleCloseModal();
          },
          onError: () => {
            setNotice({
              variant: "error",
              title: t("systemSetting.notifications.errorTitle"),
              message: t(
                "systemSetting.specialization.notifications.createError",
              ),
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
          message: t(
            "systemSetting.specialization.notifications.deleteSuccess",
          ),
        });
        setDeleteTarget(null);
      },
      onError: () => {
        setNotice({
          variant: "error",
          title: t("systemSetting.notifications.errorTitle"),
          message: t(
            "systemSetting.specialization.notifications.deleteError",
          ),
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
      {/* Search + Filter + Add */}
      <section className="flex flex-col gap-4 rounded bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3 rounded border bg-white px-4">
          <Search className="size-4 text-slate-400" />
          <Input
            className="border-0 bg-transparent text-sm text-slate-700 shadow-none focus-visible:ring-0"
            placeholder={t(
              "systemSetting.specialization.searchPlaceholder",
            )}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none"
          value={filterIndustryId}
          onChange={(e) =>
            setFilterIndustryId(
              e.target.value ? Number(e.target.value) : "",
            )
          }
        >
          <option value="">
            {t("systemSetting.specialization.allIndustries")}
          </option>
          {allIndustries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name}
            </option>
          ))}
        </select>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="size-4" />
          {t("systemSetting.specialization.addButton")}
        </Button>
      </section>

      {/* Table */}
      {specializationsQuery.isLoading ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
          {t("systemSetting.common.loading")}
        </div>
      ) : specializationsQuery.isError ? (
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
                  {t("systemSetting.specialization.table.name")}
                </th>
                <th className="px-6 py-4">
                  {t("systemSetting.specialization.table.industry")}
                </th>
                <th className="px-6 py-4">
                  {t("systemSetting.specialization.table.createdAt")}
                </th>
                <th className="px-6 py-4">
                  {t("systemSetting.specialization.table.updatedAt")}
                </th>
                <th className="px-6 py-4 text-right">
                  {t("systemSetting.specialization.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSpecializations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    {t("systemSetting.common.noData")}
                  </td>
                </tr>
              ) : (
                filteredSpecializations.map((item, index) => (
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
                    <td className="px-6 py-4">
                      {item.industry ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {item.industry.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
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
      <SpecializationFormModal
        open={modalOpen}
        initialData={editingItem}
        isPending={createMutation.isPending || updateMutation.isPending}
        industries={allIndustries}
        selectedIndustryId={editingItem?.industry?.id ?? null}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />

      {/* Delete Confirm */}
      <NotificationPopup
        open={!!deleteTarget}
        variant="confirm"
        title={t("systemSetting.specialization.confirm.deleteTitle")}
        message={t("systemSetting.specialization.confirm.deleteMessage", {
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
