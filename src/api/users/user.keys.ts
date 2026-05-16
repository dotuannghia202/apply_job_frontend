import type { SavedJobsFilters, UserListFilters } from "@/types/user";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserListFilters) => [...userKeys.lists(), filters] as const,
  savedJobs: (filters: SavedJobsFilters) =>
    [...userKeys.all, "saved-jobs", filters] as const,
  account: () => [...userKeys.all, "account"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};
