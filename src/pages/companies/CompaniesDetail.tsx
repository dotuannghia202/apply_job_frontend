import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlignLeft, Image, MapPin } from "lucide-react";

import CompanyHeader from "./components/CompanyHeader";

import {
  useApproveCompany,
  useGetCompanyById,
  useToggleSuspendCompany,
} from "@/api/companies/company.queries";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useAuthStore } from "@/store/auth.store";
import type { RoleName } from "@/types/auth";
import type { CompanyStatus } from "@/types/company";
import { Button } from "@/components/ui/button";

type StatusAction = "approve" | "reject" | "suspend" | "restore";

interface ConfirmState {
  action: StatusAction;
  companyId: number;
}

const resolveRole = (roles: RoleName[] = []): RoleName => {
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("EMPLOYER")) return "EMPLOYER";
  return "CANDIDATE";
};

export default function CompaniesDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const companyId = Number(id);
  const user = useAuthStore((state) => state.user);
  const role = resolveRole(user?.roles ?? []);
  const companyQuery = useGetCompanyById(companyId);
  const approveCompanyMutation = useApproveCompany();
  const toggleSuspendMutation = useToggleSuspendCompany();
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [notice, setNotice] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const company = companyQuery.data?.data ?? null;
  const resolvedCompany = useMemo(() => {
    return {
      name: company?.name ?? "",
      address: company?.address ?? "",
      about: company?.description ?? "",
      status: company?.status ?? "PENDING",
      logo: company?.logo ?? null,
    };
  }, [company]);
  const overviewParagraphs = useMemo(
    () =>
      resolvedCompany.about
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    [resolvedCompany.about],
  );

  const getConfirmContent = (action: StatusAction) => {
    switch (action) {
      case "approve":
        return {
          title: t("companyDetail.confirm.approve.title"),
          message: t("companyDetail.confirm.approve.message"),
          confirmLabel: t("companyDetail.confirm.approve.confirm"),
          confirmVariant: "primary" as const,
        };
      case "reject":
        return {
          title: t("companyDetail.confirm.reject.title"),
          message: t("companyDetail.confirm.reject.message"),
          confirmLabel: t("companyDetail.confirm.reject.confirm"),
          confirmVariant: "danger" as const,
        };
      case "suspend":
        return {
          title: t("companyDetail.confirm.suspend.title"),
          message: t("companyDetail.confirm.suspend.message"),
          confirmLabel: t("companyDetail.confirm.suspend.confirm"),
          confirmVariant: "danger" as const,
        };
      case "restore":
        return {
          title: t("companyDetail.confirm.restore.title"),
          message: t("companyDetail.confirm.restore.message"),
          confirmLabel: t("companyDetail.confirm.restore.confirm"),
          confirmVariant: "primary" as const,
        };
      default:
        return {
          title: t("companyDetail.confirm.fallback.title"),
          message: t("companyDetail.confirm.fallback.message"),
          confirmLabel: t("companyDetail.common.confirm"),
          confirmVariant: "primary" as const,
        };
    }
  };

  const setSuccessNotice = (message: string) => {
    setNotice({
      variant: "success",
      title: t("companyDetail.notifications.successTitle"),
      message,
    });
  };

  const setErrorNotice = (message: string) => {
    setNotice({
      variant: "error",
      title: t("companyDetail.notifications.errorTitle"),
      message,
    });
  };

  const handleStatusAction = (action: StatusAction) => {
    if (!company?.id || role !== "ADMIN") return;
    setConfirmState({ action, companyId: company.id });
  };

  const handleConfirmAction = () => {
    if (!confirmState) return;

    const { action, companyId: targetId } = confirmState;
    setConfirmState(null);

    if (action === "approve" || action === "reject") {
      approveCompanyMutation.mutate(
        { id: targetId, isApproved: action === "approve" },
        {
          onSuccess: () =>
            setSuccessNotice(
              action === "approve"
                ? t("companyDetail.notifications.approveSuccess")
                : t("companyDetail.notifications.rejectSuccess"),
            ),
          onError: () =>
            setErrorNotice(
              action === "approve"
                ? t("companyDetail.notifications.approveError")
                : t("companyDetail.notifications.rejectError"),
            ),
        },
      );
      return;
    }

    toggleSuspendMutation.mutate(
      { id: targetId, isSuspended: action === "suspend" },
      {
        onSuccess: () =>
          setSuccessNotice(
            action === "suspend"
              ? t("companyDetail.notifications.suspendSuccess")
              : t("companyDetail.notifications.restoreSuccess"),
          ),
        onError: () =>
          setErrorNotice(
            action === "suspend"
              ? t("companyDetail.notifications.suspendError")
              : t("companyDetail.notifications.restoreError"),
          ),
      },
    );
  };

  const renderStatusBanner = () => {
    if (role !== "EMPLOYER") return null;

    const bannerClasses: Partial<Record<CompanyStatus, string>> = {
      PENDING:
        "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
      REJECTED:
        "rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700",
      SUSPENDED:
        "rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700",
    };
    const className = bannerClasses[resolvedCompany.status];

    if (!className) return null;

    return (
      <div className={className}>
        {t(`companyDetail.statusBanners.${resolvedCompany.status}`)}
      </div>
    );
  };

  const renderAdminActions = () => {
    if (role !== "ADMIN") return null;

    if (resolvedCompany.status === "PENDING") {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
            onClick={() => handleStatusAction("approve")}
          >
            {t("companyDetail.adminStatus.actions.approve")}
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
            onClick={() => handleStatusAction("reject")}
          >
            {t("companyDetail.adminStatus.actions.reject")}
          </Button>
        </div>
      );
    }

    if (resolvedCompany.status === "APPROVED") {
      return (
        <Button
          type="button"
          size="sm"
          className="rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white hover:bg-amber-700"
          onClick={() => handleStatusAction("suspend")}
        >
          {t("companyDetail.adminStatus.actions.suspend")}
        </Button>
      );
    }

    if (resolvedCompany.status === "SUSPENDED") {
      return (
        <Button
          type="button"
          size="sm"
          className="rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
          onClick={() => handleStatusAction("restore")}
        >
          {t("companyDetail.adminStatus.actions.restore")}
        </Button>
      );
    }

    return null;
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="space-y-6">
          <CompanyHeader
            title={t("companyDetail.header.title")}
            subtitle={t("companyDetail.header.subtitle")}
            status={resolvedCompany.status}
            role={role}
            showStatusControl={false}
          />
          {companyQuery.isError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {t("companyDetail.state.loadError")}
            </div>
          ) : null}
          {companyQuery.isLoading ? (
            <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              {t("companyDetail.state.loading")}
            </div>
          ) : null}
          {role === "ADMIN" ? (
            <section className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {t("companyDetail.adminStatus.title")}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {t("companyDetail.adminStatus.current", {
                      status: t(
                        `companyDetail.status.${resolvedCompany.status}`,
                      ),
                    })}
                  </p>
                </div>
                {renderAdminActions()}
              </div>
            </section>
          ) : null}
          {renderStatusBanner()}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
              <aside className="min-h-[240px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex h-full min-h-[240px] w-full items-center justify-center bg-white text-primary">
                  {resolvedCompany.logo ? (
                    <img
                      src={resolvedCompany.logo}
                      alt={t("companyDetail.profile.logoAlt", {
                        company: resolvedCompany.name,
                      })}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Image className="size-8" />
                  )}
                </div>
              </aside>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="flex size-8 items-center justify-center rounded-lg text-primary">
                      <MapPin className="size-6" />
                    </span>
                    {t("companyDetail.profile.generalInformation")}
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500">
                        {t("companyDetail.profile.companyName")}
                      </p>
                      <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        {resolvedCompany.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500">
                        {t("companyDetail.profile.headquartersAddress")}
                      </p>
                      <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        {resolvedCompany.address}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="flex size-8 items-center justify-center rounded-lg text-primary">
                      <AlignLeft className="size-6" />
                    </span>
                    {t("companyDetail.profile.companyOverview")}
                  </div>

                  <div className="mt-4 space-y-3 rounded-lg bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    {overviewParagraphs.length > 0 ? (
                      overviewParagraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))
                    ) : (
                      <p>{t("companyDetail.profile.noOverview")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
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
            : t("companyDetail.common.confirm")
        }
        confirmVariant={
          confirmState
            ? getConfirmContent(confirmState.action).confirmVariant
            : "primary"
        }
        cancelLabel={t("companyDetail.common.cancel")}
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
        dismissLabel={t("companyDetail.common.close")}
      />
    </main>
  );
}
