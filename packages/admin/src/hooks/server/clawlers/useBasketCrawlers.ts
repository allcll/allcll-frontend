import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import useToastNotification from '@allcll/common/store/useToastNotification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CralwersParams {
  userId: string;
}

const crawlingBasket = async ({ userId }: CralwersParams) => {
  const response = await fetchOnAPI(`/api/admin/basket?userId=${userId}`, {
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

const getCrawleredBasket = async ({ userId }: CralwersParams) => {
  return await fetchJsonOnAPI(`/api/admin/basket?userId=${userId}`);
};

/**
 * 관심과목을 크롤링하는 API입니다.
 * @param params
 * @returns
 */
export function useCrawlersBasket() {
  const queryClient = useQueryClient();
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: ({ userId }: CralwersParams) => crawlingBasket({ userId }),

    onSuccess: () => {
      toast('관심과목 크롤링에 성공하셨습니다..');

      queryClient.invalidateQueries({
        queryKey: ['crawlers-basket'],
      });
    },

    onError: err => console.error(err),
  });
}

/**
 * 전체 Basket 크롤링 데이터를 조회하는 API입니다.
 * @param params
 * @returns
 */
export function useGetBasket(params: CralwersParams) {
  return useQuery({
    queryKey: ['crawlers-basket'],
    queryFn: () => getCrawleredBasket(params),
  });
}
