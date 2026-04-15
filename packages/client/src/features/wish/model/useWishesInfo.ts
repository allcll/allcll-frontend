import { useParams } from 'react-router-dom';
import { useSemesterNameBySubjectId } from '@/entities/semester/model/useSemesterNameBySubjectId';

export interface WishesInfo {
  subjectId: number;
  semesterCode: string | undefined;
  semesterValue: string | undefined;
  isLastSemesterWish: boolean;
}

// 관심과목 상세 페이지에서 subjectId와 semesterCode를 가져오는 커스텀 훅
// 다른 훅을 사용할 때, 정보를 주입
function useWishesInfo(): WishesInfo {
  const params = useParams();
  const subjectId = Number(params.id ?? '-1');

  const semester = useSemesterNameBySubjectId(subjectId);
  const isLastSemesterWish = Boolean(semester.semesterCode); // undefined이면 현재 학기 관심과목

  return {
    subjectId,
    ...semester,
    isLastSemesterWish,
  };
}

export default useWishesInfo;
