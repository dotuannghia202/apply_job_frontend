import { CheckCircle2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
}

export default function BulkActions({ selectedCount }: BulkActionsProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f1f4f7] px-4 py-3"
      data-section="BulkActions"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Da chon {selectedCount} cong ty
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="border-slate-200 bg-white text-slate-700"
          disabled={selectedCount === 0}
        >
          <CheckCircle2 className="size-4" />
          Duyet hang loat
        </Button>
        <Button
          variant="outline"
          className="border-slate-200 bg-white text-slate-700"
          disabled={selectedCount === 0}
        >
          <Lock className="size-4" />
          Khoa hang loat
        </Button>
      </div>
    </div>
  );
}
