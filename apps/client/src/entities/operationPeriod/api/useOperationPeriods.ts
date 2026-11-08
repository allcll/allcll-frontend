import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/shared/api/api';
import { getTodayKST } from '@/shared/lib/time';
import type { IOperationPeriodsResponse } from '@/entities/operationPeriod/model/operationPeriod';

const OPERATION_PERIOD_QUERY_KEY = ['operation-period'];

const fetchOperationPeriods = (date: string) => {
  return fetchJsonOnAPI<IOperationPeriodsResponse>(`/api/operation-period?date=${date}`);
};

/**
 * 오늘(KST) 기준 학기의 서비스별 운영 기간을 조회합니다.
 * 서비스 노출 판단과 preseat 판단이 같은 응답을 쓰도록, 조회 날짜를 훅 안에서 정해 캐시를 공유합니다.
 */
export function useOperationPeriods() {
  const today = getTodayKST();

  return useQuery({
    queryKey: [...OPERATION_PERIOD_QUERY_KEY, today],
    queryFn: () => fetchOperationPeriods(today),
    staleTime: 5 * 60 * 1000,
  });
}
