import { Filter, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ManageUserFilters() {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search className="size-4 text-slate-500" />
          <input
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            placeholder="Tim theo ten, email, ma nguoi dung"
            type="text"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <Filter className="size-4" />
            <select className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none">
              <option>Vai tro</option>
              <option>Ung vien</option>
              <option>Nha tuyen dung</option>
              <option>Quan tri vien</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <SlidersHorizontal className="size-4" />
            <select className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none">
              <option>Trang thai</option>
              <option>Hoat dong</option>
              <option>Cho duyet</option>
              <option>Tam khoa</option>
            </select>
          </div>
          <Button variant="outline" className="gap-2 border-slate-200">
            Lam moi bo loc
          </Button>
        </div>
      </div>
    </section>
  );
}
