import { useQuery } from '@tanstack/react-query';
import { fetchBasketOpenDate, fetchCurrentPeriod, fetchPreSeatOpenDate } from '../lib/manageSchedule';

export function useCurrentPeriod() {
  return useQuery({
    queryKey: ['currentPeriod'],
    queryFn: fetchCurrentPeriod,
    staleTime: Infinity,
  });
}

export function usePreSeatOpenDate() {
  return useQuery({
    queryKey: ['preSeatOpenDate'],
    queryFn: fetchPreSeatOpenDate,
    staleTime: Infinity,
  });
}

export function useBasketOpenDate() {
  return useQuery({
    queryKey: ['basketOpenDate'],
    queryFn: fetchBasketOpenDate,
    staleTime: Infinity,
  });
}
