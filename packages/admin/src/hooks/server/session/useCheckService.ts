import { fetchJsonOnAPI } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

export interface CheckAliveApiResponse {
  isActive: boolean;
}

const checkSessionAlive = async (userId: string): Promise<CheckAliveApiResponse> => {
  return fetchJsonOnAPI<CheckAliveApiResponse>(`/api/admin/session/check?userId=${userId}`);
};

export function useCheckSessionAlive(userId: string) {
  return useQuery<CheckAliveApiResponse, Error, boolean>({
    queryKey: ['session-check'],
    queryFn: () => checkSessionAlive(userId),
    select: data => data.isActive,
    staleTime: 0, // 항상 stale로 간주
  });
}
