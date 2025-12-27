import { useQuery } from '@tanstack/react-query';
import { BadRequestError } from '@/shared/lib/errors.ts';
import { fetchDetailRegisters } from '@/entities/wishes/api/wishes.ts';

function useDetailRegisters(id: string) {
  return useQuery({
    queryKey: ['detail-registers', id],
    queryFn: () => fetchDetailRegisters(id),
    staleTime: Infinity,
    retry: retryCondition,
  });
}

const retryCondition = (failureCount: number, error: Error) => {
  if (failureCount >= 3) return false;

  // error 따라서 재시도 여부 결정
  return !(error instanceof BadRequestError);
};

export default useDetailRegisters;
