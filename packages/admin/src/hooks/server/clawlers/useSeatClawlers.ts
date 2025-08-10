import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import useToastNotification from '@allcll/common/store/useToastNotification';

const startClawlersSeat = async (userId: string) => {
  return await fetchOnAPI(`/api/admin/seat/start?userId=${userId}`);
};

const cancelClawlersSeat = async () => {
  return await fetchOnAPI('/api/admin/seat/cancel', {
    method: 'POST',
  });
};

const checkClawlersSeat = async () => {
  return await fetchJsonOnAPI('/api/admin/seat/check');
};

/**
 *여석 크롤링을 시작하는 API입니다.
 * @returns
 */
export function useStartClawlersSeat() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: (userId: string) => startClawlersSeat(userId),
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
export function useCancelClawlersSeat() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: cancelClawlersSeat,
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
export function useCheckClawlersSeat() {
  return useQuery({
    queryKey: ['clawlers-sse'],
    queryFn: checkClawlersSeat,
  });
}
