import { useQuery } from '@tanstack/react-query';
import { Subject, Wishes } from '@/utils/types.ts';
import { fetchJsonOnPublic } from '@/utils/api.ts';
import useSubject from '@/hooks/server/useSubject.ts';

interface WishesApiResponse {
  baskets: { subjectId: number; totalCount: number }[];
}

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

  return subject.map((subject: Subject) => {
    const wish = wishes.baskets.find(wish => wish.subjectId === subject.subjectId);
    return {
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      departmentName: subject.manageDeptNm,
      departmentCode: subject.deptCd,
      subjectCode: subject.subjectCode,
      classCode: subject.classCode,
      professorName: subject.professorName,
      totalCount: wish?.totalCount || 0,
    };
  });
};

export default useWishes;
