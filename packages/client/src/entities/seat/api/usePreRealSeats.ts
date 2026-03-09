import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/shared/api/api.ts';
import { useManagePeriod } from '@/entities/schedule/model/useManagePeriod';

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
  const { preSeat } = useManagePeriod();

  return useQuery({
    queryKey: ['preRealSeats'],
    queryFn: () => fetchPreRealSeats(preSeat.preSeatOpenDate),
    staleTime: 10 * MIN,
    select: data => data?.preSeats ?? null,
  });
}

async function fetchPreRealSeats(preSeatOpenDate: Date): Promise<IPreRealSeatsResponse> {
  //preSeat 데이터 업데이트 시 preSeatOpenDate를 변경해주어야합니다.
  return await fetchJsonOnPublic<IPreRealSeatsResponse>(`/pre-seats.json?date=${preSeatOpenDate}`);
}

export default usePreRealSeats;
