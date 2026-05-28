import { Image, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RoleName } from "@/types/auth";

interface CompanyLogoCardProps {
  role: RoleName;
}

export default function CompanyLogoCard({ role }: CompanyLogoCardProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Image className="size-6" />
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Upload New Logo
            </p>
            <p className="text-xs text-slate-500">
              Recommended size: 400x400px. Max 5MB. Supports PNG, JPG, SVG.
            </p>
          </div>
          {role === "EMPLOYER" ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 border-emerald-200 text-emerald-700"
              >
                <UploadCloud className="size-4" />
                Upload New Logo
              </Button>
              {/* <Button
                variant="ghost"
                className="gap-2 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="size-4" />
                Remove
              </Button> */}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
