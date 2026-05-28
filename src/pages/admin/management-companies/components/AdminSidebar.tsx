import { Building2, LayoutDashboard, Settings, Users } from "lucide-react";

const navItems = [
  { label: "Tong quan", icon: LayoutDashboard },
  { label: "Quan ly cong ty", icon: Building2, active: true },
  { label: "Quan ly nguoi dung", icon: Users },
  { label: "Cai dat he thong", icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="flex h-full flex-col gap-6 rounded-3xl bg-[#f1f4f7] p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Admin Hub
        </p>
        <h2 className="mt-3 text-xl font-semibold text-slate-900">
          Quan tri vien
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Dieu huong he thong va quan ly nguon luc.
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-white/80 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">He thong AI</p>
        <p className="mt-1 text-xs text-slate-500">
          Cap nhat trang thai duyet ho so theo thoi gian thuc.
        </p>
      </div>
    </aside>
  );
}
