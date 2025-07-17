import useInfScroll from '@/hooks/useInfScroll';
import { Wishes } from '@/utils/types';
import { WishesWithSeat } from '@/hooks/useWishesPreSeats.ts';
import { ZeroElementRow } from '@/components/wishTable/Table';

interface ISubjectCard {
  isActive?: boolean;
  subject: Wishes;
}

interface ISubjectCards {
  subjects: WishesWithSeat[];
  isPending: boolean;
}

export function FilteredSubjectCards({ subjects, isPending = false }: ISubjectCards) {
  const { visibleRows } = useInfScroll(subjects ?? []);
  const data = subjects.slice(0, visibleRows);
  const isMore = data.length < subjects.length;

  if (isPending) return <div className="w-full h-10 bg-blue-100"></div>;
  if (!subjects.length) return <ZeroElementRow col={subjects.length} />;

  return (
    <div className="w-full flex flex-col gap-1">
      {data.map(subject => (
        <FilteredSubjectCard key={subject.subjectId} subject={subject} isActive={false} />
      ))}

      {isMore && <div className="load-more-trigger h-40 mt-4 bg-transparent" />}
    </div>
  );
}

function FilteredSubjectCard({ isActive, subject }: ISubjectCard) {
  const color = isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-700 bg-whtie';

  return (
    <div className={`border-gray-200 rounded-lg border-1 cursor-pointer p-4 gap-3 flex flex-col ${color}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{subject.subjectName}</h3>
        <span className="text-sm text-gray-500">{subject.professorName}</span>
      </div>
      <span className="text-sm text-gray-500 "> 강의 시간 /강의실</span>
      <div className="flex justify-between">
        <div
          className={`w-fit rounded-xl flex items-center text-gray-500 text-xs ${isActive ? 'bg-none' : 'bg-gray-100 px-2.5 py-0.5 '}`}
        >
          학점:3
        </div>
        {isActive && (
          <button className="bg-blue-500 border-none cursor-pointer rounded-xl px-2.5 py-1 text-white text-xs hover:bg-blue-600">
            추가하기
          </button>
        )}
      </div>
    </div>
  );
}
