import { Filter, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RoleName } from "@/types/auth";

type UserStatusFilter = "" | "active" | "inactive";

interface ManageUserFiltersProps {
  keyword: string;
  role: "" | RoleName;
  status: UserStatusFilter;
  onKeywordChange: (value: string) => void;
  onRoleChange: (value: "" | RoleName) => void;
  onStatusChange: (value: UserStatusFilter) => void;
  onReset: () => void;
}

export default function ManageUserFilters({
  keyword,
  role,
  status,
  onKeywordChange,
  onRoleChange,
  onStatusChange,
  onReset,
}: ManageUserFiltersProps) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search className="size-4 text-slate-500" />
          <input
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            placeholder="Tim theo ten hoac email"
            type="text"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <Filter className="size-4" />
            <select
              className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
              value={role}
              onChange={(event) =>
                onRoleChange(event.target.value as "" | RoleName)
              }
            >
              <option value="">Vai tro</option>
              <option value="CANDIDATE">Ung vien</option>
              <option value="EMPLOYER">Nha tuyen dung</option>
              <option value="ADMIN">Quan tri vien</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <SlidersHorizontal className="size-4" />
            <select
              className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value as UserStatusFilter)
              }
            >
              <option value="">Trang thai</option>
              <option value="active">Hoat dong</option>
              <option value="inactive">Tam khoa</option>
            </select>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-slate-200"
            onClick={onReset}
          >
            Lam moi bo loc
          </Button>
        </div>
      </div>
    </section>
  );
}
