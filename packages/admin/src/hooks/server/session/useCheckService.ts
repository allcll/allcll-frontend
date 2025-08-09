import { fetchJsonOnAPI } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

export interface CheckAliveApiResponse {
  isActive: boolean;
}

const checkSessionAlive = async (): Promise<CheckAliveApiResponse> => {
  return fetchJsonOnAPI<CheckAliveApiResponse>('/api/admin/session/check');
};

export function useCheckSessionAlive() {
  return useQuery<CheckAliveApiResponse, Error, boolean>({
    queryKey: ['session-check'],
    queryFn: checkSessionAlive,
    select: data => data.isActive,
  });
}
