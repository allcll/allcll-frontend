import { useQuery } from '@tanstack/react-query';
import { Subject, Wishes } from '@/utils/types.ts';
import { fetchJsonOnPublic } from '@/utils/api.ts';
import useSubject, { InitSubject } from '@/hooks/server/useSubject.ts';
import { joinData } from '@/hooks/joinSubjects.ts';

interface WishesApiResponse {
  baskets: { subjectId: number; totalCount: number }[];
}

export const InitWishes: Wishes = {
  ...InitSubject,
  departmentCode: '',
  departmentName: '',
  totalCount: -1,
};

const fetchWishesData = async () => {
  return await fetchJsonOnPublic<WishesApiResponse>('/baskets.json');
};

function useWishes() {
  const { data: subjects } = useSubject();

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishesData,
    staleTime: Infinity,
    select: data => joinSubjects(data, subjects),
  });
}

const joinSubjects = (wishes?: WishesApiResponse, subject?: Subject[]): Wishes[] => {
  if (!wishes || !subject) return [];

  type preWishes = Subject & WishesApiResponse['baskets'][number];
  const data = joinData(subject, wishes.baskets, InitSubject, InitWishes) as preWishes[];

  return data.map((pw: preWishes) => {
    return {
      ...pw,
      departmentCode: pw.deptCd,
      departmentName: pw.manageDeptNm,
    };
  });
};

export default useWishes;
