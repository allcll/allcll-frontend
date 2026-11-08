import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/shared/api/api.ts';
import { useIsPreSeatOpen } from '@/entities/operationPeriod/model/usePreSeatPeriod';

const MIN = 60 * 1000;

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
  const isPreSeatOpen = useIsPreSeatOpen();

  return useQuery({
    queryKey: ['preRealSeats', isPreSeatOpen],
    // nginx가 10분 캐시(max-age=600)를 내려주므로, 매 폴링마다 ETag로 재검증해 최신 데이터를 받습니다.
    queryFn: () => fetchJsonOnPublic<IPreRealSeatsResponse>('/pre-seats.json', { cache: 'no-cache' }),
    // 어드민이 새 스냅샷을 배포할 때만 바뀌는 데이터라 열림 구간에도 10분 주기면 충분합니다.
    staleTime: isPreSeatOpen ? 10 * MIN : Infinity,
    refetchInterval: isPreSeatOpen ? 10 * MIN : false,
    retry: 2,
    retryDelay: 1000,
    select: data => data?.preSeats ?? [],
  });
}

export default usePreRealSeats;
