import { WishesInfo } from '@/features/wish/model/useWishesInfo';
import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects.ts';
import useDetailWishes from '@/entities/subjectAggregate/model/useDetailWishes.ts';

/** subjectId 에 대한 추천 과목을 반환합니다. */
function useRecommendWishes(wishesInfo: WishesInfo) {
  const { data: wishes } = useWishes(wishesInfo.semesterCode);
  const data = useJoinPreSeats(wishes, InitWishes);

  // fixme: subjectCode 를 구하기 위한 용도.
  const { data: wish } = useDetailWishes(wishesInfo);
  const subjectCode = wish?.subjectCode ?? '';

  if (!data) return { isPending: true };

  const detail = data.filter(basket => basket.subjectCode === subjectCode && basket.subjectId !== wishesInfo.subjectId);

  return {
    isPending: false,
    data: detail,
  };
}

export default useRecommendWishes;
