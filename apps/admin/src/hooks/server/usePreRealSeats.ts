import { fetchJsonOnAPI } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

const SEC = 1000;
const MIN = 60 * SEC;

interface IPreRealSeat {
  subjectId: number;
  seat: number;
}

interface IPreRealSeatsResponse {
  subjects: IPreRealSeat[] | null;
}

export function usePreRealSeatsJSON() {
  return useQuery({
    queryKey: ['preRealSeats'],
    queryFn: fetchPreRealSeatsJSON,
    staleTime: 10 * MIN,
    select: data => data?.subjects ?? null,
    enabled: false,
  });
}

async function fetchPreRealSeatsJSON(): Promise<IPreRealSeatsResponse> {
  const res = await fetch('/preSeat.json');
  if (!res.ok) {
    throw new Error('Failed to load local JSON file');
  }
  return res.json();
}

const fetchPreRealSeatsAPI = async () => {
  return await fetchJsonOnAPI<IPreRealSeatsResponse>('/api/pre-seat');
};

export function usePreRealSeatsAPI() {
  return useQuery({
    queryKey: ['preRealSeats-api'],
    queryFn: fetchPreRealSeatsAPI,
    staleTime: 10 * MIN,
    enabled: false,
  });
}
