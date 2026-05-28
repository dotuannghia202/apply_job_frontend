import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaginationBarProps {
  page: number;
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationBar({
  page,
  pageSize,
  total,
  onPrev,
  onNext,
}: PaginationBarProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = [page, page + 1, page + 2].filter(
    (value) => value <= totalPages,
  );

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"
      data-section="PaginationBar"
    >
      <span>
        Showing {start}-{end} of {total} companies
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          className="h-8 w-8 rounded-lg border-slate-200 bg-slate-50"
          onClick={onPrev}
          disabled={page <= 1}
        >
          <ChevronLeft className="size-4" />
        </Button>
        {pageNumbers.map((value) => (
          <span
            key={value}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              value === page
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {value}
          </span>
        ))}
        {totalPages > page + 2 ? (
          <span className="px-1 text-slate-400">...</span>
        ) : null}
        <Button
          variant="outline"
          size="icon-sm"
          className="h-8 w-8 rounded-lg border-slate-200 bg-slate-50"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
