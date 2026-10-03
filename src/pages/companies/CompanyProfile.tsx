import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import CompanyFooterActions from "./components/CompanyFooterActions";
import CompanyGeneralInfo from "./components/CompanyGeneralInfo";
import CompanyHeader from "./components/CompanyHeader";
import CompanyLogoCard from "./components/CompanyLogoCard";
import CompanyOverview from "./components/CompanyOverview";
import CompanyStatusBanners from "./components/CompanyStatusBanners";

import {
  useGetMyCompany,
  useUpdateCompany,
} from "@/api/companies/company.queries";
import { uploadCompanyLogo } from "@/api/files/file.api";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useAuthStore } from "@/store/auth.store";
import type { RoleName } from "@/types/auth";
import type { CompanyStatus } from "@/types/company";

const fallbackCompany = {
  name: "Botanical Talent Recruitment",
  address: "123 Greenhouse Lane, Portland, OR 97201",
  industry: "Sustainable Talent Ecosystem",
  about:
    "At Botanical Talent, we believe that the best professional relationships bloom in environments that prioritize growth, transparency, and natural talent development. Founded in 2024, our mission is to cultivate a recruitment ecosystem where candidates are not just resumes, but flourishing individuals seeking their next fertile ground.\n\nWe specialize in placing high-impact individuals in roles that resonate with their personal and professional core values.",
  status: "PENDING" as CompanyStatus,
  logo: null as string | null,
};

const resolveRole = (roles: RoleName[] = []): RoleName => {
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("EMPLOYER")) return "EMPLOYER";
  return "CANDIDATE";
};

export default function CompanyProfile() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const setCompany = useAuthStore((state) => state.setCompany);
  const role = resolveRole(user?.roles ?? []);
  const companyQuery = useGetMyCompany(role === "EMPLOYER");
  const updateCompanyMutation = useUpdateCompany();
  const company = companyQuery.data?.data ?? null;
  const resolvedCompany = useMemo(() => {
    return {
      name: company?.name ?? fallbackCompany.name,
      address: company?.address ?? fallbackCompany.address,
      industry: company?.description ?? fallbackCompany.industry,
      about: company?.description ?? fallbackCompany.about,
      status: company?.status ?? fallbackCompany.status,
      logo: company?.logo ?? fallbackCompany.logo,
    };
  }, [company]);
  const [status, setStatus] = useState<CompanyStatus>(resolvedCompany.status);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [name, setName] = useState(resolvedCompany.name);
  const [address, setAddress] = useState(resolvedCompany.address);
  const [about, setAbout] = useState(resolvedCompany.about);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const isSaving = isSubmitting || updateCompanyMutation.isPending;

  useEffect(() => {
    if (company && (!user?.company || user.company.id !== company.id)) {
      setCompany({ id: company.id, name: company.name });
    }
  }, [company, user?.company, setCompany]);

  useEffect(() => {
    setStatus(resolvedCompany.status);
    setName(resolvedCompany.name);
    setAddress(resolvedCompany.address);
    setAbout(resolvedCompany.about);
    setLogoPreview(null);
    setLogoFile(null);
  }, [
    resolvedCompany.status,
    resolvedCompany.name,
    resolvedCompany.address,
    resolvedCompany.about,
  ]);

  useEffect(() => {
    if (!logoFile) return undefined;

    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [logoFile]);

  const handleSelectLogo = (file: File) => {
    setLogoFile(file);
    setSaveError(null);
  };

  const handleCancelChanges = () => {
    setName(resolvedCompany.name);
    setAddress(resolvedCompany.address);
    setAbout(resolvedCompany.about);
    setLogoFile(null);
    setLogoPreview(null);
    setSaveError(null);
  };

  const handleSaveChanges = async () => {
    if (!company?.id) {
      setNotice({
        open: true,
        variant: "error",
        title: t("companyProfile.notifications.errorTitle", "Cập nhật thất bại"),
        message: t(
          "companyProfile.notifications.notFoundMessage",
          "Không tìm thấy thông tin công ty để cập nhật.",
        ),
      });
      return;
    }

    if (role !== "EMPLOYER") {
      setNotice({
        open: true,
        variant: "error",
        title: t("companyProfile.notifications.errorTitle", "Cập nhật thất bại"),
        message: t(
          "companyProfile.notifications.noPermissionMessage",
          "Bạn không có quyền cập nhật thông tin công ty.",
        ),
      });
      return;
    }

    if (!name.trim()) {
      setNotice({
        open: true,
        variant: "error",
        title: t("companyProfile.notifications.errorTitle", "Cập nhật thất bại"),
        message: t(
          "companyProfile.validation.nameRequired",
          "Vui lòng nhập tên công ty.",
        ),
      });
      return;
    }

    if (!address.trim()) {
      setNotice({
        open: true,
        variant: "error",
        title: t("companyProfile.notifications.errorTitle", "Cập nhật thất bại"),
        message: t(
          "companyProfile.validation.addressRequired",
          "Vui lòng nhập địa chỉ trụ sở.",
        ),
      });
      return;
    }

    setSaveError(null);
    setIsSubmitting(true);

    try {
      let nextLogo = resolvedCompany.logo;

      if (logoFile) {
        const uploadResponse = await uploadCompanyLogo(logoFile);
        const uploadedLogo =
          uploadResponse.data?.filePath ?? uploadResponse.data?.fileName;
        if (uploadedLogo) {
          nextLogo = uploadedLogo;
        }
      }

      const updateResponse = await updateCompanyMutation.mutateAsync({
        id: company.id,
        data: {
          name: name.trim(),
          address: address.trim(),
          description: about.trim(),
          logo: nextLogo ?? undefined,
        },
      });

      if (updateResponse?.data) {
        setCompany({
          id: updateResponse.data.id,
          name: updateResponse.data.name,
        });
      }

      setLogoFile(null);
      setLogoPreview(null);

      setNotice({
        open: true,
        variant: "success",
        title: t(
          "companyProfile.notifications.successTitle",
          "Cập nhật thành công",
        ),
        message: t(
          "companyProfile.notifications.successMessage",
          "Thông tin công ty đã được cập nhật thành công.",
        ),
      });
    } catch (error) {
      let errorMessage = t(
        "companyProfile.notifications.errorMessage",
        "Không thể cập nhật thông tin công ty. Vui lòng thử lại.",
      );

      if (isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        if (Array.isArray(backendMessage)) {
          errorMessage = backendMessage.join(", ");
        } else if (typeof backendMessage === "string" && backendMessage.trim()) {
          errorMessage = backendMessage;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setSaveError(errorMessage);
      setNotice({
        open: true,
        variant: "error",
        title: t("companyProfile.notifications.errorTitle", "Cập nhật thất bại"),
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-main-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="space-y-6">
          <CompanyHeader
            title={t("companyProfile.header.title", "Company Profile")}
            subtitle={t(
              "companyProfile.header.subtitle",
              "Manage your company's public information and branding.",
            )}
            status={status}
            role={role}
            onStatusChange={setStatus}
          />
          {companyQuery.isError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {t(
                "companyProfile.state.loadError",
                "Không thể tải thông tin công ty. Vui lòng thử lại.",
              )}
            </div>
          ) : null}
          {companyQuery.isLoading ? (
            <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              {t(
                "companyProfile.state.loading",
                "Đang tải thông tin công ty...",
              )}
            </div>
          ) : null}
          <CompanyStatusBanners status={status} role={role} />
          <CompanyLogoCard
            role={role}
            companyId={company?.id ?? null}
            logoUrl={logoPreview ?? resolvedCompany.logo}
            onSelectFile={handleSelectLogo}
            isUploading={isSaving}
          />
          <CompanyGeneralInfo
            role={role}
            name={name}
            address={address}
            onNameChange={(val) => {
              setName(val);
              setSaveError(null);
            }}
            onAddressChange={(val) => {
              setAddress(val);
              setSaveError(null);
            }}
          />
          <CompanyOverview
            role={role}
            about={about}
            onAboutChange={(val) => {
              setAbout(val);
              setSaveError(null);
            }}
          />
          {saveError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveError}
            </div>
          ) : null}
          <CompanyFooterActions
            role={role}
            onSave={handleSaveChanges}
            onCancel={handleCancelChanges}
            isSaving={isSaving}
          />
        </div>
      </div>

      <NotificationPopup
        open={notice.open}
        variant={notice.variant}
        title={notice.title}
        message={notice.message}
        dismissLabel={t("common.close", "Đóng")}
        onDismiss={() => setNotice((prev) => ({ ...prev, open: false }))}
        closeOnBackdrop
      />
    </main>
  );
}
