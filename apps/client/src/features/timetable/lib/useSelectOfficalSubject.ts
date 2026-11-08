import { OfficialSchedule } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { ScheduleAdapter, TimeslotAdapter } from '@/entities/timetable/model/adapter.ts';
import { Subject } from '@/shared/model/types.ts';

const MIN_TIME = 9;

interface Params {
  selectedSubjectId?: number;
  cancelSchedule: (id?: number, silent?: boolean) => void;
  openScheduleModal: (scheduleUiData: ReturnType<ScheduleAdapter['toUiData']>) => void;
  expandToMax?: () => void;
}

export function useSelectOfficialSubject({
  selectedSubjectId,
  cancelSchedule,
  openScheduleModal,
  expandToMax,
}: Params) {
  const selectSubject = (subject: Subject) => {
    if (selectedSubjectId === subject.subjectId) {
      cancelSchedule(undefined, false);
      return;
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

    const timeslotUI = new TimeslotAdapter(subject.lesnTime).toUiData(MIN_TIME);
    const top = timeslotUI[0]?.top;

    if (expandToMax && top) {
      expandToMax();

      setTimeout(() => {
        const topPx = Number.parseFloat(top);
        window.scrollTo({ top: topPx, behavior: 'smooth' });
      }, 400);
    }
  };

  return { selectSubject };
}
