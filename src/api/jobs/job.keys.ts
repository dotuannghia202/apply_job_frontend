import type { JobListFilters } from "@/types/job";

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  // Key for paginated and filtered lists.
  list: (filters: JobListFilters) => [...jobKeys.lists(), filters] as const,
  hrLists: () => [...jobKeys.all, "hr", "list"] as const,
  hrList: (filters: JobListFilters) => [...jobKeys.hrLists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: number) => [...jobKeys.details(), id] as const,
};
