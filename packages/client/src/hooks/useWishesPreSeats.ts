import { useMemo } from 'react';
import { Wishes } from '@/utils/types.ts';
import useWishes, { InitWishes } from '@/entities/wishes/api/useWishes.ts';
import { useJoinPreSeats } from '@/hooks/joinSubjects.ts';

interface TableNames {
  title: string;
  key: string;
}

export type WishesWithSeat = Wishes & { seat?: number };

function useWishesPreSeats(tableTitles: TableNames[]) {
  const { data: wishes, isPending } = useWishes();
  const data = useJoinPreSeats(wishes, InitWishes);
  const hasRealSeats = data && data[0] && 'seat' in data[0];

  const titles = useMemo(() => {
    if (!hasRealSeats) return tableTitles;

    return [...tableTitles, { title: '여석', key: 'seat' }];
  }, [data, tableTitles]);

  return { data, titles, isPending, hasRealSeats };
}

export default useWishesPreSeats;
