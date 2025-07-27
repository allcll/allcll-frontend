import React, { useRef } from 'react';
import ZeroListError from '../errors/ZeroListError';
import useInfScroll from '@/hooks/useInfScroll'; // 수정된 useInfScroll import
import useScheduleModal from '@/hooks/useScheduleModal';
import { useScheduleState } from '@/store/useScheduleState';
import { ScheduleAdapter, TimeslotAdapter } from '@/utils/timetable/adapter.ts';
import { Subject } from '@/utils/types';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

interface ISubjectCards {
  subjects: Subject[];
  isPending: boolean;
  expandToMax?: () => void;
}

export function FilteredSubjectCards({ subjects, expandToMax, isPending = false }: ISubjectCards) {
  // useInfScroll에서 visibleRows와 loadMoreRef를 가져옴
  const { visibleRows, loadMoreRef } = useInfScroll(subjects);

  const selectedCardRef = useRef<HTMLDivElement>(null);
  const schedule = useScheduleState(state => state.schedule);
  const selectedSubjectId = schedule.subjectId;
  const { openScheduleModal } = useScheduleModal();

  if (isPending || !subjects) {
    return <div className="w-full h-10"></div>;
  }

  if (!subjects.length) {
    return <ZeroListError />;
  }

  const handleCardClick = (subject: Subject) => {
    const newSchedule = new ScheduleAdapter(
      {
        ...new ScheduleAdapter().toApiData(), // Default schedule
        scheduleId: -1,
        scheduleType: 'official',
        subjectId: subject.subjectId,
      },
      subject,
    );

    openScheduleModal(newSchedule.toUiData());
    console.log('official', schedule);

    const MIN_TIME = 9;
    const timeslotUI = new TimeslotAdapter(subject.lesnTime).toUiData(MIN_TIME);
    const top = timeslotUI[0]?.top;

    if (expandToMax) {
      expandToMax();

      setTimeout(() => {
        if (top) {
          const topPx = parseFloat(top); // '180px' → 180
          window.scrollTo({ top: topPx, behavior: 'smooth' });
        }
      }, 400);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {subjects.slice(0, visibleRows).map(subject => {
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
      {/* loadMoreRef를 여기에 연결 */}
      {visibleRows < subjects.length && <div ref={loadMoreRef} className="load-more-trigger w-full h-10"></div>}
    </div>
  );
}

// ... (FilteredSubjectCard 컴포넌트는 변경 없음)
interface ISubjectCard {
  isActive?: boolean;
  subject: Subject;
  onClick: () => void;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

function FilteredSubjectCard({ isActive, subject, onClick, forwardedRef }: ISubjectCard) {
  const color = isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-700 bg-white';
  const { saveSchedule } = useScheduleModal();
  const { closeBottomSheet } = useBottomSheetStore();

  const handleAddOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    saveSchedule(e);
    closeBottomSheet('search');
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col cursor-pointer ${color}`}
      onClick={onClick}
      ref={forwardedRef}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm sm:text-lg font-semibold">{subject.subjectName}</h3>
        <span className="text-xs sm:text-sm text-gray-500">{subject.professorName}</span>
      </div>

      <span className="text-xs sm:text-sm text-gray-500">{subject.lesnTime}</span>
      <span className="text-xs sm:text-sm text-gray-500">{subject.lesnRoom}</span>
      <span className="text-xs sm:text-sm text-gray-500">
        {subject.studentYear}학년/{subject.manageDeptNm}
      </span>

      <div className="flex justify-between items-center">
        <div
          className={`w-fit rounded-xl flex items-center text-xs sm:text-sm text-gray-500 ${
            isActive ? '' : 'bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-0.5'
          }`}
        >
          {subject.tmNum[0]}학점
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
