import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/shared/api/api';
import type { IOperationPeriodsResponse } from '../model/operationPeriod';

const OPERATION_PERIOD_QUERY_KEY = ['operation-period'];

const fetchOperationPeriods = (date: string) => {
  return fetchJsonOnAPI<IOperationPeriodsResponse>(`/api/operation-period?date=${date}`);
};

export function useOperationPeriods(date: string) {
  return useQuery({
    queryKey: [...OPERATION_PERIOD_QUERY_KEY, date],
    queryFn: () => fetchOperationPeriods(date),
    select: data => data.operationPeriodDetailResponses,
    staleTime: 5 * 60 * 1000,
  });
}
