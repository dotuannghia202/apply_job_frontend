import { Outlet } from "react-router-dom";

import AppFooter from "@/layouts/components/AppFooter";
import AppHeader from "@/layouts/components/AppHeader";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}
