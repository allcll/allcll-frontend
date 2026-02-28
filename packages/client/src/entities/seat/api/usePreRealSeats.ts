import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/shared/api/api.ts';
import { useAcademicPeriod } from '@/entities/schedule/lib/useManagePeriod';

const SEC = 1000;
const MIN = 60 * SEC;

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
  return useQuery({
    queryKey: ['preRealSeats'],
    queryFn: fetchPreRealSeats,
    staleTime: 10 * MIN,
    select: data => data?.preSeats ?? null,
  });
}

async function fetchPreRealSeats(): Promise<IPreRealSeatsResponse> {
  //preSeat 데이터 업데이트 시 preSeatOpenDate를 변경해주어야합니다.
  const { preSeat } = useAcademicPeriod();
  return await fetchJsonOnPublic<IPreRealSeatsResponse>(`/pre-seats.json?date=${preSeat.preSeatOpenDate}`);
}

export default usePreRealSeats;
