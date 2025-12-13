import React, { useRef } from 'react';
import ZeroListError from '../errors/ZeroListError';
import useInfScroll from '@/hooks/useInfScroll'; // 수정된 useInfScroll import
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { loggingDepartment } from '@/hooks/useSearchRank.ts';
import { OfficialSchedule } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState';
import { ScheduleAdapter, TimeslotAdapter } from '@/utils/timetable/adapter.ts';
import { Subject } from '@/utils/types';
import { Button, Badge, Flex, Heading } from '@allcll/allcll-ui';

interface ISubjectCards {
  subjects: Subject[];
  isPending?: boolean;
  expandToMax?: () => void;
}

export function FilteredSubjectCards({ subjects, expandToMax, isPending = false }: Readonly<ISubjectCards>) {
  const { visibleRows, loadMoreRef } = useInfScroll(subjects, 'ref');

  const selectedCardRef = useRef<HTMLButtonElement>(null);
  const selectedSubjectId = useScheduleState(state => state.schedule.subjectId);
  const { openScheduleModal, cancelSchedule } = useScheduleModal();

  if (isPending || !subjects) {
    return <div className="w-full h-10"></div>;
  }

  if (!subjects.length) {
    return <ZeroListError />;
  }

  const handleCardClick = (subject: Subject) => {
    if (selectedSubjectId === subject.subjectId) {
      cancelSchedule(undefined, false);
      return; // 이미 선택된 과목이면 아무 동작도 하지 않음
    }

    const newSchedule = new ScheduleAdapter(
      {
        ...new ScheduleAdapter().toApiData(), // Default schedule
        scheduleType: 'official',
        subjectId: subject.subjectId ?? -1,
      } as OfficialSchedule,
      subject,
    );

    openScheduleModal(newSchedule.toUiData());
    console.log('official', selectedSubjectId);

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
    <Flex direction="flex-col" justify="justify-end" gap="gap-2">
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

      {visibleRows < subjects.length && <div ref={loadMoreRef} className="load-more-trigger w-full h-10"></div>}
    </Flex>
  );
}

interface ISubjectCard {
  isActive?: boolean;
  subject: Subject;
  onClick: () => void;
  forwardedRef?: React.Ref<HTMLButtonElement>;
}

function FilteredSubjectCard({ isActive, subject, onClick, forwardedRef }: Readonly<ISubjectCard>) {
  const color = isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-700 bg-white hover:bg-gray-50';
  const { saveSchedule } = useScheduleModal();
  const { selectTargetOnly } = useSearchLogging();

  const handleAddOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    saveSchedule(e, false);
    selectTargetOnly(subject.subjectId);
    loggingDepartment(subject.deptCd);
  };

  return (
    <button
      type="button"
      className={`border border-gray-200 rounded-lg p-3 sm:p-4 gap-2 sm:gap-3 ${color} cursor-pointer w-full text-left`}
      onClick={onClick}
      ref={forwardedRef}
    >
      <Flex direction="flex-col">
        <Flex justify="justify-between" align="items-center" gap="gap-2 ">
          <Heading level={3}>{subject.subjectName}</Heading>
          <span className="text-xs sm:text-sm text-gray-500">{subject.professorName}</span>
        </Flex>

        <Flex direction="flex-col" justify="justify-start" align="items-start" gap="gap-2 ">
          <span className="text-xs sm:text-sm text-gray-500">{subject.lesnTime}</span>
          <span className="text-xs sm:text-sm text-gray-500">{subject.lesnRoom}</span>
          <span className="text-xs sm:text-sm text-gray-500">
            {subject.studentYear}학년/{subject.manageDeptNm}
          </span>
        </Flex>

        <Flex justify="justify-between" align="items-center">
          <Badge variant="default">{subject.tmNum[0]}학점</Badge>

          {isActive && (
            <Button variant="primary" size="medium" onClick={handleAddOfficialSchedule}>
              추가하기
            </Button>
          )}
        </Flex>
      </Flex>
    </button>
  );
}
