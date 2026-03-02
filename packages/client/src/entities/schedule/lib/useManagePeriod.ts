import { BASKET_OPEN_DATE, CURRENT_PERIOD, PRESEAT_OPEN_DATE, ServiceMode, ServicePeriod } from '../manageSchedule';

interface MainAction {
  label: string;
  link: string;
}

function getMainActions(mode: ServicePeriod['mode']): MainAction[] {
  switch (mode) {
    case ServiceMode.WISHLIST:
      return [
        { label: '관심과목 담기', link: '/wishlist' },
        { label: '수강 신청 연습하기', link: '/simulation' },
      ];

    case ServiceMode.REGISTRATION_SENIOR:
    case ServiceMode.REGISTRATION_ALL:
    case ServiceMode.REGISTRATION_FRESHMAN:
    case ServiceMode.CORRECTION:
      return [
        { label: '실시간 여석 확인하기', link: '/live' },
        { label: '수강 신청 연습하기', link: '/simulation' },
      ];

    default:
      return [
        { label: '전체 학년 여석 확인하기', link: '/live' },
        { label: '수강 신청 연습하기', link: '/simulation' },
      ];
  }
}

export function useManagePeriod() {
  const now = new Date();

  const currentPeriod =
    CURRENT_PERIOD.periods.find(period => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      return now >= start && now <= end;
    }) || null;

  const currentMode = currentPeriod?.mode || ServiceMode.WISHLIST;

  const mainActions = getMainActions(currentMode);

  // preSeat 준비 여부 판단
  // 각 수강신청 기간 종료 이후 ~ 다음 기간 시작 전 사이에 true 반환
  const getPreSeatInfo = (): { shouldPreparePreSeat: boolean; livePeriodStart: string | null } => {
    const periods = CURRENT_PERIOD.periods;

    const transitionPairs: [ServiceMode, ServiceMode][] = [
      [ServiceMode.REGISTRATION_SENIOR, ServiceMode.REGISTRATION_ALL],
      [ServiceMode.REGISTRATION_ALL, ServiceMode.REGISTRATION_FRESHMAN],
      [ServiceMode.REGISTRATION_FRESHMAN, ServiceMode.CORRECTION],
    ];

    for (const [beforeMode, afterMode] of transitionPairs) {
      const beforePeriod = periods.find(p => p.mode === beforeMode);
      const afterPeriod = periods.find(p => p.mode === afterMode);

      if (!beforePeriod || !afterPeriod) continue;

      if (now > new Date(beforePeriod.end) && now < new Date(afterPeriod.start) && PRESEAT_OPEN_DATE <= now) {
        return { shouldPreparePreSeat: true, livePeriodStart: afterPeriod.start };
      }
    }

    return { shouldPreparePreSeat: false, livePeriodStart: null };
  };

  const { shouldPreparePreSeat, livePeriodStart } = getPreSeatInfo();
  const preSeatCloseDate = livePeriodStart?.split('T')[0] ?? '';
  const liveStartTime = livePeriodStart?.split('T')[1]?.slice(0, 5) ?? '';

  return {
    period: {
      mode: currentMode,
      period: currentPeriod,
      displayPeriod: CURRENT_PERIOD.displayPeriod,
    },
    mainPageRouter: {
      mainPageActions: mainActions,
    },
    preSeat: {
      shouldPreparePreSeat,
      preSeatCloseDate,
      liveStartTime,
      preSeatOpenDate: PRESEAT_OPEN_DATE,
    },
    basket: {
      basketOpenDate: BASKET_OPEN_DATE,
    },
  };
}
