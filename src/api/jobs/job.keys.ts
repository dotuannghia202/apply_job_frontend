import type { JobListFilters } from "@/types/job";

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  // Key cho danh sách có phân trang và lọc
  list: (filters: JobListFilters) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: number) => [...jobKeys.details(), id] as const,
};
