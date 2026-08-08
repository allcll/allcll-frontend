import { useIsPreSeatCrawlingPeriod } from '@/entities/operationPeriod/model/usePreSeatPeriod';

interface IPreSeatGateOptions {
  hasSeats: boolean;
}

/**
 * preSeat의 가용성을 판단하는 훅입니다.
 * operation-period API에서 PRESEAT 기간을 조회하고
 * 기간 내 + 여석 데이터가 있으면 활성화합니다.
 */
function usePreSeatGate({ hasSeats }: IPreSeatGateOptions) {
  const isCrawlingPeriod = useIsPreSeatCrawlingPeriod();

  const isPreSeatAvailable = isCrawlingPeriod && hasSeats;

  return { isPreSeatAvailable };
}

export default usePreSeatGate;
