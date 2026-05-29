import { Image, UploadCloud } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import type { RoleName } from "@/types/auth";

interface CompanyLogoCardProps {
  role: RoleName;
  companyId?: number | null;
  logoUrl?: string | null;
  onSelectFile?: (file: File) => void;
  isUploading?: boolean;
}

export default function CompanyLogoCard({
  role,
  companyId,
  logoUrl,
  onSelectFile,
  isUploading = false,
}: CompanyLogoCardProps) {
  const inputId = useId();
  const authCompanyId = useAuthStore((state) => state.company?.id ?? null);
  const canUpdateLogo =
    role === "EMPLOYER" && companyId != null && companyId === authCompanyId;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 text-emerald-700">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company logo"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image className="size-6" />
          )}
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
          {canUpdateLogo ? (
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Upload New Logo
              </p>
              <p className="text-xs text-slate-500">
                Recommended size: 400x400px. Max 5MB. Supports PNG, JPG, SVG.
              </p>
            </div>
          ) : null}
          {canUpdateLogo ? (
            <div className="flex items-center gap-2">
              <input
                id={inputId}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    onSelectFile?.(file);
                    event.target.value = "";
                  }
                }}
              />
              <Button
                variant="outline"
                className="gap-2 border-emerald-200 text-emerald-700"
                disabled={isUploading}
                asChild
              >
                <label htmlFor={inputId}>
                  <UploadCloud className="size-4" />
                  Update Logo
                </label>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
