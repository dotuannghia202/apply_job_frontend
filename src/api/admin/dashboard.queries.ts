import { useQuery } from "@tanstack/react-query";

import { fetchAdminDashboardStats } from "./dashboard.api";
import { adminDashboardKeys } from "./dashboard.keys";

export const useGetAdminDashboardStats = () => {
  return useQuery({
    queryKey: adminDashboardKeys.stats(),
    queryFn: fetchAdminDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
};
