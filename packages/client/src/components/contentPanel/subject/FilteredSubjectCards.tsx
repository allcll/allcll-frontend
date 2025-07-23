import useInfScroll from '@/hooks/useInfScroll';
import { Subject } from '@/utils/types';
import { useState } from 'react';
import ZeroListError from '../errors/ZeroListError';

interface ISubjectCards {
  subjects: Subject[];
  isPending: boolean;
}

export function FilteredSubjectCards({ subjects, isPending = false }: ISubjectCards) {
  const { visibleRows } = useInfScroll(subjects ?? []);
  const data = subjects.slice(0, visibleRows);
  const isMore = data.length < subjects.length;
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>();

  if (isPending) return <div className="w-full h-10 bg-blue-100"></div>;
  //TODO: ZeroSubject 컴포넌트 만들기
  if (!subjects.length) return <ZeroListError />;

  return (
    <div className="w-full flex flex-col gap-1">
      {data.map(subject => (
        <FilteredSubjectCard
          key={subject.subjectId}
          subject={subject}
          isActive={selectedSubjectId === subject.subjectId}
          onClick={() => setSelectedSubjectId(subject.subjectId)}
        />
      ))}

      {isMore && <div className="load-more-trigger h-10 mt-4 bg-transparent" />}
    </div>
  );
}

interface ISubjectCard {
  isActive?: boolean;
  subject: Subject;
  onClick: () => void;
}

function FilteredSubjectCard({ isActive, subject, onClick }: ISubjectCard) {
  const color = isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-700 bg-white';

  return (
    <div
      className={`border border-gray-200 rounded-lg cursor-pointer p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col cursor-pointer ${color}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-base text-sm  sm:text-lg font-semibold">{subject.subjectName}</h3>
        <span className="text-xs sm:text-sm text-gray-500">{subject.professorName}</span>
      </div>

      <span className="text-xs sm:text-sm text-gray-500">
        {subject.lesn_time}/{subject.lesn_room}
      </span>
      <span className="text-xs sm:text-sm text-gray-500">
        {subject.semester_at}학기/{subject.tm_num}학점/{subject.departmentName}
      </span>

      <div className="flex justify-between items-center">
        <div
          className={`w-fit rounded-xl flex items-center text-xs sm:text-sm text-gray-500 ${
            isActive ? '' : 'bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-0.5'
          }`}
        >
          {subject.tm_num}학점
        </div>

        {isActive && (
          <button className="bg-blue-500 border-none cursor-pointer rounded-xl px-2 py-0.5 sm:px-2.5 sm:py-1 text-white text-xs sm:text-sm hover:bg-blue-600">
            추가하기
          </button>
        )}
      </div>
    </div>
  );
}
