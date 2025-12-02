import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import useToastNotification from '@allcll/common/store/useToastNotification';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import { getSessionConfig, isValidSession } from '@/utils/sessionConfig.ts';
import { REFETCH_INTERVAL } from '@/hooks/server/session/useAdminSession.ts';

const startCrawlersSeat = async (userId: string) => {
  const response = await fetchOnAPI(`/api/admin/seat/start?userId=${userId}`, {
    method: 'POST',
  });

  const response_body = await response.text();
  if (!response.ok) {
    await addRequestLog(response, 'POST', '');
    throw new Error(response_body);
  }

  await addRequestLog(response, 'POST', '');

  return response;
};

const cancelCrawlersSeat = async () => {
  const response = await fetchOnAPI('/api/admin/seat/cancel', {
    method: 'POST',
  });

  const response_body = await response.text();

  if (!response.ok) {
    await addRequestLog(response, 'POST', '');
    throw new Error(response_body);
  }

  await addRequestLog(response, 'POST', '');

  return response;
};

const startSeasonCrawlersSeat = async (userId: string) => {
  const response = await fetchOnAPI(`/api/admin/season-seat/start?userId=${userId}`, {
    method: 'POST',
  });

  const response_body = await response.text();
  if (!response.ok) {
    await addRequestLog(response, 'POST', '');
    throw new Error(response_body);
  }

  await addRequestLog(response, 'POST', '');
  return response;
};

interface CheckedCrawlerSeatResponse {
  userId: string;
  isActive: boolean;
}

const checkCrawlersSeat = async () => {
  return await fetchJsonOnAPI<CheckedCrawlerSeatResponse>('/api/admin/seat/check');
};

/**
 *여석 크롤링을 시작하는 API입니다.
 * @returns
 */
export function useStartCrawlersSeat() {
  const toast = useToastNotification.getState().addToast;
  const session = getSessionConfig();

  return useMutation({
    mutationFn: () => startCrawlersSeat(session?.userId ?? ''),
    onSuccess: async () => {
      toast('여석 크롤링이 시작되었습니다.');
    },
    onError: err => console.error(err),
  });
}

/**
 *여석 크롤링을 중단하는 API입니다.
 * @returns
 */
export function useCancelCrawlersSeat() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: cancelCrawlersSeat,
    onSuccess: async () => {
      toast('여석 크롤링이 중단되었습니다.');
    },
    onError: err => console.error(err),
  });
}

/**
 *여석 크롤링 상태를 확인하는 API입니다.
 * @returns
 */
export function useCheckCrawlerSeat() {
  const isValid = isValidSession();

  return useQuery({
    queryKey: ['crawlers-sse'],
    queryFn: checkCrawlersSeat,
    select: data => data,
    staleTime: 0, // 항상 stale로 간주
    refetchInterval: REFETCH_INTERVAL,
    enabled: isValid,
  });
}

/**
 * 계절학기 여석 크롤링을 시작하는 API입니다.
 * @returns
 */
export function useStartSeasonCrawlersSeat() {
  const toast = useToastNotification.getState().addToast;
  const session = getSessionConfig();

  return useMutation({
    mutationFn: () => startSeasonCrawlersSeat(session?.userId ?? ''),
    onSuccess: async () => {
      toast('계절 여석 크롤링이 시작되었습니다.');
    },
    onError: err => console.error(err),
  });
}
