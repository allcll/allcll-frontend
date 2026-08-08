import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/shared/api/api.ts';
import { useIsPreSeatCrawlingPeriod } from '@/entities/operationPeriod/model/usePreSeatPeriod';

const SEC = 1000;

export interface IPreRealSeat {
  subjectId: number;
  seat: number;
}

interface IPreRealSeatsResponse {
  preSeats: IPreRealSeat[] | null;
}

export const InitPreRealSeat: IPreRealSeat = {
  subjectId: -1,
  seat: -1,
};

function usePreRealSeats() {
  const isCrawlingPeriod = useIsPreSeatCrawlingPeriod();

  return useQuery({
    queryKey: ['preRealSeats', isCrawlingPeriod],
    // nginx가 10분 캐시(max-age=600)를 내려주므로, 매 폴링마다 ETag로 재검증해 최신 데이터를 받습니다.
    queryFn: () => fetchJsonOnPublic<IPreRealSeatsResponse>('/pre-seats.json', { cache: 'no-cache' }),
    staleTime: isCrawlingPeriod ? 15 * SEC : Infinity,
    refetchInterval: isCrawlingPeriod ? 15 * SEC : false,
    retry: 2,
    retryDelay: 1000,
    select: data => data?.preSeats ?? [],
  });
}

export default usePreRealSeats;
