import useInfScroll from '@/shared/lib/useInfScroll.ts';
import SearchSvg from '@/assets/search.svg?react';
import { WishesWithSeat } from '@/hooks/useWishesPreSeats.ts';
import { Wishes } from '@/utils/types.ts';
import { Flex, Grid } from '@allcll/allcll-ui';
import PinCard from './PinCard';

interface ISubjectCards {
  subjects: Wishes[] | WishesWithSeat[];
  isPending?: boolean;
  className?: string;
  isLive?: boolean;
}

function SubjectCards({ subjects, isPending = false, className = '', isLive = false }: Readonly<ISubjectCards>) {
  return (
    <Flex direction="flex-col" gap="gap-2" className={className}>
      <Cards subjects={subjects} isPending={isPending} isLive={isLive} />
    </Flex>
  );
}

function Cards({ subjects, isPending = false, isLive = false }: Readonly<ISubjectCards>) {
  const { visibleRows, loadMoreRef } = useInfScroll(subjects);
  const data = subjects ? subjects.slice(0, visibleRows) : [];

  if (isPending || !subjects) {
    return (
      <Grid columns={{ base: 1, md: 3 }} gap="gap-4" className="animate-pulse">
        {[0, 0, 0].map((_, idx) => (
          <div key={'skeleton-card-' + idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24" />
        ))}
      </Grid>
    );
  }

  if (!subjects.length) {
    return (
      <Flex direction="flex-col" align="items-center" gap="gap-2" className="text-center py-4">
        <SearchSvg className="w-12 h-12" />
        <p className="text-gray-500 font-bold mt-4">검색된 과목이 없습니다.</p>
        <p className="text-gray-400 text-xs mt-1">다른 검색어로 다시 시도해보세요.</p>
      </Flex>
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

export default SubjectCards;
