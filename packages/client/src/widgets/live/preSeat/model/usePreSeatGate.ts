import { useIsPreSeatCrawlingPeriod } from '@/shared/config/preseat';

export const PRESEAT_START_TIME = '10:00';
export const PRESEAT_CLOSE_DATE = 'operation-period 설정';

/**
 * preSeat의 가용성을 판단하는 훅입니다.
 * operation-period API에서 PRESEAT 기간을 조회하고
 * 기간 내 + 여석 데이터가 있으면 활성화합니다.
 */
function usePreSeatGate(opts?: { hasSeats?: boolean }) {
  const { hasSeats } = opts ?? {};
  const isCrawlingPeriod = useIsPreSeatCrawlingPeriod();

  const isPreSeatAvailable = isCrawlingPeriod && Boolean(hasSeats);

  return { isPreSeatAvailable };
}

export default usePreSeatGate;
