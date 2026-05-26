import { Database } from "lucide-react";

import avatarPlaceholder from "@/assets/images/avatar-placeholder.webp";

type AuditInfo = {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  updatedByAvatar?: string;
};

type UserAuditCardProps = {
  audit: AuditInfo;
};

export default function UserAuditCard({ audit }: UserAuditCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700">
          <Database className="size-4" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          Audit Trails & Metadata
        </h3>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Created At
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {audit.createdAt}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Created By
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {audit.createdBy}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Updated At
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {audit.updatedAt}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={audit.updatedByAvatar || avatarPlaceholder}
            alt={audit.updatedBy}
            className="h-7 w-7 rounded-full object-cover"
            onError={(event) => {
              event.currentTarget.src = avatarPlaceholder;
            }}
          />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Updated By
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {audit.updatedBy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
