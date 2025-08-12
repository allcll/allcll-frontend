import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';

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
    enabled: false, //  자동 요청을 비활성화
  });
}

async function fetchPreRealSeats(): Promise<IPreRealSeatsResponse> {
  return await fetchJsonOnAPI<IPreRealSeatsResponse>('api/preSeat');
}

export default usePreRealSeats;
