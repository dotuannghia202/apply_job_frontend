import { NavLink, Outlet } from "react-router-dom";
import type { AuthUser, RoleName } from "@/types/auth";
import { NAV_ITEMS } from "./constant";

function hasAnyRole(userRoles: RoleName[], allowedRoles?: RoleName[]): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.some((role) => userRoles.includes(role));
}

export default function AppLayout() {
  const rawUser = localStorage.getItem("authUser");
  const user: AuthUser | null = rawUser ? JSON.parse(rawUser) : null;

  const roleNames: RoleName[] = user?.roles?.map((role) => role) ?? [];

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    hasAnyRole(roleNames, item.allowedRoles),
  );

  return (
    <div className="min-h-screen bg-[#0a0c0b] text-white flex">
      <aside className="w-72 border-r border-white/10 bg-[#121412] p-6 hidden lg:block">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Job Portal</h1>
          <p className="text-sm text-gray-400 mt-2">{user?.name ?? "User"}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {roleNames.map((role) => (
              <span
                key={role}
                className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-200"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <nav className="space-y-2">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-primary text-[#0a0c0b] font-semibold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-white/10 bg-[#121412]/80 backdrop-blur px-6 flex items-center justify-between">
          <h2 className="font-semibold">Workspace</h2>
          <div className="text-sm text-gray-400">{user?.email}</div>
        </header>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
