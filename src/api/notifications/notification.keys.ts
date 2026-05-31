import type { NotificationListFilters } from "@/types/notification";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: NotificationListFilters) =>
    [...notificationKeys.lists(), filters] as const,
};
