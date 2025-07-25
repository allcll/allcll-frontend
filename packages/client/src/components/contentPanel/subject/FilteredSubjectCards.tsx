import useInfScroll from '@/hooks/useInfScroll';
import { Subject } from '@/utils/types';
import { useRef, useState } from 'react';
import ZeroListError from '../errors/ZeroListError';
import useScheduleModal from '@/hooks/useScheduleModal';

interface ISubjectCards {
  subjects: Subject[];
  isPending: boolean;
  expandToMax?: () => void;
}

export function FilteredSubjectCards({ subjects, expandToMax, isPending = false }: ISubjectCards) {
  const { visibleRows } = useInfScroll(subjects);
  const data = subjects ? subjects.slice(0, visibleRows) : [];
  const isMore = data.length < subjects.length;
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>();
  const selectedCardRef = useRef<HTMLDivElement>(null);

  if (isPending || !subjects) {
    return <div className="w-full h-100 bg-blue-100"></div>;
  }

  if (!subjects.length) {
    return <ZeroListError />;
  }

  const handleCardClick = (subject: Subject) => {
    setSelectedSubjectId(subject.subjectId);

    // openScheduleModal(subject);
    if (expandToMax) {
      expandToMax();

      setTimeout(() => {
        selectedCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {data.map(subject => {
        const isActive = selectedSubjectId === subject.subjectId;

        return (
          <FilteredSubjectCard
            key={subject.subjectId}
            subject={subject}
            isActive={isActive}
            onClick={() => handleCardClick(subject)}
            forwardedRef={isActive ? selectedCardRef : undefined}
          />
        );
      })}

      {isMore && <div className="load-more-trigger h-10 mt-4 bg-transparent" />}
    </div>
  );
}

interface ISubjectCard {
  isActive?: boolean;
  subject: Subject;
  onClick: () => void;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

function FilteredSubjectCard({ isActive, subject, onClick, forwardedRef }: ISubjectCard) {
  const color = isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-700 bg-white';
  const { saveSchedule } = useScheduleModal();

  const handleAddOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('과목 스케줄 추가');

    saveSchedule(e);
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg cursor-pointer p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col cursor-pointer ${color}`}
      onClick={onClick}
      ref={forwardedRef}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-base text-sm  sm:text-lg font-semibold">{subject.subjectName}</h3>
        <span className="text-xs sm:text-sm text-gray-500">{subject.professorName}</span>
      </div>

      <span className="text-xs sm:text-sm text-gray-500">
        {subject.lesnRoom}/{subject.lesnRoom}
      </span>
      <span className="text-xs sm:text-sm text-gray-500">
        {subject.studentYear}학년/{subject.tmNum}학점/{subject.manageDeptNm}
      </span>

      <div className="flex justify-between items-center">
        <div
          className={`w-fit rounded-xl flex items-center text-xs sm:text-sm text-gray-500 ${
            isActive ? '' : 'bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-0.5'
          }`}
        >
          {subject.tmNum}학점
        </div>

        {isActive && (
          <button
            onClick={handleAddOfficialSchedule}
            className="bg-blue-500 border-none cursor-pointer rounded-xl px-2 py-0.5 sm:px-2.5 sm:py-1 text-white text-xs sm:text-sm hover:bg-blue-600"
          >
            추가하기
          </button>
        )}
      </div>
    </div>
  );
}
