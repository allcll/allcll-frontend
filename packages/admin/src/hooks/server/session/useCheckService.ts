import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api';
import { getSessionConfig } from '@/utils/sessionConfig.ts';
import { REFETCH_INTERVAL } from '@/hooks/server/session/useAdminSession.ts';

export interface CheckAliveApiResponse {
  isActive: boolean;
}

const checkSessionAlive = async (): Promise<CheckAliveApiResponse> => {
  const userId = localStorage.getItem('userId') ?? '';
  return fetchJsonOnAPI<CheckAliveApiResponse>(`/api/admin/session/check?userId=${userId}`);
};

export function useCheckSessionAlive() {
  const session = getSessionConfig();

  return useQuery<CheckAliveApiResponse, Error, boolean>({
    queryKey: ['session-check'],
    queryFn: () => checkSessionAlive(),
    select: data => data.isActive,
    staleTime: 0, // 항상 stale로 간주
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!session && !!session.session && !!session.userId,
  });
}
