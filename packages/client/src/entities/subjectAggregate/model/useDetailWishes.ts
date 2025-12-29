import { Wishes } from '@/utils/types.ts';
import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { IPreRealSeat } from '@/entities/seat/api/usePreRealSeats';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects.ts';

interface DetailWishes {
  isPending: boolean;
  data?: WishesWithSeat;
  isLastSemesterWish?: boolean;
}

type WishesWithSeat = Wishes | (Wishes & IPreRealSeat);

function useDetailWishes(id: string): DetailWishes {
  const { data: wishes } = useWishes();
  const data = useJoinPreSeats(wishes, InitWishes);

  if (!data) return { isPending: true };

  const detail = data?.find(basket => basket.subjectId === Number(id));

  return {
    isPending: false,
    data: detail,
    isLastSemesterWish: !detail,
  };
}

export default useDetailWishes;
