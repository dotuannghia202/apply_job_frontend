import { AlignLeft } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import type { RoleName } from "@/types/auth";

interface CompanyOverviewProps {
  role: RoleName;
  about: string;
  onAboutChange?: (value: string) => void;
}

export default function CompanyOverview({
  role,
  about,
  onAboutChange,
}: CompanyOverviewProps) {
  const canEdit = role === "EMPLOYER";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <AlignLeft className="size-4" />
        </span>
        Company Overview
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4 border-b border-slate-200 px-4 py-2 text-xs text-slate-400">
          <span className="font-semibold">B</span>
          <span className="italic">I</span>
          <span className="uppercase">T</span>
          <span className="text-slate-300">|</span>
          <span>Link</span>
        </div>
        {canEdit ? (
          <Textarea
            className="min-h-[180px] border-0 bg-transparent text-sm text-slate-700 shadow-none focus-visible:ring-0"
            value={about}
            onChange={(event) => onAboutChange?.(event.target.value)}
          />
        ) : (
          <div className="space-y-3 px-4 py-3 text-sm text-slate-700">
            {about.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
