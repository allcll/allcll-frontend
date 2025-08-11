import { getRequestLogs } from '@/utils/log/adminApiLogs';
import { useQuery } from '@tanstack/react-query';

/**
 *
 * @returns
 */
export function useGetLogs() {
  return useQuery({
    queryKey: ['logs'],
    queryFn: getRequestLogs,
    staleTime: Infinity,
    enabled: false,
  });
}
