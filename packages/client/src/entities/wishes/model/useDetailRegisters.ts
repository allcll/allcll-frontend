import { useQuery } from '@tanstack/react-query';
import { IWishesInfo } from '@/shared/model/types';
import { fetchDetailRegisters } from '@/entities/wishes/api/wishes.ts';
import { BadRequestError, NotFoundError } from '@/shared/lib/errors.ts';

function useDetailRegisters(wishesInfo: IWishesInfo) {
  return useQuery({
    queryKey: ['detail-registers', wishesInfo.subjectId],
    queryFn: () => fetchDetailRegisters(wishesInfo.subjectId),
    staleTime: Infinity,
    retry: retryCondition,
  });
}

const retryCondition = (failureCount: number, error: Error) => {
  if (failureCount >= 3) return false;

  // error 따라서 재시도 여부 결정
  return !(error instanceof BadRequestError || error instanceof NotFoundError);
};

export default useDetailRegisters;
