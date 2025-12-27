import { useQuery } from '@tanstack/react-query';
import { Subject, Wishes } from '@/utils/types.ts';
import useSubject, { InitSubject } from '@/entities/subjects/model/useSubject.ts';
import { joinData } from '@/entities/subjectAggregate/lib/joinSubjects.ts';
import { fetchWishesData, WishesApiResponse } from '@/entities/wishes/api/wishes.ts';

export const InitWishes = {
  ...InitSubject,
  departmentCode: '',
  departmentName: '',
  totalCount: -1,
};

function useWishes() {
  const { data: subjects, isPending, isLoading } = useSubject();

  const query = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishesData,
    staleTime: Infinity,
    select: data => joinSubjects(data, subjects),
  });

  return {
    ...query,
    isPending: query.isPending || isPending,
    isLoading: query.isLoading || isLoading,
  };
}

const joinSubjects = (wishes?: WishesApiResponse, subject?: Subject[]): Wishes[] => {
  if (!subject) return [];
  if (!wishes || wishes.baskets?.length) return subject;

  type preWishes = Subject & WishesApiResponse['baskets'][number];
  const data = joinData(subject, wishes.baskets, InitSubject, InitWishes) as preWishes[];

  return data.map((pw: preWishes) => {
    return { ...pw, departmentCode: pw.deptCd, departmentName: pw.manageDeptNm };
  });
};

export default useWishes;
