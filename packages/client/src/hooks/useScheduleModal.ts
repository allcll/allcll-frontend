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

function useScheduleModal() {
  const queryClient = useQueryClient();
  const { timetableId, schedule: prevSchedule, mode, changeScheduleData } = useScheduleState();
  const prevTimetable = useRef<Timetable | undefined>(undefined);

  const { mutate: createScheduleData } = useCreateSchedule(timetableId);
  const { mutate: updateScheduleData } = useUpdateSchedule(timetableId);
  const { mutate: deleteScheduleData } = useDeleteSchedule(timetableId);

  // Fixme: Open 할 때 어떤 데이터를 쓰나요?
  const open = (targetSchedule: object) => {
    // caching previous timetable data
    prevTimetable.current = queryClient.getQueryData<Timetable>(['timetableData', timetableId]);
    changeScheduleData(targetSchedule);

    // Todo: modal set state
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

  const saveSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!prevTimetable.current) {
      throw new Error('Previous timetable data is not available.');
    }

    const schedule = scheduleAsApiSchedule(prevSchedule);

    // 생성 및 수정 로직
    if (mode === ScheduleMutateType.CREATE) {
      createScheduleData({ schedule, prevTimetable: prevTimetable.current });
    } else if (mode === ScheduleMutateType.EDIT) {
      updateScheduleData({ schedule, prevTimetable: prevTimetable.current });
    }

    // Todo: Resetting the modal state
  };

  const deleteSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!prevTimetable.current) {
      throw new Error('Previous timetable data is not available.');
    }

    const schedule = scheduleAsApiSchedule(prevSchedule);
    deleteScheduleData({ schedule, prevTimetable: prevTimetable.current });
  };

  const cancelSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    // Logic to cancel the current action
    queryClient.setQueryData(['timetableData', timetableId], prevTimetable.current);

    // Todo: Resetting the modal state
  };

  return {
    schedule: prevSchedule,
    open,
    editSchedule,
    saveSchedule,
    deleteSchedule,
    cancelSchedule,
  };
}

export default useScheduleModal;
