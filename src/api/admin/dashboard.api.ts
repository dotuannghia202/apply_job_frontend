import type { BackendResponse } from "@/types/common";
import type { AdminDashboardStats } from "@/types/admin-dashboard";
import axiosClient from "../axiosClient";

export const fetchAdminDashboardStats = async () => {
  return axiosClient.get("/admin/dashboard-stats") as Promise<
    BackendResponse<AdminDashboardStats>
  >;
};
