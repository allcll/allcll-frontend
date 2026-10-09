import { GeneralSchedule, ScheduleSlot } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { ScheduleMutateType, useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { TimeslotAdapter } from '@/entities/timetable/model/adapter.ts';

/** timetable 데이터를 ScheduleSlots 형태 (UI Data)로 변환합니다.
 * @param generalSchedules - Schedule 배열
 * @param minTime
 */
export function useScheduleSlots(generalSchedules?: GeneralSchedule[], minTime = 9) {
  const selectedSchedule = useScheduleState(state => state.schedule);
  const selectMode = useScheduleState(state => state.mode);
  const colors: ScheduleSlot['color'][] = ['rose', 'amber', 'green', 'emerald', 'blue', 'violet'];
  const scheduleTimes: Record<string, ScheduleSlot[]> = {};

  if (!generalSchedules) return undefined;

  // Select Edit Schedule
  let joinedSchedules = generalSchedules;
  if (selectMode === ScheduleMutateType.EDIT || selectMode === ScheduleMutateType.VIEW) {
    joinedSchedules = generalSchedules.map(schedule => {
      if (schedule.scheduleId === selectedSchedule.scheduleId) {
        return selectedSchedule;
      }
      return schedule;
    });
  }

  joinedSchedules.forEach((schedule, index) => {
    const color = schedule.isDeleted ? 'gray' : colors[index % colors.length];
    const { subjectName: title, professorName: professor, location } = schedule;

    const timeslots = new TimeslotAdapter(schedule.timeSlots).toUiData(minTime);

    timeslots.forEach(slot => {
      if (!scheduleTimes[slot.dayOfWeek]) {
        scheduleTimes[slot.dayOfWeek] = [];
      }

      scheduleTimes[slot.dayOfWeek].push({
        title,
        professor,
        location,
        schedule,
        color,
        ...slot,
      });
    });
  });

  // 요일 별 depth 기능 적용
  Object.keys(scheduleTimes).forEach(day => {
    scheduleTimes[day] = applyScheduleDepth(scheduleTimes[day]);
  });

  return scheduleTimes;
}

interface ExtendedScheduleTime extends ScheduleSlot {
  depth: number;
}

function applyScheduleDepth(ScheduleSlots: ScheduleSlot[]): ScheduleSlot[] {
  const isMobile = useScheduleState.getState().options.isMobile;
  const DepthSize = isMobile ? 8 : 16;

  const parsePixel = (value: string) => {
    return Number.parseFloat(value.replace('px', ''));
  };

  // 영역이 큰 순서대로 배치
  const SortedScheduleSlots = ScheduleSlots.sort((a, b) => {
    const aStart = parsePixel(a.height);
    const bStart = parsePixel(b.height);
    return bStart - aStart; // Sort by start time in descending order
  }) as ScheduleSlot[];

  // depth 계산
  const ScheduleWithDepth = SortedScheduleSlots.reduce((acc, slot) => {
    const targetTop = parsePixel(slot.top);
    const targetBottom = targetTop + parsePixel(slot.height);

    // maxDepth + 1 로 설정
    const maxDepth = acc.reduce((max, curr) => {
      const currTop = parsePixel(curr.top);
      const currBottom = currTop + parsePixel(curr.height);

      if ((currTop <= targetTop && targetTop < currBottom) || (currTop < targetBottom && targetBottom <= currBottom)) {
        return Math.max(max, curr.depth);
      }

      return max;
    }, -1);

    const depth = maxDepth + 1;

    return [...acc, { ...slot, depth: depth }];
  }, [] as ExtendedScheduleTime[]);

  // depth에 따라 width 계산
  return ScheduleWithDepth.map(slot => {
    const left = DepthSize * slot.depth;
    return {
      ...slot,
      left: `${left}px`,
      right: '0px',
      height: slot.height, // height는 그대로 유지
      top: slot.top, // top은 그대로 유지
    };
  });
}

export interface EmptyScheduleSlot extends GeneralSchedule {
  selected: boolean; // 수정 중인 스케줄인지 여부
}
/** 시간표의 Timeslot이 비어있는 ScheduleSlot 을 가져오는 훅입니다.
 * @param generalSchedules - Schedule 배열
 */
export function useEmptyScheduleSlots(generalSchedules?: GeneralSchedule[]): EmptyScheduleSlot[] {
  const schedule = useScheduleState(state => state.schedule);
  const mode = useScheduleState(state => state.mode);

  if (!generalSchedules) return [];

  const emptySlots = generalSchedules.filter(
    schedule => schedule.timeSlots === null || schedule.timeSlots.length === 0,
  );

  if (mode === ScheduleMutateType.NONE || schedule.timeSlots.length > 0)
    return emptySlots.map(slot => ({ ...slot, selected: false }));

  if (schedule.scheduleId <= 0)
    return [...emptySlots.map(slot => ({ ...slot, selected: false })), { ...schedule, selected: true }];

  return emptySlots.map(slot => ({ ...slot, selected: slot.scheduleId === schedule.scheduleId }));
}
