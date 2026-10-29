import { useOperationPeriods } from '@/entities/operationPeriod/api/useOperationPeriods';
import { formatMonthDayWithDay } from '@/shared/lib/time';

export interface ISchedulePeriod {
  startDate: string;
  endDate: string;
}

/** 기간을 '08/14(금) ~ 08/21(금)' 형태로 표기합니다. */
export function formatSchedulePeriod(period: ISchedulePeriod): string {
  return `${formatMonthDayWithDay(period.startDate)} ~ ${formatMonthDayWithDay(period.endDate)}`;
}

export interface ICourseSchedule {
  /** 수강신청 기간 */
  registration: ISchedulePeriod;
  /** 수강신청 확인 및 변경 기간 */
  change: ISchedulePeriod;
}

/**
 * 학교 수강신청 일정을 서비스 운영 기간에서 구합니다.
 *
 * 두 운영 기간이 일정의 네 경계를 담고 있습니다.
 * 실시간 여석이 열리는 날 수강신청이 시작되고, 전체학년 여석이 열리는 날 수강신청이 끝나며,
 * 전체학년 여석이 닫히는 날 변경 기간이 시작되고, 실시간 여석이 닫히는 날 변경 기간이 끝납니다.
 *
 * ```
 * LIVE     8/14 ─────────────────────── 9/7
 * PRESEAT           8/21 ──── 9/2
 *          └ 수강신청 ┘       └ 변경기간 ┘
 * ```
 */
export function useCourseSchedule(): ICourseSchedule | undefined {
  const { data } = useOperationPeriods();
  const periods = data?.operationPeriodDetailResponses ?? [];

  const live = periods.find(period => period.operationType === 'LIVE');
  const preSeat = periods.find(period => period.operationType === 'PRESEAT');

  if (!live || !preSeat) {
    return undefined;
  }

  return {
    registration: { startDate: live.startDate, endDate: preSeat.startDate },
    change: { startDate: preSeat.endDate, endDate: live.endDate },
  };
}
