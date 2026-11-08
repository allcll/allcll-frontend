import { useMemo } from 'react';
import { Wishes } from '@/shared/model/types.ts';
import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import usePreRealSeats from '@/entities/seat/api/usePreRealSeats.ts';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects.ts';

interface TableNames {
  title: string;
  key: string;
}

export type WishesWithSeat = Wishes & { seat?: number };

function useWishesPreSeats(tableTitles: TableNames[]) {
  const { data: wishes, isPending: isWishesPending } = useWishes();
  const { data: preSeats, isPending: isPreSeatsPending } = usePreRealSeats();
  const data = useJoinPreSeats(wishes, InitWishes);
  const hasRealSeats = !!preSeats?.length;

  const titles = useMemo(() => {
    if (!hasRealSeats) return tableTitles;

    return [...tableTitles, { title: '여석', key: 'seat' }];
  }, [hasRealSeats, tableTitles]);

  // 여석 열 유무가 정해지기 전에 스켈레톤이 끝나면 열 수가 바뀌어 보이므로 여석 데이터까지 기다림
  return { data, titles, isPending: isWishesPending || isPreSeatsPending, hasRealSeats };
}

export default useWishesPreSeats;
