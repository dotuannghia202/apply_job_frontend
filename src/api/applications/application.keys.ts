import type { ApplicationListFilters } from "@/types/application";

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (filters: ApplicationListFilters) =>
    [...applicationKeys.lists(), filters] as const,
  hrLists: () => [...applicationKeys.all, "hr", "list"] as const,
  hrList: (filters: ApplicationListFilters) =>
    [...applicationKeys.hrLists(), filters] as const,
  details: () => [...applicationKeys.all, "detail"] as const,
  detail: (id: number) => [...applicationKeys.details(), id] as const,
};
