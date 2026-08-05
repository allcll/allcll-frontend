import { useOperationPeriods } from '@/entities/operationPeriod/api/useOperationPeriods';

const PRESEAT_START_TIME = '10:00:00';
const PRESEAT_END_TIME = '17:00:00';

export function useIsPreSeatCrawlingPeriod(): boolean {
  const today = new Date().toISOString().split('T')[0];
  const { data: periods = [] } = useOperationPeriods(today);

  const preSeatPeriod = periods.find(p => p.operationType === 'PRESEAT');

  if (!preSeatPeriod) {
    return false;
  }

  const now = new Date();
  const startDateTime = new Date(`${preSeatPeriod.startDate.split('T')[0]}T${PRESEAT_START_TIME}`);
  const endDateTime = new Date(`${preSeatPeriod.endDate.split('T')[0]}T${PRESEAT_END_TIME}`);

  return now >= startDateTime && now <= endDateTime;
}
