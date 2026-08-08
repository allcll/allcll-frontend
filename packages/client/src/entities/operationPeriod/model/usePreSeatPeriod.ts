import { useOperationPeriods } from '@/entities/operationPeriod/api/useOperationPeriods';
import type { IOperationPeriodDetail } from '@/entities/operationPeriod/model/operationPeriod';

// preseat 여석 크롤링 운영 시간 (KST 고정)
export const PRESEAT_START_TIME = '10:00';
export const PRESEAT_END_TIME = '17:00';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// toISOString()은 UTC 기준이라 KST 00~09시에 전날 날짜가 되므로, KST로 보정한 뒤 날짜를 추출합니다.
const getTodayKST = () => {
  return new Date(Date.now() + KST_OFFSET_MS).toISOString().split('T')[0];
};

/**
 * operation-period API에서 오늘(KST) 날짜 기준 PRESEAT 운영 기간을 조회합니다.
 */
export function usePreSeatPeriod(): IOperationPeriodDetail | undefined {
  const { data: periods = [] } = useOperationPeriods(getTodayKST());

  return periods.find(period => period.operationType === 'PRESEAT');
}

/**
 * 현재 시각이 preseat 여석 크롤링 시간(운영 기간 내 매일 10:00~17:00)인지 판단합니다.
 * 크롤러가 도는 시간에만 true를 반환해, 밤 시간의 무의미한 폴링을 막습니다.
 */
export function useIsPreSeatCrawlingPeriod(): boolean {
  const preSeatPeriod = usePreSeatPeriod();

  if (!preSeatPeriod) {
    return false;
  }

  const today = getTodayKST();
  const startDate = preSeatPeriod.startDate.split('T')[0];
  const endDate = preSeatPeriod.endDate.split('T')[0];
  const isInDateRange = startDate <= today && today <= endDate;

  // +09:00을 명시해 기기 타임존과 무관하게 KST 기준으로 판정합니다.
  const now = new Date();
  const crawlStart = new Date(`${today}T${PRESEAT_START_TIME}:00+09:00`);
  const crawlEnd = new Date(`${today}T${PRESEAT_END_TIME}:00+09:00`);

  return isInDateRange && now >= crawlStart && now <= crawlEnd;
}
