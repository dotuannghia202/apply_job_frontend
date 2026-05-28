import { useEffect, useMemo, useState } from "react";

import AdminSidebar from "./components/AdminSidebar";
import BulkActions from "./components/BulkActions";
import CompanyFilters, {
  type CompanyStatusFilter,
} from "./components/CompanyFilters";
import CompanyTable, { type CompanyRow } from "./components/CompanyTable";
import KPIStats from "./components/KPIStats";
import PageHeader from "./components/PageHeader";
import PaginationBar from "./components/PaginationBar";
import QuickInsights from "./components/QuickInsights";

const PAGE_SIZE = 6;

const companies: CompanyRow[] = [
  {
    id: 1201,
    name: "Nexus Labs",
    status: "Hoat dong",
    industry: "Cong nghe",
    province: "Ha Noi",
    jobs: 34,
    createdAt: "12/03/2026",
  },
  {
    id: 1202,
    name: "Aurora Finance",
    status: "Cho duyet",
    industry: "Tai chinh",
    province: "TP. Ho Chi Minh",
    jobs: 12,
    createdAt: "05/03/2026",
  },
  {
    id: 1203,
    name: "Mediverse",
    status: "Hoat dong",
    industry: "Y te",
    province: "Da Nang",
    jobs: 19,
    createdAt: "28/02/2026",
  },
  {
    id: 1204,
    name: "Skyline Retail",
    status: "Tam khoa",
    industry: "Ban le",
    province: "Ha Noi",
    jobs: 0,
    createdAt: "18/02/2026",
  },
  {
    id: 1205,
    name: "GreenByte",
    status: "Hoat dong",
    industry: "Cong nghe",
    province: "TP. Ho Chi Minh",
    jobs: 22,
    createdAt: "10/02/2026",
  },
  {
    id: 1206,
    name: "Atlas Logistics",
    status: "Cho duyet",
    industry: "Logistics",
    province: "Da Nang",
    jobs: 7,
    createdAt: "03/02/2026",
  },
  {
    id: 1207,
    name: "Nova Education",
    status: "Hoat dong",
    industry: "Giao duc",
    province: "Ha Noi",
    jobs: 9,
    createdAt: "20/01/2026",
  },
  {
    id: 1208,
    name: "Pulse Energy",
    status: "Tam khoa",
    industry: "Nang luong",
    province: "TP. Ho Chi Minh",
    jobs: 3,
    createdAt: "11/01/2026",
  },
];

export default function MangementCompaniesPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<CompanyStatusFilter>("");
  const [industry, setIndustry] = useState("");
  const [province, setProvince] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredRows = useMemo(() => {
    return companies.filter((row) => {
      const matchesKeyword = keyword
        ? row.name.toLowerCase().includes(keyword.toLowerCase())
        : true;
      const matchesStatus = status
        ? status === "active"
          ? row.status === "Hoat dong"
          : status === "pending"
            ? row.status === "Cho duyet"
            : row.status === "Tam khoa"
        : true;
      const matchesIndustry = industry
        ? row.industry.toLowerCase().includes(industry.toLowerCase())
        : true;
      const matchesProvince = province ? row.province === province : true;

      return (
        matchesKeyword && matchesStatus && matchesIndustry && matchesProvince
      );
    });
  }, [keyword, status, industry, province]);

  const total = filteredRows.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageRows = filteredRows.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [keyword, status, industry, province]);

  useEffect(() => {
    if (page > 1 && startIndex >= filteredRows.length) {
      setPage(1);
    }
  }, [page, startIndex, filteredRows.length]);

  const handleToggleAll = (checked: boolean) => {
    setSelectedIds(checked ? pageRows.map((row) => row.id) : []);
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleReset = () => {
    setKeyword("");
    setStatus("");
    setIndustry("");
    setProvince("");
    setPage(1);
    setSelectedIds([]);
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <AdminSidebar />

          <div className="space-y-8">
            <PageHeader />
            <KPIStats />
            <CompanyFilters
              keyword={keyword}
              status={status}
              industry={industry}
              province={province}
              onKeywordChange={setKeyword}
              onStatusChange={setStatus}
              onIndustryChange={setIndustry}
              onProvinceChange={setProvince}
              onReset={handleReset}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <BulkActions selectedCount={selectedIds.length} />
                <CompanyTable
                  rows={pageRows}
                  selectedIds={selectedIds}
                  onToggleAll={handleToggleAll}
                  onToggleRow={handleToggleRow}
                />
                <PaginationBar
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPrev={() => {
                    setPage((prev) => Math.max(1, prev - 1));
                    setSelectedIds([]);
                  }}
                  onNext={() => {
                    setPage((prev) =>
                      Math.min(Math.ceil(total / PAGE_SIZE) || 1, prev + 1),
                    );
                    setSelectedIds([]);
                  }}
                />
              </div>
              <QuickInsights />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
