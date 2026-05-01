import type { IndustryListFilters } from "@/types/industry";

export const industryKeys = {
  all: ["industries"] as const,
  lists: () => [...industryKeys.all, "list"] as const,
  list: (filters: IndustryListFilters) =>
    [...industryKeys.lists(), filters] as const,
  details: () => [...industryKeys.all, "detail"] as const,
  detail: (id: number) => [...industryKeys.details(), id] as const,
};
