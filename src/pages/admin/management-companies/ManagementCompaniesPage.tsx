import { useEffect, useMemo, useState } from "react";

import CompanyFilters, {
  type CompanyStatusFilter,
} from "./components/CompanyFilters";
import CompanyTable, { type CompanyRow } from "./components/CompanyTable";
import KPIStats from "./components/KPIStats";
import PageHeader from "./components/PageHeader";
import PaginationBar from "./components/PaginationBar";

const PAGE_SIZE = 6;

const companies: CompanyRow[] = [
  {
    id: 1201,
    name: "TechNova Solutions",
    status: "Pending",
    industry: "Information Technology",
    employerName: "Marcus Thorne",
    employerEmail: "m.thorne@technova.io",
    jobs: 34,
    createdAt: "Oct 24, 2023",
  },
  {
    id: 1202,
    name: "GreenLeaf Logistics",
    status: "Approved",
    industry: "Transport & Supply Chain",
    employerName: "Sarah Jenkins",
    employerEmail: "s.jenkins@greenleaf.com",
    jobs: 12,
    createdAt: "Oct 22, 2023",
  },
  {
    id: 1203,
    name: "FinServe Alpha",
    status: "Pending",
    industry: "Financial Services",
    employerName: "David Chen",
    employerEmail: "chen.d@finserve.co",
    jobs: 19,
    createdAt: "Oct 21, 2023",
  },
  {
    id: 1204,
    name: "BioGrowth Systems",
    status: "Rejected",
    industry: "Agriculture Technology",
    employerName: "Elara Vance",
    employerEmail: "vance.elara@biogrowth.com",
    jobs: 9,
    createdAt: "Oct 20, 2023",
  },
];

export default function ManagementCompaniesPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<CompanyStatusFilter>("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    return companies.filter((row) => {
      const matchesKeyword = keyword
        ? row.name.toLowerCase().includes(keyword.toLowerCase())
        : true;
      const matchesStatus = status
        ? status === "active"
          ? row.status === "Approved"
          : status === "pending"
            ? row.status === "Pending"
            : row.status === "Rejected"
        : true;

      return matchesKeyword && matchesStatus;
    });
  }, [keyword, status]);

  const total = filteredRows.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageRows = filteredRows.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [keyword, status]);

  useEffect(() => {
    if (page > 1 && startIndex >= filteredRows.length) {
      setPage(1);
    }
  }, [page, startIndex, filteredRows.length]);

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
          <CompanyTable rows={pageRows} />
          <PaginationBar
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPrev={() => {
              setPage((prev) => Math.max(1, prev - 1));
            }}
            onNext={() => {
              setPage((prev) =>
                Math.min(Math.ceil(total / PAGE_SIZE) || 1, prev + 1),
              );
            }}
          />
        </div>
      </div>
    </main>
  );
}
