import type { BackendResponse, Pagination } from "@/types/common";
import type {
  INotification,
  NotificationListFilters,
} from "@/types/notification";
import axiosClient from "../axiosClient";

export const fetchNotifications = async (
  params: NotificationListFilters = {},
) => {
  return axiosClient.get("/notifications", {
    params,
  }) as Promise<BackendResponse<Pagination<INotification>>>;
};

export const markAsRead = async (id: number) => {
  return axiosClient.put(`/notifications/${id}/read`) as Promise<
    BackendResponse<void>
  >;
};

export const markAllAsRead = async (role: NotificationListFilters["role"]) => {
  return axiosClient.put("/notifications/read-all", null, {
    params: { role },
  }) as Promise<BackendResponse<void>>;
};
