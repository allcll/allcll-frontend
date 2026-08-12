import { useOperationPeriods } from '@/entities/operationPeriod/api/useOperationPeriods';
import type { IOperationPeriodDetail } from '@/entities/operationPeriod/model/operationPeriod';

// 본수강신청이 끝나는 시각(시작일)에 열리고, 수강 변경(정정) 신청이 시작되는 시각(종료일)에 닫힙니다 (KST 고정).
// 어드민 운영기간 설정이 날짜 단위라 시각은 프론트에서 보정합니다.
export const PRESEAT_OPEN_TIME = '17:00';
export const PRESEAT_CLOSE_TIME = '10:00';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** toISOString()은 UTC 기준이라 KST 00~09시에 전날 날짜가 되므로, KST로 보정한 뒤 날짜를 추출합니다. */
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
 * 현재 시각이 preseat(전체학년 여석) 열림 구간인지 판단합니다.
 * 본수강신청 마지막 날 마감(시작일 17:00)부터 수강 변경 시작(종료일 10:00)까지 이어지는 연속 구간입니다.
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

  return now >= openAt && now <= closeAt;
}
