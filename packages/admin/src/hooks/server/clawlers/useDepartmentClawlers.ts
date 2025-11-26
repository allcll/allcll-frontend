import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CralwersParams {
  userId: string;
  year: string;
  semesterCode: string;
}

const clawlersDepartments = async ({ userId, year, semesterCode }: CralwersParams) => {
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

const getDepartments = async ({ userId, year, semesterCode }: CralwersParams) => {
  return await fetchJsonOnAPI(`/api/admin/departments?userId=${userId}&year=${year}&semesterCode=${semesterCode}`);
};

/**
 * 전체 학과를 크롤링하는 API입니다.
 * @param params
 * @returns
 */
export function useClawlersDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, year, semesterCode }: CralwersParams) => clawlersDepartments({ userId, year, semesterCode }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clawlers-departments'],
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
export function useGetDepartments(params: CralwersParams) {
  return useQuery({
    queryKey: ['clawlers-departments'],
    queryFn: () => getDepartments(params),
  });
}
