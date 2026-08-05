import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/shared/api/api.ts';
import { useIsPreSeatCrawlingPeriod } from '@/shared/config/preseat';

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
    queryFn: () => fetchJsonOnPublic<IPreRealSeatsResponse>('/pre-seats.json'),
    staleTime: isCrawlingPeriod ? 15 * SEC : Infinity,
    refetchInterval: isCrawlingPeriod ? 15 * SEC : false,
    retry: 2,
    retryDelay: 1000,
    select: data => data?.preSeats ?? [],
  });
}

export default usePreRealSeats;
