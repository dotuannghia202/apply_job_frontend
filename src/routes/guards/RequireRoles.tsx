import { Navigate, Outlet } from "react-router-dom";
import type { AuthUser, RoleName } from "@/types/auth";

type RequireRolesProps = {
  allowedRoles: RoleName[];
};

export default function RequireRoles({ allowedRoles }: RequireRolesProps) {
  const rawUser = localStorage.getItem("authUser");
  const user: AuthUser | null = rawUser ? JSON.parse(rawUser) : null;

  const userRoles: RoleName[] = user?.roles?.map((r) => r) ?? [];
  const canAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
