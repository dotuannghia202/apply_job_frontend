import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import type { RoleName } from "@/types/auth";

type RequireRolesProps = {
  allowedRoles: RoleName[];
};

export default function RequireRoles({ allowedRoles }: RequireRolesProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/401" replace />;
  }
  const userRoles = user.roles.map((role) => role);
  const canAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!canAccess) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
