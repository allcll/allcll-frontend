import { useQuery } from '@tanstack/react-query';
import { Subject, Wishes } from '@/shared/model/types.ts';
import useSubject, { InitSubject } from '@/entities/subjects/model/useSubject.ts';
import { joinData } from '@/entities/subjectAggregate/lib/joinSubjects.ts';
import { fetchWishesDataBySemester, WishesApiResponse } from '@/entities/wishes/api/wishes.ts';
import { RECENT_SEMESTERS } from '@/entities/semester/api/semester';

export const InitWishes = {
  ...InitSubject,
  departmentCode: '',
  departmentName: '',
  totalCount: -1,
};

function useWishes(semester?: string) {
  semester = semester ?? RECENT_SEMESTERS.semesterCode;
  const { data: subjects, isPending, isLoading } = useSubject(semester);

  const query = useQuery({
    queryKey: ['wishlist', semester],
    queryFn: () => fetchWishesDataBySemester(semester),
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
  const baskets = wishes?.baskets ?? [];

  type preWishes = Subject & WishesApiResponse['baskets'][number];
  const data = joinData(subject, baskets, InitSubject, InitWishes) as preWishes[];

  return data.map((pw: preWishes) => {
    return { ...pw, departmentCode: pw.deptCd, departmentName: pw.manageDeptNm };
  });
};

export default useWishes;
