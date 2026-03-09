import { useBasketOpenDate } from '../api/schedule';
import { getMainPageActionsMode } from '../lib/getMainPageActionsMode';
import { usePreSeatInfo } from './usePreSeatInfo';
import { useServiceMode } from './useServiceMode';

/**
 *
 * @returns
 * period: 메인 배너 수강 신청 기간
 * mainPageRouter: 메인 페이지 라우터 정보
 * preSeat: 전체 여석 오픈, 클로즈 여부 및 시간
 * basket: 관심 과목 오픈 날짜
 */
export function useManagePeriod() {
  const { serviceMode, registrationDisplayPeriod } = useServiceMode();
  const preSeat = usePreSeatInfo();
  const { data: basketOpenDate } = useBasketOpenDate();

  return {
    period: {
      registrationDisplayPeriod,
    },
    mainPageRouter: {
      mainPageActionsMode: getMainPageActionsMode(serviceMode),
    },
    preSeat,
    basket: {
      basketOpenDate,
    },
  };
}
