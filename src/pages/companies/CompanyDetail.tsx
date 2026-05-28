import { useState } from "react";

import CompanyFooterActions from "./components/CompanyFooterActions";
import CompanyGeneralInfo from "./components/CompanyGeneralInfo";
import CompanyHeader from "./components/CompanyHeader";
import CompanyLogoCard from "./components/CompanyLogoCard";
import CompanyOverview from "./components/CompanyOverview";
import CompanyStatusBanners from "./components/CompanyStatusBanners";

import { useAuthStore } from "@/store/auth.store";
import type { RoleName } from "@/types/auth";
import type { CompanyStatus } from "@/types/company";

const mockCompany = {
  name: "Botanical Talent Recruitment",
  address: "123 Greenhouse Lane, Portland, OR 97201",
  industry: "Sustainable Talent Ecosystem",
  about:
    "At Botanical Talent, we believe that the best professional relationships bloom in environments that prioritize growth, transparency, and natural talent development. Founded in 2024, our mission is to cultivate a recruitment ecosystem where candidates are not just resumes, but flourishing individuals seeking their next fertile ground.\n\nWe specialize in placing high-impact individuals in roles that resonate with their personal and professional core values.",
  status: "PENDING" as CompanyStatus,
};

const resolveRole = (roles: RoleName[] = []): RoleName => {
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("EMPLOYER")) return "EMPLOYER";
  return "CANDIDATE";
};

export default function CompanyDetail() {
  const user = useAuthStore((state) => state.user);
  const role = resolveRole(user?.roles ?? []);
  const initialStatus =
    (user?.company as { status?: CompanyStatus } | null)?.status ??
    mockCompany.status;
  const [status, setStatus] = useState<CompanyStatus>(initialStatus);

  return (
    <main className="min-h-screen bg-[#f7f8f2]">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="space-y-6">
          <CompanyHeader
            title="Company Profile"
            subtitle="Manage your company's public information and branding."
            status={status}
            role={role}
            onStatusChange={setStatus}
          />
          <CompanyStatusBanners status={status} role={role} />
          <CompanyLogoCard role={role} />
          <CompanyGeneralInfo
            role={role}
            name={mockCompany.name}
            address={mockCompany.address}
          />
          <CompanyOverview role={role} about={mockCompany.about} />
          <CompanyFooterActions role={role} />
        </div>
      </div>
    </main>
  );
}
