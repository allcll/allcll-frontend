import { useMemo } from 'react';
import usePreRealSeats from '@/hooks/server/usePreRealSeats.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import { Wishes } from '@/utils/types.ts';

interface TableNames {
  title: string;
  key: string;
}

export type WishesWithSeat = Wishes & { seat?: number };

function useWishesPreSeats(tableTitles: TableNames[]) {
  const { data: wishes, isPending } = useWishes();
  const { data: realSeats } = usePreRealSeats();

  const data = useMemo((): WishesWithSeat[] | undefined => {
    if (!realSeats || !wishes || wishes.length === 0) {
      return wishes;
    }

    return wishes.map(wish => {
      const target = realSeats.find(seat => seat.subjectId === wish.subjectId);
      return {
        ...wish,
        seat: target?.seat ?? -1,
      };
    });
  }, [realSeats, wishes]);

  const titles = useMemo(() => {
    if (!realSeats) return tableTitles;

    return [...tableTitles, { title: '여석', key: 'seat' }];
  }, [realSeats, tableTitles]);

  return { data, titles, isPending };
}

export default useWishesPreSeats;
