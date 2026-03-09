import { useCurrentPeriod } from '../api/schedule';
import { ServiceMode, ServicePeriod } from '../lib/manageSchedule';

/**
 * 전체 학년 수강 신청 기간, 신입생 수강 신청 기간, 수강 정정 기간 등 각 기간에 따른 모드를 반환하는 커스텀 훅입니다.
 * @returns
 */
export const useServiceMode = () => {
  const now = new Date();
  const { data: currentPeriodData } = useCurrentPeriod();

  const currentPeriod =
    currentPeriodData?.periods.find((period: ServicePeriod) => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      return now >= start && now <= end;
    }) || null;

  const currentMode = currentPeriod?.mode || ServiceMode.WISHLIST;

  return {
    activePeriod: currentPeriod,
    serviceMode: currentMode,
    registrationDisplayPeriod: currentPeriodData?.displayPeriod,
  };
};
