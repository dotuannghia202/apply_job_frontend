import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { RoleName } from "@/types/auth";

interface CompanyGeneralInfoProps {
  role: RoleName;
  name: string;
  address: string;
  onNameChange?: (value: string) => void;
  onAddressChange?: (value: string) => void;
}

export default function CompanyGeneralInfo({
  role,
  name,
  address,
  onNameChange,
  onAddressChange,
}: CompanyGeneralInfoProps) {
  const canEdit = role === "EMPLOYER";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <MapPin className="size-4" />
        </span>
        General Information
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">
            Company Name
          </label>
          {canEdit ? (
            <Input
              className="h-11 rounded-lg border-slate-200 bg-slate-50 text-slate-900 shadow-none"
              value={name}
              onChange={(event) => onNameChange?.(event.target.value)}
            />
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {name}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500">
            Headquarters Address
          </label>
          {canEdit ? (
            <Input
              className="h-11 rounded-lg border-slate-200 bg-slate-50 text-slate-900 shadow-none"
              value={address}
              onChange={(event) => onAddressChange?.(event.target.value)}
            />
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {address}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
