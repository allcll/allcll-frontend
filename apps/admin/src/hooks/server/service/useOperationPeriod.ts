import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastNotification } from '@allcll/common';
import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import type { OperationType } from '@/hooks/server/useAdminReviews';

export const SERVICE_OPERATIONS: { operationType: OperationType; label: string }[] = [
  { operationType: 'TIMETABLE', label: '시간표' },
  { operationType: 'BASKETS', label: '관심과목' },
  { operationType: 'SIMULATION', label: '올클연습' },
  { operationType: 'LIVE', label: '실시간' },
  { operationType: 'PRESEAT', label: 'pre seat' },
];

export const SERVICE_OPERATION_TYPES = SERVICE_OPERATIONS.map(({ operationType }) => operationType);

export const SERVICE_OPERATION_LABEL: Record<string, string> = Object.fromEntries(
  SERVICE_OPERATIONS.map(({ operationType, label }) => [operationType, label]),
);

export interface IOperationPeriodDetail {
  operationType: OperationType;
  startDate: string; // LocalDateTime (YYYY-MM-DDTHH:mm:ss)
  endDate: string;
  message: string | null;
}

export interface IOperationPeriodsResponse {
  semesterCode: string | null;
  semesterKoreanName: string | null;
  operationPeriodDetailResponses: IOperationPeriodDetail[];
}

export interface IOperationPeriodRequest {
  operationType: OperationType;
  startDate: string;
  endDate: string;
  message: string | null;
}

const OPERATION_PERIOD_QUERY_KEY = ['operation-period'];

const fetchOperationPeriods = (date: string) => {
  return fetchJsonOnAPI<IOperationPeriodsResponse>(`/api/operation-period?date=${date}`);
};

// GET /api/operation-period
export function useOperationPeriods(date: string) {
  return useQuery({
    queryKey: [...OPERATION_PERIOD_QUERY_KEY, date],
    queryFn: () => fetchOperationPeriods(date),
    select: data => data.operationPeriodDetailResponses,
    staleTime: 5 * 60 * 1000,
  });
}

const postOperationPeriod = async (semesterCode: string, body: IOperationPeriodRequest) => {
  const response = await fetchOnAPI(`/api/admin/operation-period?semesterCode=${semesterCode}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  await addRequestLog(response, 'POST', body);

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

// POST /api/admin/operation-period (일괄 저장 API가 없어 operationType당 순차 호출)
export function useSaveOperationPeriods() {
  const toast = useToastNotification.getState().addToast;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ semesterCode, periods }: { semesterCode: string; periods: IOperationPeriodRequest[] }) => {
      for (const period of periods) {
        await postOperationPeriod(semesterCode, period);
      }
    },
    onSuccess: () => {
      toast('서비스 운영 기간이 저장되었습니다.', 'operation-period-save-success');
    },
    onError: err => {
      console.error(err);
      toast(
        '서비스 운영 기간 저장에 실패했습니다. 저장된 내용은 목록에서 확인해주세요.',
        'operation-period-save-error',
      );
    },
    // 중간에 실패해도 이미 저장된 만큼은 서버 상태와 맞춰야 함
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: OPERATION_PERIOD_QUERY_KEY });
    },
  });
}
