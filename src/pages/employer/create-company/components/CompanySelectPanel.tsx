"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCompanies } from "@/api/companies/company.queries";
import { useDebounce } from "@/hooks/useDebounce";
import type { Company } from "@/types/company";
import { useAuthStore } from "@/store/auth.store";
import { useAssignCompany } from "@/api/users/user.queries";
import { useNavigate } from "react-router";

const inputCls =
  "w-full px-4 py-3 " +
  "bg-[#dde3e9] " +
  "border-0 shadow-none " +
  "rounded-md " +
  "focus-visible:ring-2 focus-visible:ring-[#72b183]/20 focus-visible:ring-offset-0 " +
  "transition-all " +
  "text-[#2d3338] placeholder:text-[#596065]/60 " +
  "text-sm font-normal";

export function CompanySelectPanel() {
  const [companySearch, setCompanySearch] = useState("");
  const [isAssigningCompany, setIsAssigningCompany] = useState(false);
  const [confirmCompany, setConfirmCompany] = useState<Company | null>(null);
  const debouncedSearch = useDebounce(companySearch.trim(), 400);
  const companiesQuery = useGetCompanies({
    page: 1,
    size: 6,
    name: debouncedSearch || undefined,
  });
  const navigate = useNavigate();
  const companies = companiesQuery.data?.data?.result ?? [];
  const user = useAuthStore((state) => state.user);
  const setCompany = useAuthStore((state) => state.setCompany);
  const assignCompanyMutation = useAssignCompany();
  const currentCompanyId = user?.company?.id ?? null;

  const handleConfirmOpen = (company: Company) => {
    if (!user || isAssigningCompany || assignCompanyMutation.isPending) return;
    if (currentCompanyId === company.id) return;
    setConfirmCompany(company);
  };

  const handleAssignCompany = async () => {
    if (!confirmCompany || !user) return;

    setIsAssigningCompany(true);

    try {
      await assignCompanyMutation.mutateAsync(confirmCompany.id);
      setCompany({ id: confirmCompany.id, name: confirmCompany.name });
      setConfirmCompany(null);
      setIsAssigningCompany(false);
      navigate("/employer/dashboard", { replace: true });
    } catch (error) {
      console.error("Failed to assign company to user", error);
      setIsAssigningCompany(false);
    }
  };

  return (
    <section className="lg:col-span-6 space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/70 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-[#72b183]" />
          <h2 className="text-xl font-bold text-[#2d3338]">
            Choose from existing companies
          </h2>
        </div>

        <p className="text-sm text-[#596065]">
          Find a company already listed in the system and join it.
        </p>

        <Input
          value={companySearch}
          onChange={(event) => setCompanySearch(event.target.value)}
          placeholder="Search company name"
          className={inputCls}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="rounded-xl border border-slate-200/70 bg-[#f7f9fc] p-4 flex flex-col gap-3 transition-shadow hover:shadow-sm"
              onClick={() => handleConfirmOpen(company)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleConfirmOpen(company);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-white border border-slate-200/70 flex items-center justify-center overflow-hidden">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-[#7a848b]">
                      Logo
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2d3338]">
                    {company.name}
                  </p>
                  <p className="text-xs text-[#707780] line-clamp-1">
                    {company.description || company.address}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-slate-200"
                disabled={
                  isAssigningCompany ||
                  assignCompanyMutation.isPending ||
                  currentCompanyId === company.id
                }
                onClick={(event) => {
                  event.stopPropagation();
                  handleConfirmOpen(company);
                }}
              >
                {currentCompanyId === company.id ? "Selected" : "Select"}
              </Button>
            </div>
          ))}
        </div>

        {!companiesQuery.isLoading && companies.length === 0 && (
          <p className="text-xs text-[#7a848b]">No companies found.</p>
        )}
      </div>

      {confirmCompany ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#2d3338]">
              Confirm company selection
            </h3>
            <p className="mt-2 text-sm text-[#596065]">
              Assign{" "}
              <span className="font-semibold">{confirmCompany.name}</span> to
              your employer account?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-slate-200"
                onClick={() => setConfirmCompany(null)}
                disabled={isAssigningCompany || assignCompanyMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAssignCompany}
                disabled={isAssigningCompany || assignCompanyMutation.isPending}
              >
                {isAssigningCompany || assignCompanyMutation.isPending
                  ? "Assigning..."
                  : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
