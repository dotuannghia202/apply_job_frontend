import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import CompanyFooterActions from "./components/CompanyFooterActions";
import CompanyGeneralInfo from "./components/CompanyGeneralInfo";
import CompanyHeader from "./components/CompanyHeader";
import CompanyLogoCard from "./components/CompanyLogoCard";
import CompanyOverview from "./components/CompanyOverview";
import CompanyStatusBanners from "./components/CompanyStatusBanners";

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

const mockCompany = {
  name: "Botanical Talent Recruitment",
  address: "123 Greenhouse Lane, Portland, OR 97201",
  industry: "Sustainable Talent Ecosystem",
  about:
    "At Botanical Talent, we believe that the best professional relationships bloom in environments that prioritize growth, transparency, and natural talent development. Founded in 2024, our mission is to cultivate a recruitment ecosystem where candidates are not just resumes, but flourishing individuals seeking their next fertile ground.\n\nWe specialize in placing high-impact individuals in roles that resonate with their personal and professional core values.",
  status: "PENDING" as CompanyStatus,
  logo: null as string | null,
};

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
      name: company?.name ?? mockCompany.name,
      address: company?.address ?? mockCompany.address,
      industry: company?.description ?? mockCompany.industry,
      about: company?.description ?? mockCompany.about,
      status: company?.status ?? mockCompany.status,
      logo: company?.logo ?? mockCompany.logo,
    };
  }, [company]);

  const getConfirmContent = (action: StatusAction) => {
    switch (action) {
      case "approve":
        return {
          title: "Approve company?",
          message: "This will approve the company and allow it to operate.",
          confirmLabel: "Approve",
          confirmVariant: "primary" as const,
        };
      case "reject":
        return {
          title: "Reject company?",
          message: "This will mark the company as rejected.",
          confirmLabel: "Reject",
          confirmVariant: "danger" as const,
        };
      case "suspend":
        return {
          title: "Suspend company?",
          message: "This will suspend the company from operating.",
          confirmLabel: "Suspend",
          confirmVariant: "danger" as const,
        };
      case "restore":
        return {
          title: "Restore company?",
          message: "This will restore the company to active status.",
          confirmLabel: "Restore",
          confirmVariant: "primary" as const,
        };
      default:
        return {
          title: "Update status?",
          message: "This will update the company status.",
          confirmLabel: "Confirm",
          confirmVariant: "primary" as const,
        };
    }
  };

  const setSuccessNotice = (message: string) => {
    setNotice({ variant: "success", title: "Success", message });
  };

  const setErrorNotice = (message: string) => {
    setNotice({ variant: "error", title: "Failed", message });
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
                ? "Company approved successfully."
                : "Company rejected successfully.",
            ),
          onError: () =>
            setErrorNotice(
              action === "approve"
                ? "Failed to approve company. Please try again."
                : "Failed to reject company. Please try again.",
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
              ? "Company suspended successfully."
              : "Company restored successfully.",
          ),
        onError: () =>
          setErrorNotice(
            action === "suspend"
              ? "Failed to suspend company. Please try again."
              : "Failed to restore company. Please try again.",
          ),
      },
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
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
            onClick={() => handleStatusAction("reject")}
          >
            Reject
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
          Suspend
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
          Restore
        </Button>
      );
    }

    return null;
  };

  return (
    <main className="min-h-screen bg-[#f7f8f2]">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="space-y-6">
          <CompanyHeader
            title="Company Profile"
            subtitle="Manage your company's public information and branding."
            status={resolvedCompany.status}
            role={role}
            showStatusControl={false}
          />
          {companyQuery.isError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Khong the tai thong tin cong ty. Vui long thu lai.
            </div>
          ) : null}
          {companyQuery.isLoading ? (
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              Dang tai thong tin cong ty...
            </div>
          ) : null}
          {role === "ADMIN" ? (
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">
                  Company status actions
                </div>
                {renderAdminActions()}
              </div>
            </section>
          ) : null}
          <CompanyStatusBanners status={resolvedCompany.status} role={role} />
          <CompanyLogoCard
            role={role}
            companyId={company?.id ?? null}
            logoUrl={resolvedCompany.logo}
          />
          <CompanyGeneralInfo
            role={role}
            name={resolvedCompany.name}
            address={resolvedCompany.address}
          />
          <CompanyOverview role={role} about={resolvedCompany.about} />
          <CompanyFooterActions role={role} />
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
            : "Confirm"
        }
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
        dismissLabel="Close"
      />
    </main>
  );
}
