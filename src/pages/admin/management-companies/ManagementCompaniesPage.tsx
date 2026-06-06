import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useApproveCompany,
  useGetCompanies,
  useToggleSuspendCompany,
} from "@/api/companies/company.queries";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useDebounce } from "@/hooks/useDebounce";

import CompanyFilters, {
  type CompanyStatusFilter,
} from "./components/CompanyFilters";
import CompanyTable, { type CompanyRow } from "./components/CompanyTable";
import KPIStats from "./components/KPIStats";
import PageHeader from "./components/PageHeader";
import PaginationBar from "./components/PaginationBar";

type StatusAction = "approve" | "reject" | "suspend" | "restore";

interface ConfirmState {
  action: StatusAction;
  company: CompanyRow;
}

const PAGE_SIZE = 6;

export default function ManagementCompaniesPage() {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<CompanyStatusFilter>("");
  const [page, setPage] = useState(1);
  const debouncedKeyword = useDebounce(keyword);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [notice, setNotice] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const companiesQuery = useGetCompanies({
    page,
    size: PAGE_SIZE,
    name: debouncedKeyword || undefined,
    status: status || undefined,
  });
  const approveCompanyMutation = useApproveCompany();
  const toggleSuspendMutation = useToggleSuspendCompany();

  const companies = companiesQuery.data?.data?.result ?? [];
  const meta = companiesQuery.data?.data?.meta;

  const rows = useMemo<CompanyRow[]>(() => {
    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      logo: company.logo || "",

      employerName: company.createdBy || company.employerName || "--",
      employerEmail: company.employerEmail || "--",
      status: company.status,
      jobs: 0,
      createdAt: company.createdAt,
    }));
  }, [companies]);

  const total = meta?.total ?? rows.length;
  const pageRows = rows;
  const currentPage = meta?.page ?? page;

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, status]);

  useEffect(() => {
    if (page > 1 && meta && page > meta.pages) {
      setPage(meta.pages || 1);
    }
  }, [page, meta]);

  const getConfirmContent = (action: StatusAction) => {
    switch (action) {
      case "approve":
        return {
          title: t("managementCompanies.confirm.approve.title"),
          message: t("managementCompanies.confirm.approve.message"),
          confirmLabel: t("managementCompanies.confirm.approve.confirm"),
          confirmVariant: "primary" as const,
        };
      case "reject":
        return {
          title: t("managementCompanies.confirm.reject.title"),
          message: t("managementCompanies.confirm.reject.message"),
          confirmLabel: t("managementCompanies.confirm.reject.confirm"),
          confirmVariant: "danger" as const,
        };
      case "suspend":
        return {
          title: t("managementCompanies.confirm.suspend.title"),
          message: t("managementCompanies.confirm.suspend.message"),
          confirmLabel: t("managementCompanies.confirm.suspend.confirm"),
          confirmVariant: "danger" as const,
        };
      case "restore":
        return {
          title: t("managementCompanies.confirm.restore.title"),
          message: t("managementCompanies.confirm.restore.message"),
          confirmLabel: t("managementCompanies.confirm.restore.confirm"),
          confirmVariant: "primary" as const,
        };
      default:
        return {
          title: t("managementCompanies.confirm.fallback.title"),
          message: t("managementCompanies.confirm.fallback.message"),
          confirmLabel: t("managementCompanies.common.confirm"),
          confirmVariant: "primary" as const,
        };
    }
  };

  const setSuccessNotice = (message: string) => {
    setNotice({
      variant: "success",
      title: t("managementCompanies.notifications.successTitle"),
      message,
    });
  };

  const setErrorNotice = (message: string) => {
    setNotice({
      variant: "error",
      title: t("managementCompanies.notifications.errorTitle"),
      message,
    });
  };

  const handleStatusAction = (action: StatusAction, company: CompanyRow) => {
    setConfirmState({ action, company });
  };

  const handleConfirmAction = () => {
    if (!confirmState) return;

    const { action, company } = confirmState;
    setConfirmState(null);

    if (action === "approve" || action === "reject") {
      approveCompanyMutation.mutate(
        { id: company.id, isApproved: action === "approve" },
        {
          onSuccess: () =>
            setSuccessNotice(
              action === "approve"
                ? t("managementCompanies.notifications.approveSuccess")
                : t("managementCompanies.notifications.rejectSuccess"),
            ),
          onError: () =>
            setErrorNotice(
              action === "approve"
                ? t("managementCompanies.notifications.approveError")
                : t("managementCompanies.notifications.rejectError"),
            ),
        },
      );
      return;
    }

    toggleSuspendMutation.mutate(
      { id: company.id, isSuspended: action === "suspend" },
      {
        onSuccess: () =>
          setSuccessNotice(
            action === "suspend"
              ? t("managementCompanies.notifications.suspendSuccess")
              : t("managementCompanies.notifications.restoreSuccess"),
          ),
        onError: () =>
          setErrorNotice(
            action === "suspend"
              ? t("managementCompanies.notifications.suspendError")
              : t("managementCompanies.notifications.restoreError"),
          ),
      },
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="space-y-6">
          <AppBreadcrumb
            items={[
              {
                label: t("managementCompanies.breadcrumb.admin"),
                to: "/admin/dashboard",
              },
              { label: t("managementCompanies.breadcrumb.companies") },
            ]}
          />
          <PageHeader />
          <KPIStats />
          <CompanyFilters
            keyword={keyword}
            status={status}
            onKeywordChange={setKeyword}
            onStatusChange={setStatus}
          />
          {companiesQuery.isError ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-rose-600 shadow-sm">
              {t("managementCompanies.page.errorLoadingList")}
            </div>
          ) : null}
          {companiesQuery.isLoading ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
              {t("managementCompanies.page.loadingList")}
            </div>
          ) : null}
          {!companiesQuery.isLoading && !companiesQuery.isError ? (
            <CompanyTable
              rows={pageRows}
              onApprove={(company) => handleStatusAction("approve", company)}
              onReject={(company) => handleStatusAction("reject", company)}
              onSuspend={(company) => handleStatusAction("suspend", company)}
              onRestore={(company) => handleStatusAction("restore", company)}
            />
          ) : null}
          <PaginationBar
            page={currentPage}
            pageSize={meta?.pageSize ?? PAGE_SIZE}
            total={total}
            onPrev={() => {
              setPage((prev) => Math.max(1, prev - 1));
            }}
            onNext={() => {
              setPage((prev) => Math.min(meta?.pages ?? 1, prev + 1));
            }}
          />
        </div>
      </div>
      <NotificationPopup
        open={!!confirmState}
        variant="confirm"
        title={confirmState ? getConfirmContent(confirmState.action).title : ""}
        message={
          confirmState ? getConfirmContent(confirmState.action).message : ""
        }
        confirmLabel={
          confirmState
            ? getConfirmContent(confirmState.action).confirmLabel
            : t("managementCompanies.common.confirm")
        }
        cancelLabel={t("managementCompanies.common.cancel")}
        confirmVariant={
          confirmState
            ? getConfirmContent(confirmState.action).confirmVariant
            : "primary"
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmState(null)}
        onDismiss={() => setConfirmState(null)}
      />
      <NotificationPopup
        open={!!notice}
        variant={notice?.variant ?? "success"}
        title={notice?.title ?? ""}
        message={notice?.message ?? ""}
        onDismiss={() => setNotice(null)}
        dismissLabel={t("managementCompanies.common.close")}
      />
    </main>
  );
}
