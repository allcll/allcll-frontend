import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/shared/api/api';

export interface PopularityMap {
  [subjectId: string]: number;
}

export interface QueryClickMap {
  [query: string]: {
    [subjectId: string]: number;
  };
}

const SEARCH_DATA_STALE_TIME = 1000 * 60 * 60 * 24; // 24시간 (데이터가 자주 바뀌지 않음)

export function useSearchPopularity() {
  return useQuery({
    queryKey: ['search', 'popularity'],
    queryFn: async () => {
        try {
            return await fetchJsonOnPublic<PopularityMap>('/searches/popularity_map.json');
        } catch (e) {
            console.error('Failed to fetch popularity map:', e);
            return {};
        }
    },
    staleTime: SEARCH_DATA_STALE_TIME,
  });
}

export function useSearchQueryClicks() {
  return useQuery({
    queryKey: ['search', 'query-clicks'],
    queryFn: async () => {
        try {
            return await fetchJsonOnPublic<QueryClickMap>('/searches/query_click_map.json');
        } catch (e) {
            console.error('Failed to fetch query click map:', e);
            return {};
        }
    },
    staleTime: SEARCH_DATA_STALE_TIME,
  });
}
