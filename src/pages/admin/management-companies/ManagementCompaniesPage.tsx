import { useEffect, useMemo, useState } from "react";

import { useGetCompanies } from "@/api/companies/company.queries";
import { useDebounce } from "@/hooks/useDebounce";

import CompanyFilters, {
  type CompanyStatusFilter,
} from "./components/CompanyFilters";
import CompanyTable, { type CompanyRow } from "./components/CompanyTable";
import KPIStats from "./components/KPIStats";
import PageHeader from "./components/PageHeader";
import PaginationBar from "./components/PaginationBar";

const PAGE_SIZE = 6;

export default function ManagementCompaniesPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<CompanyStatusFilter>("");
  const [page, setPage] = useState(1);
  const debouncedKeyword = useDebounce(keyword);

  const companiesQuery = useGetCompanies({
    page,
    size: PAGE_SIZE,
    name: debouncedKeyword || undefined,
    status: status || undefined,
  });

  const companies = companiesQuery.data?.data?.result ?? [];
  const meta = companiesQuery.data?.data?.meta;

  const rows = useMemo<CompanyRow[]>(() => {
    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      industry: company.description || "--",
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

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="space-y-6">
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
              Khong the tai danh sach cong ty. Vui long thu lai.
            </div>
          ) : null}
          {companiesQuery.isLoading ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
              Dang tai danh sach cong ty...
            </div>
          ) : null}
          {!companiesQuery.isLoading && !companiesQuery.isError ? (
            <CompanyTable rows={pageRows} />
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
    </main>
  );
}
