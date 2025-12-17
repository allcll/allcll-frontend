import { useRef } from 'react';
import ZeroListError from '../errors/ZeroListError';
import useInfScroll from '@/shared/lib/useInfScroll.ts';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { OfficialSchedule } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState';
import { ScheduleAdapter, TimeslotAdapter } from '@/utils/timetable/adapter.ts';
import { Subject } from '@/utils/types';
import FilteredSubjectCard from '@/components/contentPanel/subject/TimetableSubjectCard';
import { Flex } from '@allcll/allcll-ui';

interface ISubjectCards {
  subjects: Subject[];
  isPending?: boolean;
  expandToMax?: () => void;
}

function TimetableSubjectCards({ subjects, expandToMax, isPending = false }: Readonly<ISubjectCards>) {
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

export default TimetableSubjectCards;
