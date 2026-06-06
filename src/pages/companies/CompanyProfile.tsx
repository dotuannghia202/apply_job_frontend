import { useEffect, useMemo, useState } from "react";

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
  const user = useAuthStore((state) => state.user);
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
    if (!company?.id || role !== "EMPLOYER") return;
    setSaveError(null);

    try {
      let nextLogo = resolvedCompany.logo;

      if (logoFile) {
        const uploadResponse = await uploadCompanyLogo(logoFile);
        nextLogo = uploadResponse.data?.filePath ?? nextLogo;
      }

      await updateCompanyMutation.mutateAsync({
        id: company.id,
        data: {
          name,
          address,
          description: about,
          logo: nextLogo ?? undefined,
        },
      });

      setLogoFile(null);
      setLogoPreview(null);
    } catch (error) {
      setSaveError("Khong the cap nhat cong ty. Vui long thu lai.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="space-y-6">
          <CompanyHeader
            title="Company Profile"
            subtitle="Manage your company's public information and branding."
            status={status}
            role={role}
            onStatusChange={setStatus}
          />
          {companyQuery.isError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Khong the tai thong tin cong ty. Vui long thu lai.
            </div>
          ) : null}
          {companyQuery.isLoading ? (
            <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              Dang tai thong tin cong ty...
            </div>
          ) : null}
          <CompanyStatusBanners status={status} role={role} />
          <CompanyLogoCard
            role={role}
            companyId={company?.id ?? null}
            logoUrl={logoPreview ?? resolvedCompany.logo}
            onSelectFile={handleSelectLogo}
            isUploading={updateCompanyMutation.isPending}
          />
          <CompanyGeneralInfo
            role={role}
            name={name}
            address={address}
            onNameChange={setName}
            onAddressChange={setAddress}
          />
          <CompanyOverview role={role} about={about} onAboutChange={setAbout} />
          {saveError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveError}
            </div>
          ) : null}
          <CompanyFooterActions
            role={role}
            onSave={handleSaveChanges}
            onCancel={handleCancelChanges}
            isSaving={updateCompanyMutation.isPending}
          />
        </div>
      </div>
    </main>
  );
}
