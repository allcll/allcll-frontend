import type { Wishes, IWishesInfo } from '@/shared/model/types';
import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes';
import type { IPreRealSeat } from '@/entities/seat/api/usePreRealSeats';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects';

interface DetailWishes {
  isPending: boolean;
  data?: WishesWithSeat;
  isPastSemester?: boolean;
}

type WishesWithSeat = Wishes | (Wishes & IPreRealSeat);

function useDetailWishes(wishesInfo: IWishesInfo): DetailWishes {
  const { data: wishes } = useWishes(wishesInfo.semesterCode);
  const data = useJoinPreSeats(wishes, InitWishes);

  if (!data) return { isPending: true };

  const detail = data?.find(basket => basket.subjectId === wishesInfo.subjectId);

  return {
    isPending: false,
    data: detail,
    isPastSemester: !!wishesInfo.semesterCode,
  };
}

export default useDetailWishes;
