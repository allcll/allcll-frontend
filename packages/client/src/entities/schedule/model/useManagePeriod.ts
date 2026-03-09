import { useBasketOpenDate } from '../api/schedule';
import { getMainPageActionsMode } from '../lib/getMainPageActionsMode';
import { usePreSeatInfo } from './usePreSeatInfo';
import { useServiceMode } from './useServiceMode';

/**
 *
 * @returns
 * period: 메인 배너 수강 신청 기간
 * mainPageRouter: 메인 페이지 라우터 정보
 * preSeat: preSeat 오픈 날짜
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
