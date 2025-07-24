// This hook is used to manage the schedule modal state and actions
import React, { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Schedule,
  scheduleAsApiSchedule,
  Timetable,
  useCreateSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
} from '@/hooks/server/useTimetableData.ts';
import { ScheduleMutateType, useScheduleState } from '@/store/useScheduleState.ts';
import { useBottomSheetStore } from '@/store/useBottomSheetStore.ts';

function useScheduleModal() {
  const queryClient = useQueryClient();
  const { timetableId, schedule: prevSchedule, mode, changeScheduleData } = useScheduleState();
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);

  const { mutate: createScheduleData } = useCreateSchedule(timetableId);
  const { mutate: updateScheduleData } = useUpdateSchedule(timetableId);
  const { mutate: deleteScheduleData } = useDeleteSchedule(timetableId);

  const prevTimetable = useRef<Timetable | undefined>(undefined);

  /** schedule 설정하면서 모달 열기 */
  const open = (targetSchedule: Schedule) => {
    // caching previous timetable data
    prevTimetable.current = queryClient.getQueryData<Timetable>(['timetableData', timetableId]);

    // set modal set state
    let currentMode;
    if (!targetSchedule.scheduleId || targetSchedule.scheduleId <= 0) {
      currentMode = ScheduleMutateType.CREATE;
    } else if (targetSchedule.scheduleType === 'official') {
      currentMode = ScheduleMutateType.VIEW;
    } else {
      currentMode = ScheduleMutateType.EDIT;
    }
    changeScheduleData(targetSchedule, currentMode);
    openBottomSheet('edit');
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

    if (!prevTimetable.current) {
      throw new Error('Previous timetable data is not available.');
    }

    // Schedule 시간 Validation
    const isTimeslotValid = prevSchedule.timeslots.every(slot => slot.startTime <= slot.endTime);
    if (!isTimeslotValid) {
      alert('시작 시간이 종료 시간 보다 늦지 않아야 합니다.');
      return;
    }

    const schedule = scheduleAsApiSchedule(prevSchedule);

    // 생성 및 수정 로직
    if (mode === ScheduleMutateType.CREATE) {
      createScheduleData({ schedule, prevTimetable: prevTimetable.current });
    } else if (mode === ScheduleMutateType.EDIT) {
      updateScheduleData({ schedule, prevTimetable: prevTimetable.current });
    }

    // 모달 state 초기화
    changeScheduleData({}, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  const deleteSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!prevTimetable.current) {
      throw new Error('Previous timetable data is not available.');
    }

    const schedule = scheduleAsApiSchedule(prevSchedule);
    deleteScheduleData({ schedule, prevTimetable: prevTimetable.current });

    // 모달 state 초기화
    changeScheduleData({}, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  const cancelSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    // timetable 롤백
    queryClient.setQueryData(['timetableData', timetableId], prevTimetable.current);

    // 모달 state 초기화
    changeScheduleData({}, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  return {
    modalActionType: mode,
    schedule: prevSchedule,
    open,
    editSchedule,
    saveSchedule,
    deleteSchedule,
    cancelSchedule,
  };
}

export default useScheduleModal;
