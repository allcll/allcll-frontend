// This hook is used to manage the schedule modal state and actions
import React, { useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  CustomSchedule,
  OfficialSchedule,
  Schedule,
  Timetable,
  useCreateSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
} from '@/hooks/server/useTimetableSchedules.ts';
import { ScheduleMutateType, useScheduleState } from '@/store/useScheduleState.ts';
import { useBottomSheetStore } from '@/store/useBottomSheetStore.ts';
import { ScheduleAdapter, TimeslotAdapter } from '@/utils/timetable/adapter.ts';

const initCustomSchedule = new ScheduleAdapter().toUiData();
let globalPrevTimetable: Timetable | undefined = undefined;

/** schedule, modalActionType 을 사용하고 싶다면, useScheduleModalData를 사용해주세요*/
function useScheduleModal() {
  const queryClient = useQueryClient();

  const changeScheduleData = useScheduleState(state => state.changeScheduleData);
  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const timetableId = currentTimetable?.timeTableId ?? -1;

  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const [, startTransition] = useTransition();

  const { mutate: createScheduleData } = useCreateSchedule(timetableId);
  const { mutate: updateScheduleData } = useUpdateSchedule(timetableId);
  const { mutate: deleteScheduleData } = useDeleteSchedule(timetableId);

  /** Schedule Time 만 제어할 때 사용. 모달을 열고 싶지 않을 때 사용*/
  const setOptimisticSchedule = (targetSchedule: Schedule) => {
    startTransition(() => changeScheduleData(targetSchedule, ScheduleMutateType.NONE));
  };

  /** schedule 설정하면서 모달 열기 */
  const openScheduleModal = (targetSchedule: Schedule) => {
    // caching previous timetable data
    globalPrevTimetable = queryClient.getQueryData<Timetable>(['timetableData', timetableId]);

    let currentMode;
    if (!targetSchedule.scheduleId || targetSchedule.scheduleId <= 0) {
      currentMode = ScheduleMutateType.CREATE;
      if (targetSchedule.scheduleType !== 'official') {
        openBottomSheet('edit');
      }
    } else if (targetSchedule.scheduleType === 'official') {
      currentMode = ScheduleMutateType.VIEW;
      console.log(globalPrevTimetable);
      openBottomSheet('Info');
    } else {
      currentMode = ScheduleMutateType.EDIT;
      openBottomSheet('edit');
    }
    changeScheduleData(targetSchedule, currentMode);
  };

  type SetScheduleAction = Schedule | ((prevState: Schedule) => Schedule);
  const editSchedule = (schedule: SetScheduleAction) => {
    const prevSchedule = useScheduleState.getState().schedule;
    // state 변경 로직

    let newSchedule = schedule instanceof Function ? schedule(prevSchedule) : schedule;
    changeScheduleData(newSchedule);

    // 데이터 변경 로직
    queryClient.setQueryData(['timetableData', timetableId], {
      ...globalPrevTimetable,
      schedules: globalPrevTimetable?.schedules.map(sch => {
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
    const prevSchedule = useScheduleState.getState().schedule;
    const mode = useScheduleState.getState().mode;

    if (e) e.preventDefault();

    // Schedule 시간 Validation
    const isTimeslotValid = new TimeslotAdapter(prevSchedule.timeSlots).validate();

    if (!isTimeslotValid) {
      alert('시작 시간이 종료 시간 보다 늦지 않아야 합니다.');
      return;
    }

    const isSelectedDay = prevSchedule.timeSlots.length !== 0;
    const isCustom = prevSchedule.scheduleType === 'custom';
    if (isCustom && !isSelectedDay) {
      alert('요일을 선택해주세요!.');
      return;
    }

    const schedule = new ScheduleAdapter(prevSchedule).toApiData();

    // 생성 및 수정 로직
    if (mode === ScheduleMutateType.CREATE) {
      // 생성중인 Schedule 구분 용 - unique negative id 생성
      schedule.scheduleId = getUniqueNegativeId(globalPrevTimetable?.schedules ?? []);
      createScheduleData({ schedule, prevTimetable: globalPrevTimetable });
    } else if (mode === ScheduleMutateType.EDIT) {
      updateScheduleData({ schedule, prevTimetable: globalPrevTimetable });
      changeScheduleData({ ...initCustomSchedule }, ScheduleMutateType.NONE);
    }

    // 모달 state 초기화
    closeBottomSheet('edit');
  };

  const deleteSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const prevSchedule = useScheduleState.getState().schedule;

    if (e) e.preventDefault();

    const schedule = new ScheduleAdapter(prevSchedule).toApiData();
    deleteScheduleData({ schedule, prevTimetable: globalPrevTimetable });

    // 모달 state 초기화
    changeScheduleData({ ...initCustomSchedule }, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  const cancelSchedule = (e?: React.MouseEvent | React.KeyboardEvent | KeyboardEvent) => {
    if (e) e.preventDefault();

    // timetable 롤백
    queryClient.setQueryData(['timetableData', timetableId], globalPrevTimetable);

    // 모달 state 초기화
    changeScheduleData({ ...initCustomSchedule }, ScheduleMutateType.NONE);
    closeBottomSheet();
  };

  return {
    setOptimisticSchedule,
    openScheduleModal,
    editSchedule,
    saveSchedule,
    deleteSchedule,
    cancelSchedule,
  };
}

export function useScheduleModalData() {
  const modalActionType = useScheduleState(state => state.mode);
  const schedule = useScheduleState(state => state.schedule);

  return {
    modalActionType,
    schedule,
  };
}

export function useScheduleTimeslot() {
  const { minTime } = useScheduleState(state => state.options);

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

    const startTime = getTimeHM(minTime, startX);
    const endTime = getTimeHM(minTime, endX);

    return { startTime, endTime };
  };

  return { getTimeslot };
}

function getTimeHM(minTime: number, time: number) {
  const hour = minTime + Math.floor(time);
  const minute = Math.floor((time - Math.floor(time)) * 60);

  if (hour < 0) return '00:00';

  if (hour > 23) return '23:50';

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function getUniqueNegativeId(schedules: (CustomSchedule | OfficialSchedule)[]) {
  let tmpScheduleId = -Math.floor(Math.random() * 1000000);
  while (schedules.some(s => s.scheduleId === tmpScheduleId)) {
    tmpScheduleId = -Math.floor(Math.random() * 1000000);
  }

  return tmpScheduleId;
}

export default useScheduleModal;
