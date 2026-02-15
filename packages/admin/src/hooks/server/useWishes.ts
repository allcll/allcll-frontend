import { useQuery } from '@tanstack/react-query';
import { SubjectApiResponse, Wishes } from '@/utils/type.ts';
import { fetchJsonOnAPI, fetchJsonOnPublic } from '@/utils/api.ts';
import useSubject from '@/hooks/server/useSubject.ts';

interface WishesApiResponse {
  baskets: { subjectId: number; totalCount: number }[];
}

const fetchJSONWishesData = async () => {
  return await fetchJsonOnPublic<WishesApiResponse>('/baskets.json');
};

export function useWishesJSON() {
  const { data: subjects } = useSubject();

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchJSONWishesData,
    staleTime: Infinity,
    select: data => joinSubjects(data, subjects),
    enabled: false, //  자동 요청을 비활성화
  });
}

const joinSubjects = (wishes?: WishesApiResponse, subject?: SubjectApiResponse[]): Wishes[] => {
  if (!wishes || !subject) return [];

  return subject.map((subject: SubjectApiResponse) => {
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

/**
 * 백엔드 서버로 보내는 관심과목 API입니다.
 * @returns
 */
const fetchWishesData = async () => {
  return await fetchJsonOnAPI<WishesApiResponse>('/api/baskets');
};

export function useWishesAPI() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishesData,
    staleTime: Infinity,
    enabled: false,
  });
}
