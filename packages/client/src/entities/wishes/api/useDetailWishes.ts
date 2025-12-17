import { Wishes } from '@/utils/types.ts';
import useWishes, { InitWishes } from '@/entities/wishes/api/useWishes.ts';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import { useJoinPreSeats } from '@/hooks/joinSubjects.ts';

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
