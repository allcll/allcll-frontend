import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api';
import { getSessionConfig } from '@/utils/sessionConfig.ts';
import { REFETCH_INTERVAL } from '@/hooks/server/session/useAdminSession.ts';

export interface UserSessionStatus {
  userId: string;
  isActive: boolean;
  startTime: string;
}

export interface CheckAliveApiResponse {
  userSessionStatusResponses: UserSessionStatus[];
}

const checkSessionAlive = async (): Promise<CheckAliveApiResponse> => {
  return fetchJsonOnAPI<CheckAliveApiResponse>(`/api/admin/sessions/check`);
};

export function useCheckSessionAlive() {
  const session = getSessionConfig();

  return useQuery<CheckAliveApiResponse, Error, boolean>({
    queryKey: ['session-check'],
    queryFn: checkSessionAlive,
    select: data => data.userSessionStatusResponses.some(sessionStatus => sessionStatus.isActive),
    staleTime: 0,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!session && !!session.session && !!session.userId,
  });
}
