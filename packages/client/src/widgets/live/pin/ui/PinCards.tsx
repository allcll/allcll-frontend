import useInfScroll from '@/shared/lib/useInfScroll.ts';
import { SearchIcon, Flex, Grid, EmptyState, Skeleton } from '@allcll/allcll-ui';
import { WishesWithSeat } from '@/entities/subjectAggregate/model/useWishesPreSeats.ts';
import { Wishes } from '@/shared/model/types.ts';
import PinCard from '@/features/live/pin/ui/PinCard';

interface IPinCards {
  subjects: Wishes[] | WishesWithSeat[];
  isPending?: boolean;
  className?: string;
  isLive?: boolean;
}

function PinCards({ subjects, isPending = false, className = '', isLive = false }: Readonly<IPinCards>) {
  return (
    <Flex direction="flex-col" gap="gap-2" className={className}>
      <Cards subjects={subjects} isPending={isPending} isLive={isLive} />
    </Flex>
  );
}

function Cards({ subjects, isPending = false, isLive = false }: Readonly<IPinCards>) {
  const { visibleRows, loadMoreRef } = useInfScroll(subjects);
  const data = subjects ? subjects.slice(0, visibleRows) : [];

  if (isPending || !subjects) {
    return (
      <Grid columns={{ base: 1, md: 3 }} gap="gap-4">
        {[0, 0, 0].map((_, idx) => (
          <Skeleton key={'skeleton-card-' + idx} className="h-24 rounded-lg" />
        ))}
      </Grid>
    );
  }

  if (!subjects.length) {
    return (
      <EmptyState
        icon={SearchIcon}
        title="검색된 과목이 없습니다."
        description="다른 검색어로 다시 시도해보세요."
        className="py-4"
      />
    );
  }

  return (
    <>
      {data.map((subject: Wishes | WishesWithSeat) => (
        <PinCard
          key={subject.subjectId}
          subject={subject}
          seats={'seat' in subject ? (subject.seat ?? -1) : -1}
          disableSeat={!('seat' in subject)}
          className="bg-white"
          isLive={isLive}
        />
      ))}
      <div ref={loadMoreRef} className="load-more-trigger opacity-0">
        불러오는 중
      </div>
    </>
  );
}

export default PinCards;
