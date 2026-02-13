import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import useToastNotification from '@allcll/common/store/useToastNotification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CralwersParams {
  userId: string;
}

const crawlingPreseat = async ({ userId }: CralwersParams) => {
  const response = await fetchOnAPI(`/api/admin/pre-seat/fetch?userId=${userId}`, {
    method: 'POST',
  });

  const response_body = await response.text();

  if (!response.ok) {
    await addRequestLog(response, 'POST', {
      userId,
    });
    throw new Error(response_body);
  }

  await addRequestLog(response, 'POST', {
    userId,
  });

  return response;
};

const getCrawleredPreseat = async ({ userId }: CralwersParams) => {
  return await fetchJsonOnAPI(`/api/admin/pre-seat/fetch?userId=${userId}`);
};

/**
 * 전체 PreSeat를 크롤링하는 API입니다.
 * @param params
 * @returns
 */
export function useCrawlersPreseat() {
  const queryClient = useQueryClient();
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: ({ userId }: CralwersParams) => crawlingPreseat({ userId }),

    onSuccess: () => {
      toast('전체 여석 크롤링에 성공하셨습니다.');

      queryClient.invalidateQueries({
        queryKey: ['crawlers-pre-seat'],
      });
    },

    onError: err => console.error(err),
  });
}

/**
 * 전체 PreSeat 크롤링 데이터를 조회하는 API입니다.
 * @param params
 * @returns
 */
export function useGetPreseat(params: CralwersParams) {
  return useQuery({
    queryKey: ['crawlers-pre-seat'],
    queryFn: () => getCrawleredPreseat(params),
  });
}
