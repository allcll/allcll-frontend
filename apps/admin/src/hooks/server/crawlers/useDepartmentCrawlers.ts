import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CrawlersParams {
  userId: string;
  year: string;
  semesterCode: string;
}

const crawlersDepartments = async ({ userId, year, semesterCode }: CrawlersParams) => {
  const response = await fetchOnAPI(
    `/api/admin/departments?userId=${userId}&year=${year}&semesterCode=${semesterCode}`,
    {
      method: 'POST',
    },
  );

  const response_body = await response.text();

  if (!response.ok) {
    await addRequestLog(response, 'POST', {
      userId,
      year,
      semesterCode,
    });
    throw new Error(response_body);
  }

  await addRequestLog(response, 'POST', {
    userId,
    year,
    semesterCode,
  });

  return response;
};

const getDepartments = async ({ userId, year, semesterCode }: CrawlersParams) => {
  return await fetchJsonOnAPI(`/api/admin/departments?userId=${userId}&year=${year}&semesterCode=${semesterCode}`);
};

/**
 * 전체 학과를 크롤링하는 API입니다.
 * @param params
 * @returns
 */
export function useCrawlersDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, year, semesterCode }: CrawlersParams) => crawlersDepartments({ userId, year, semesterCode }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['crawlers-departments'],
      });
    },

    onError: err => console.error(err),
  });
}

/**
 * 전체 학과 크롤링 데이터를 조회하는 API입니다.
 * @param params
 * @returns
 */
export function useGetDepartments(params: CrawlersParams) {
  return useQuery({
    queryKey: ['crawlers-departments'],
    queryFn: () => getDepartments(params),
  });
}
