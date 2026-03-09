import { useCurrentPeriod, usePreSeatOpenDate } from '../api/schedule';
import { ServiceMode, ServicePeriod } from '../lib/manageSchedule';

export function usePreSeatInfo() {
  const now = new Date();
  const { data: currentPeriodData } = useCurrentPeriod();
  const { data: preSeatOpenDate } = usePreSeatOpenDate();

  const periods = currentPeriodData?.periods ?? [];

  const transitionPairs: [ServiceMode, ServiceMode][] = [
    [ServiceMode.REGISTRATION_SENIOR, ServiceMode.REGISTRATION_ALL],
    [ServiceMode.REGISTRATION_ALL, ServiceMode.REGISTRATION_FRESHMAN],
    [ServiceMode.REGISTRATION_FRESHMAN, ServiceMode.CORRECTION],
  ];

  let shouldPreparePreSeat = false;
  let livePeriodStart: string | null = null;

  for (const [beforeMode, afterMode] of transitionPairs) {
    const beforePeriod = periods.find((p: ServicePeriod) => p.mode === beforeMode);
    const afterPeriod = periods.find((p: ServicePeriod) => p.mode === afterMode);

    if (!beforePeriod || !afterPeriod) continue;

    if (
      now > new Date(beforePeriod.end) &&
      now < new Date(afterPeriod.start) &&
      preSeatOpenDate &&
      preSeatOpenDate <= now
    ) {
      shouldPreparePreSeat = true;
      livePeriodStart = afterPeriod.start;
      break;
    }
  }

  return {
    shouldPreparePreSeat,
    preSeatCloseDate: livePeriodStart?.split('T')[0] ?? '',
    preSeatCloseTime: livePeriodStart?.split('T')[1]?.slice(0, 5) ?? '',
    preSeatOpenDate,
  };
}
