import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/utils/api.ts';

const SEC = 1000;
const MIN = 60 * SEC;

interface IPreRealSeat {
  subjectId: number;
  seat: number;
}

interface IPreRealSeatsResponse {
  subjects: IPreRealSeat[] | null;
}

function usePreRealSeats() {
  return useQuery({
    queryKey: ['preRealSeats'],
    queryFn: fetchPreRealSeats,
    staleTime: 10 * MIN,
    select: data => data?.subjects ?? null,
  });
}

async function fetchPreRealSeats(): Promise<IPreRealSeatsResponse> {
  return await fetchJsonOnPublic<IPreRealSeatsResponse>('/preSeat.json');
}

export default usePreRealSeats;
