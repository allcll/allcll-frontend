import { useOperationPeriods } from '@/entities/operationPeriod/api/useOperationPeriods';
import type { IOperationPeriodDetail } from '@/entities/operationPeriod/model/operationPeriod';

// 학년별 수강신청이 모두 끝난 시각(시작일)에 열리고, 다음 수강신청이 시작되는 시각(종료일)에 닫힙니다 (KST 고정).
// 어드민 운영기간 설정이 날짜 단위라 시각은 프론트에서 보정합니다.
export const PRESEAT_OPEN_TIME = '17:00';
export const PRESEAT_CLOSE_TIME = '10:00';

/**
 * operation-period API에서 오늘(KST) 날짜 기준 PRESEAT 운영 기간을 조회합니다.
 */
export function usePreSeatPeriod(): IOperationPeriodDetail | undefined {
  const { data } = useOperationPeriods();

  return data?.operationPeriodDetailResponses?.find(period => period.operationType === 'PRESEAT');
}

/**
 * 현재 시각이 preseat(전체학년 여석) 열림 구간인지 판단합니다.
 * 수강신청이 끝난 뒤(시작일 17:00)부터 다음 수강신청이 시작될 때(종료일 10:00)까지 이어지는 연속 구간입니다.
 */
export function useIsPreSeatOpen(): boolean {
  const preSeatPeriod = usePreSeatPeriod();

  if (!preSeatPeriod) {
    return false;
  }

  // +09:00을 명시해 기기 타임존과 무관하게 KST 기준으로 판정합니다.
  const now = new Date();
  const openAt = new Date(`${preSeatPeriod.startDate.split('T')[0]}T${PRESEAT_OPEN_TIME}:00+09:00`);
  const closeAt = new Date(`${preSeatPeriod.endDate.split('T')[0]}T${PRESEAT_CLOSE_TIME}:00+09:00`);

  // 마감 시각은 다음 수강신청이 시작되는 순간이므로, 그 시각부터는 닫힌 것으로 봅니다.
  return now >= openAt && now < closeAt;
}
