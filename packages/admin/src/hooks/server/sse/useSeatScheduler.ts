import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import useToastNotification from '@allcll/common/store/useToastNotification';

const startSseScheduler = async () => {
  return await fetchOnAPI('/api/admin/seat-scheduler/start', {
    method: 'POST',
  });
};

const cancelSseScheduler = async () => {
  return await fetchOnAPI('/api/admin/seat-scheduler/cancel', {
    method: 'POST',
  });
};

const checkSseScheduler = async () => {
  return await fetchJsonOnAPI('/api/admin/seat-scheduler/check');
};

/**
 * SSE 여석 데이터 전송 시작하는 API입니다.
 * @returns
 */
export function useStartSseScheduler() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: startSseScheduler,
    onSuccess: async () => {
      toast('여석 데이터 전송이 시작되었습니다.');
    },
    onError: err => console.error(err),
  });
}

/**
 *SSE 여석 데이터 전송 취소하는 API입니다.
 * @returns
 */
export function useCancelSseScheduler() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: cancelSseScheduler,
    onSuccess: async () => {
      toast('여석 데이터 전송이 취소되었습니다.');
    },
    onError: err => console.error(err),
  });
}

/**
 *SSE 여석 데이터 전송 여부를 확인하는 API입니다.
 * @returns
 */
export function useCheckSseScheduler() {
  return useQuery({
    queryKey: ['clawlers-sse-scheduler'],
    queryFn: checkSseScheduler,
  });
}
