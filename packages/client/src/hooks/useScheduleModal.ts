// This hook is used to manage the schedule modal state and actions
import React, { useRef, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  initCustomSchedule,
  Schedule,
  Timetable,
  useCreateSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
} from '@/hooks/server/useTimetableSchedules.ts';
import { ScheduleMutateType, useScheduleState } from '@/store/useScheduleState.ts';
import { useBottomSheetStore } from '@/store/useBottomSheetStore.ts';
import { ScheduleAdapter, TimeslotAdapter } from '@/utils/timetable/adapter.ts';

function useScheduleModal() {
  const queryClient = useQueryClient();
  const { currentTimetable, schedule: prevSchedule, mode, changeScheduleData } = useScheduleState();
  const timetableId = currentTimetable?.timeTableId;
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const [, startTransition] = useTransition();

  const { mutate: createScheduleData } = useCreateSchedule(timetableId);
  const { mutate: updateScheduleData } = useUpdateSchedule(timetableId);
  const { mutate: deleteScheduleData } = useDeleteSchedule(timetableId);

  const prevTimetable = useRef<Timetable | undefined>(undefined);

  /** Schedule Time 만 제어할 때 사용. 모달을 열고 싶지 않을 때 사용*/
  const setOptimisticSchedule = (targetSchedule: Schedule) => {
    startTransition(() => changeScheduleData(targetSchedule, ScheduleMutateType.NONE));
  };

  /** schedule 설정하면서 모달 열기 */
  const openScheduleModal = (targetSchedule: Schedule) => {
    // caching previous timetable data
    prevTimetable.current = queryClient.getQueryData<Timetable>(['timetableData', timetableId]);

    let currentMode;
    if (!targetSchedule.scheduleId || targetSchedule.scheduleId <= 0) {
      currentMode = ScheduleMutateType.CREATE;
      if (targetSchedule.scheduleType !== 'official') {
        openBottomSheet('edit');
      }
    } else if (targetSchedule.scheduleType === 'official') {
      currentMode = ScheduleMutateType.VIEW;
      openBottomSheet('Info');
    } else {
      currentMode = ScheduleMutateType.EDIT;
      openBottomSheet('edit');
    }
    changeScheduleData(targetSchedule, currentMode);
  };

  type SetScheduleAction = Schedule | ((prevState: Schedule) => Schedule);
  const editSchedule = (schedule: SetScheduleAction) => {
    // state 변경 로직
    let newSchedule = schedule instanceof Function ? schedule(prevSchedule) : schedule;
    changeScheduleData(newSchedule);

    // 데이터 변경 로직
    queryClient.setQueryData(['timetableData', timetableId], {
      ...prevTimetable,
      schedules: prevTimetable.current?.schedules.map(sch => {
        if (sch.scheduleId === newSchedule.scheduleId) {
          return { ...sch, ...newSchedule }; // Update the specific schedule
        }
        return sch; // Return unchanged schedules
      }),
    });
  };

  /** Schedule 의 생성 / 수정 로직
   * @param e - React.MouseEvent<HTMLButtonElement> | React.FormEvent
   */
  const saveSchedule = (e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
    if (e) e.preventDefault();

    // Schedule 시간 Validation
    const isTimeslotValid = new TimeslotAdapter(prevSchedule.timeSlots).validate();

    if (!isTimeslotValid) {
      alert('시작 시간이 종료 시간 보다 늦지 않아야 합니다.');
      return;
    }

    const schedule = new ScheduleAdapter(prevSchedule).toApiData();

    console.log('official 과목 추가', schedule);

    // 생성 및 수정 로직
    if (mode === ScheduleMutateType.CREATE) {
      console.log('official 과목 추가, CREATE', schedule);
      createScheduleData({ schedule, prevTimetable: prevTimetable.current });
    } else if (mode === ScheduleMutateType.EDIT) {
      updateScheduleData({ schedule, prevTimetable: prevTimetable.current });
    }

    // 모달 state 초기화
    changeScheduleData({ ...initCustomSchedule }, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  const deleteSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!prevTimetable.current) {
      throw new Error('Previous timetable data is not available.');
    }

    const schedule = new ScheduleAdapter(prevSchedule).toApiData();
    deleteScheduleData({ schedule, prevTimetable: prevTimetable.current });

    // 모달 state 초기화
    changeScheduleData({ ...initCustomSchedule }, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  const cancelSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    // timetable 롤백
    queryClient.setQueryData(['timetableData', timetableId], prevTimetable.current);

    // 모달 state 초기화
    changeScheduleData({ ...initCustomSchedule }, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  return {
    modalActionType: mode,
    schedule: prevSchedule,
    setOptimisticSchedule,
    openScheduleModal,
    editSchedule,
    saveSchedule,
    deleteSchedule,
    cancelSchedule,
  };
}

export function useScheduleTimeslot() {
  const { rowNames } = useScheduleState(state => state.options);

  /**
   * number type Timeslot 을 string type Timeslot 으로 변환합니다.
   * @param startX - Timeslot 시작 위치
   * @param endX - Timeslot 종료 위치
   * @param minIntervalY - Optional 최소 시간 간격 (Hours)
   */
  const getTimeslot = (startX: number, endX: number, minIntervalY?: number) => {
    if (startX > endX) {
      [startX, endX] = [endX, startX];
    }

    if (minIntervalY !== undefined && endX - startX < minIntervalY) {
      endX = startX + minIntervalY;
    }

    const startHour = rowNames[Math.floor(startX)];
    const startMinute = Math.floor((startX - Math.floor(startX)) * 60);
    const endHour = rowNames[Math.floor(endX)];
    const endMinute = Math.floor((endX - Math.floor(endX)) * 60);

    return {
      startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
    };
  };

  return { getTimeslot };
}

export default useScheduleModal;
