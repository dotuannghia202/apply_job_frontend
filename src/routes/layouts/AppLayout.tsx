import { Outlet } from "react-router-dom";

import AppHeader from "@/layouts/components/AppHeader";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <Outlet />
    </div>
  );
}
