import { Wishes } from '@/shared/model/types.ts';
import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { IPreRealSeat } from '@/entities/seat/api/usePreRealSeats';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects.ts';
import { WishesInfo } from '@/features/wish/model/useWishesInfo';

interface DetailWishes {
  isPending: boolean;
  data?: WishesWithSeat;
  isLastSemesterWish?: boolean;
}

type WishesWithSeat = Wishes | (Wishes & IPreRealSeat);

function useDetailWishes(wishesInfo: WishesInfo): DetailWishes {
  const { data: wishes } = useWishes(wishesInfo.semesterCode);
  const data = useJoinPreSeats(wishes, InitWishes);

  if (!data) return { isPending: true };

  const detail = data?.find(basket => basket.subjectId === wishesInfo.subjectId);

  return {
    isPending: false,
    data: detail,
    isLastSemesterWish: !!wishesInfo.semesterCode,
  };
}

export default useDetailWishes;
