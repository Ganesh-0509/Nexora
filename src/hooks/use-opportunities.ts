import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type OpportunityFilters = {
  type?: string;
  difficulty?: string;
  isRemote?: boolean;
  minStipend?: boolean;
  minPrizePool?: boolean;
  search?: string;
  skills?: string[];
  domains?: string[];
  isRecommended?: boolean;
};


export function useOpportunities(filters: OpportunityFilters) {
  return useInfiniteQuery({
    queryKey: ["opportunities", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        page: pageParam.toString(),
        limit: "10",
        ...(filters.type && { type: filters.type }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.isRemote !== undefined && { isRemote: filters.isRemote.toString() }),
        ...(filters.minStipend !== undefined && { minStipend: filters.minStipend.toString() }),
        ...(filters.minPrizePool !== undefined && { minPrizePool: filters.minPrizePool.toString() }),
        ...(filters.search && { search: filters.search }),
        ...(filters.skills?.length && { skills: filters.skills.join(",") }),
        ...(filters.domains?.length && { domains: filters.domains.join(",") }),
      });

      const endpoint = filters.isRecommended 
        ? `/api/v1/recommendations/feed?limit=20` 
        : `/api/v1/opportunities?${queryParams.toString()}`;

      const response = await api.get<any>(endpoint);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (filters.isRecommended) return undefined; // Recommendation feed is not paginated yet
      const nextPage = allPages.length + 1;
      return lastPage.data?.length === 10 ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
