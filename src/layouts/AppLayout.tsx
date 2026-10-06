import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import AppFooter from "@/layouts/components/AppFooter";
import AppHeader from "@/layouts/components/AppHeader";
import { fetchAccountInfo } from "@/api/users/user.api";
import { getAccountUser, mapAccountToAuthUser } from "@/helper/auth-roles";
import { useAuthStore } from "@/store/auth.store";

// Shared promise to deduplicate session restoration requests
let restoreSessionPromise: Promise<any> | null = null;

export default function AppLayout() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (isInitialized) return;

    let isMounted = true;

    const restoreSession = async () => {
      try {
        if (!restoreSessionPromise) {
          restoreSessionPromise = fetchAccountInfo().finally(() => {
            restoreSessionPromise = null;
          });
        }
        const response = await restoreSessionPromise;
        const accountUser = getAccountUser(response?.data);

        if (accountUser && isMounted) {
          setAuth(mapAccountToAuthUser(accountUser));
        } else if (isMounted) {
          logout();
        }
      } catch {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [isInitialized, logout, setAuth, setInitialized]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex-1 bg-main-background">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}
