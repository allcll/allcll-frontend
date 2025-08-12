import PinCard from '@/components/live/subjectTable/PinCard.tsx';
import useInfScroll from '@/hooks/useInfScroll.ts';
import SearchSvg from '@/assets/search.svg?react';
import { WishesWithSeat } from '@/hooks/useWishesPreSeats.ts';

interface ISubjectCards {
  subjects: WishesWithSeat[];
  isPending?: boolean;
  className?: string;
}

function SubjectCards({ subjects, isPending = false, className = '' }: Readonly<ISubjectCards>) {
  return (
    <div className={'flex flex-col gap-2 ' + className}>
      <Cards subjects={subjects} isPending={isPending} />
    </div>
  );
}

function Cards({ subjects, isPending = false }: Readonly<ISubjectCards>) {
  const { visibleRows } = useInfScroll(subjects);
  const data = subjects ? subjects.slice(0, visibleRows) : [];

  if (isPending || !subjects) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 0, 0].map((_, idx) => (
          <div key={'skeleton-card-' + idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24" />
        ))}
      </div>
    );
  }

  if (!subjects.length) {
    return (
      <div className="text-center py-4">
        <div className="flex flex-col items-center">
          <SearchSvg className="w-12 h-12" />
          <p className="text-gray-500 font-bold mt-4">검색된 과목이 없습니다.</p>
          <p className="text-gray-400 text-xs mt-1">다른 검색어로 다시 시도해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.map(subject => (
        <PinCard
          key={subject.subjectId}
          subject={subject}
          seats={subject.seat ?? -1}
          disableSeat={subject.seat === undefined}
          className="bg-white"
        />
      ))}
      <div className="load-more-trigger" />
    </>
  );
}

export default SubjectCards;
