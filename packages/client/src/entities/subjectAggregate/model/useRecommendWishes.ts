import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects.ts';
import useDetailWishes from '@/entities/subjectAggregate/model/useDetailWishes.ts';
import { useSemesterNameBySubjectId } from '@/entities/semester/model/useSemesterNameBySubjectId.ts';

// Todo: Subject 부분은 따로 분리하기
/** subjectId 에 대한 추천 과목을 반환합니다. */
function useRecommendWishes(subjectId: number) {
  const { semesterCode } = useSemesterNameBySubjectId(subjectId);
  console.log('useDetailWishes called with subjectId:', subjectId, 'semesterCode:', semesterCode);

  const { data: wishes } = useWishes(semesterCode);
  const { data: wish } = useDetailWishes(subjectId, semesterCode);
  const data = useJoinPreSeats(wishes, InitWishes);

  const subjectCode = wish?.subjectCode ?? '';

  if (!data) return { isPending: true };

  const detail = data.filter(basket => basket.subjectCode === subjectCode && basket.subjectId !== subjectId);

  return {
    isPending: false,
    data: detail,
  };
}

export default useRecommendWishes;
