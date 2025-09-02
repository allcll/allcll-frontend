import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/utils/api.ts';

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
  return await fetchJsonOnPublic<IPreRealSeatsResponse>('/pre-seats.json');
}

export default usePreRealSeats;
