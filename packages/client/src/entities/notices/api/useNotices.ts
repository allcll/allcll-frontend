import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/shared/api/api';
import { type Notice, type NoticesResponse } from '../model/notice';

export function useNotices() {
  return useQuery<NoticesResponse, Error, Notice[]>({
    queryKey: ['notices'],
    queryFn: () => fetchJsonOnAPI<NoticesResponse>('/api/notices'),
    select: data => data.notices,
    staleTime: 1000 * 60 * 5,
  });
}
