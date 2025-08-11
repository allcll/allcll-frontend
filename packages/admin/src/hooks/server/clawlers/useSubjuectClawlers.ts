import { fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClawlersParams } from './useDepartmentClawlers';

const subjectClawlers = async ({ userId, year, semesterCode }: ClawlersParams) => {
  const response = await fetchOnAPI(`/api/admin/subjects?userId=${userId}&year=${year}&semesterCode=${semesterCode}`, {
    method: 'POST',
  });

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

/**
 *여석 크롤링을 시작하는 API입니다.
 * @returns
 */
export function useSubjectsClawlers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, year, semesterCode }: ClawlersParams) => subjectClawlers({ userId, year, semesterCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clawlers-subjects'],
      });
    },
    onError: err => console.error(err),
  });
}
