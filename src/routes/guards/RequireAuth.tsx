import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchAccountInfo } from "@/api/users/user.api";
import { normalizeRoles } from "@/helper/auth-roles";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types/auth";
import type { User } from "@/types/user";

function getAccountUser(data: User | { user: User } | null | undefined) {
  return data && "user" in data ? data.user : data;
}

function mapAccountToAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? user.avatar ?? null,
    isActive: user.isActive ?? null,
    roles: normalizeRoles(user.roles ?? []),
    company: user.company
      ? {
          id: user.company.id,
          name: user.company.name,
        }
      : null,
  };
}

export default function RequireAuth() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const [isCheckingSession, setIsCheckingSession] = useState(
    !isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated || user) {
      setIsCheckingSession(false);
      return;
    }

    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await fetchAccountInfo();
        const accountUser = getAccountUser(response.data);

        if (!accountUser) {
          logout();
          return;
        }

        setAuth(mapAccountToAuthUser(accountUser));
      } catch {
        logout();
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, logout, setAuth, user]);

  if (isCheckingSession) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
