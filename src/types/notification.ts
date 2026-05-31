import type { QueryParams } from "./common";

export interface INotification {
  id: number;
  title: string;
  message: string;
  type: string;
  referenceId: number | null;
  read: boolean; // Chú ý: Ở BE Spring Boot là isRead, nhưng Jackson tự parse thành "read"
  createdAt: string;
}

export interface NotificationListFilters extends Pick<
  QueryParams,
  "page" | "size"
> {
  isRead?: boolean;
}
