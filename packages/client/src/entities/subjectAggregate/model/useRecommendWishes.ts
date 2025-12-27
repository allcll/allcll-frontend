import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects.ts';

function useRecommendWishes(subjectCode: string, excludeSubjectIds: number[] = []) {
  const { data: wishes } = useWishes();
  const data = useJoinPreSeats(wishes, InitWishes);

  if (!data) return { isPending: true };

  const detail = data.filter(
    basket => basket.subjectCode === subjectCode && !excludeSubjectIds.includes(basket.subjectId),
  );

  return {
    isPending: false,
    data: detail,
  };
}

export default useRecommendWishes;
