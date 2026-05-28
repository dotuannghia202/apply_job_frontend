import type { CompanyStatus } from "@/types/company";
import type { RoleName } from "@/types/auth";

interface CompanyStatusBannersProps {
  status: CompanyStatus;
  role: RoleName;
}

export default function CompanyStatusBanners({
  status,
  role,
}: CompanyStatusBannersProps) {
  if (role !== "EMPLOYER") return null;

  if (status === "PENDING") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Your company profile is currently under review by our admins. You can
        still make changes.
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Your profile was rejected. Please update your information and save to
        resubmit.
      </div>
    );
  }

  return null;
}
