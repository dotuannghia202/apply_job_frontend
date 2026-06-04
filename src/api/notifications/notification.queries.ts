import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.api";
import { notificationKeys } from "./notification.keys";
import type { NotificationListFilters } from "@/types/notification";

export const useGetNotifications = (
  filters: NotificationListFilters = {},
  options: Partial<UseQueryOptions<any, Error>>,
) => {
  const normalizedFilters: Required<
    Pick<NotificationListFilters, "page" | "size">
  > &
    NotificationListFilters = {
    page: filters.page ?? 1,
    size: filters.size ?? 20,
    ...filters,
  };

  return useQuery({
    queryKey: notificationKeys.list(normalizedFilters),
    queryFn: () => fetchNotifications(normalizedFilters),
    enabled: options.enabled ?? true,
    staleTime: 60 * 1000,
    retry: false,
    ...options,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
  });
};
