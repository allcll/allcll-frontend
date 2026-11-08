import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  InitTimetableType,
  ScheduleApiResponse,
  Timetable,
  TimetableType,
} from '@/entities/timetable/api/useTimetableSchedules.ts';
import { ScheduleMutateType, useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { ScheduleAdapter } from '@/entities/timetable/model/adapter.ts';
import { fetchDeleteJsonOnAPI, fetchJsonOnAPI, fetchOnAPI } from '@/shared/api/api.ts';
import { timeSleep } from '@/shared/lib/time.ts';
import { RECENT_SEMESTERS } from '@/entities/semester/api/semester';

interface ITimetableMutationOptions {
  onSuccess?: () => void;
}

const InitTimetableSchedules = {
  timeTableId: -1,
  timeTableName: '새 시간표',
  semesterCode: '',
  schedules: [],
};

/**
 * 시간표 수정 훅
 * timetableId에에 대한 timetableName을 수정합니다.
 */
export function useUpdateTimetable(options?: ITimetableMutationOptions) {
  const queryClient = useQueryClient();
  const { currentTimetable, pickTimetable } = useScheduleState.getState();

  return useMutation({
    mutationFn: async ({ timeTableId, timeTableName }: { timeTableId: number; timeTableName: string }) => {
      return await fetchJsonOnAPI<TimetableType>(`/api/timetables/${timeTableId}`, {
        method: 'PATCH',
        body: JSON.stringify({ timeTableName }),
      });
    },

    onMutate: async ({ timeTableId }) => {
      await queryClient.cancelQueries({ queryKey: ['timetableList', timeTableId] });
      return { timeTableId };
    },

    onSuccess: async (updated, _variables, context) => {
      const updatedId = context?.timeTableId;

      if (currentTimetable?.timeTableId === updatedId) {
        pickTimetable({
          timeTableId: updated.timeTableId,
          timeTableName: updated.timeTableName,
          semesterCode: updated.semesterCode,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      await queryClient.invalidateQueries({ queryKey: ['timetableList', updatedId] });
      options?.onSuccess?.();
    },

    onError: async (error, _variables, context) => {
      console.error(`시간표 수정 실패 (id: ${context?.timeTableId})`, error);
      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      await queryClient.invalidateQueries({ queryKey: ['timetableList', context?.timeTableId] });
    },
  });
}

/**
 * 시간표 삭제 훅
 * timetableId로 시간표를 삭제합니다.
 */
export function useDeleteTimetable(options?: ITimetableMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timeTableId: number) => {
      const response = await fetchOnAPI(`/api/timetables/${timeTableId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response;
    },
    onMutate: async (timeTableId: number) => {
      await queryClient.cancelQueries({ queryKey: ['timetableList'] });
      await queryClient.cancelQueries({ queryKey: ['timetableData', timeTableId] });
      return { timeTableId };
    },
    onError: async (error, _variables, context) => {
      console.error(`시간표 삭제 실패 (id: ${context?.timeTableId})`, error);
      await queryClient.invalidateQueries({ queryKey: ['timetableList', context?.timeTableId] });
      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
    onSuccess: async (_, __, context) => {
      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      await queryClient.invalidateQueries({
        queryKey: ['timetableData', context?.timeTableId],
      });
      options?.onSuccess?.();
    },
  });
}

/**
 * 시간표 생성 훅
 * 시간표를 생성합니다.
 */
export function useCreateTimetable(options?: ITimetableMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ timeTableName, semesterCode }: InitTimetableType) => {
      return await fetchJsonOnAPI<TimetableType>('/api/timetables', {
        method: 'POST',
        body: JSON.stringify({
          timeTableName: timeTableName,
          semesterCode: semesterCode,
        }),
      });
    },
    onSuccess: async (data: TimetableType) => {
      const { pickTimetable } = useScheduleState.getState();

      /**
       * timetable POST요청
       * -> currentTimetable 설정
       * -> timetables GET요청
       * -> schedules GET 요청(렌더링)
       */
      pickTimetable({
        timeTableId: data.timeTableId,
        timeTableName: data.timeTableName,
        semesterCode: data.semesterCode,
      });

      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      options?.onSuccess?.();
    },
    onError: async error => {
      console.error('시간표 생성 실패:', error);
      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
  });
}

interface ScheduleMutationProps {
  schedule: ScheduleApiResponse;
}

interface IScheduleMutationOptions {
  onSuccess?: () => void;
}

/** 스케줄을 생성하는 Mutation 훅입니다.
 * onMutate: mutation 전에 캐싱된 데이터를 context로 넘겨줍니다.
 * onError: 에러 발생 시 캐싱된 데이터를 롤백합니다.
 * onSuccess: 성공 시 캐싱된 데이터를 업데이트합니다.
 * @param timetableId
 * @param semesterCode
 */
export function useCreateSchedule(timetableId?: number, semesterCode?: string, options?: IScheduleMutationOptions) {
  semesterCode = semesterCode ?? RECENT_SEMESTERS.semesterCode;

  const queryClient = useQueryClient();
  const setSelectedSchedule = useScheduleState(state => state.changeScheduleData);
  const { mutateAsync: createTimetable } = useCreateTimetable();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationProps) => {
      let targetTimetableId = timetableId;

      if (!targetTimetableId || targetTimetableId <= 0) {
        const timetable = await createTimetable({
          timeTableName: '새 시간표',
          semesterCode: semesterCode,
        });
        targetTimetableId = timetable.timeTableId;

        /* timetable 생성 후, transaction을 위해 잠시 대기
                -> targetTimetableId로 스케줄을 생성하기 위해
                */
        await timeSleep(300);

        // 시간표 생성 후, optimistic하게 스케줄을 설정합니다.
        queryClient.setQueryData(['timetableData', targetTimetableId], {
          timetableId: targetTimetableId,
          timetableName: timetable.timeTableName,
          semesterCode: timetable.semesterCode,
          schedules: [schedule],
        });
      }

      const newSchedule = await fetchJsonOnAPI<ScheduleApiResponse>(`/api/timetables/${targetTimetableId}/schedules`, {
        method: 'POST',
        body: JSON.stringify(schedule),
      });

      return { schedule: newSchedule, targetTimetableId };
    },
    onMutate: async mutateData => {
      if (!timetableId || timetableId <= 0) return;
      const prevTimetableSchedules = queryClient.getQueryData<Timetable>(['timetableData', timetableId]) ?? {
        ...InitTimetableSchedules,
      };

      // Optimistically update the timetable data
      // Todo: Timetable 같이 생성 시 코드를 간단히 처리할 수 있도록 수정
      if (timetableId && timetableId > 0) {
        await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });

        queryClient.setQueryData(['timetableData', timetableId], {
          ...prevTimetableSchedules,
          schedules: [...prevTimetableSchedules.schedules, mutateData.schedule],
        });

        setSelectedSchedule(new ScheduleAdapter().toUiData(), ScheduleMutateType.NONE);
      }

      return { ...mutateData, prevTimetableSchedules };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(['timetableData', timetableId], context?.prevTimetableSchedules); // 롤백
      console.error(error);
    },
    onSuccess: async ({ schedule, targetTimetableId }, _, context) => {
      const timetable = queryClient.getQueryData<Timetable>(['timetableData', targetTimetableId]);

      // Fixme: schedule 이 생성되기 전, 다른 스케줄이 생성되면 버그 처럼 보일 수 있음.
      setSelectedSchedule(new ScheduleAdapter().toUiData(), ScheduleMutateType.NONE);

      queryClient.setQueryData(['timetableData', targetTimetableId], {
        ...timetable,
        schedules: timetable?.schedules.map(sch => {
          if (sch.scheduleId === context?.schedule.scheduleId) return schedule; // Update the specific schedule
          return sch; // Return unchanged schedules
        }),
      });

      options?.onSuccess?.();
    },
  });
}

/** 스케줄을 업데이트하는 Mutation 훅입니다.
 * onMutate: mutation 전에 캐싱된 데이터를 context로 넘겨줍니다.
 * onError: 에러 발생 시 캐싱된 데이터를 롤백합니다.
 * onSuccess: 성공 시 캐싱된 데이터를 업데이트합니다.
 * @param timetableId
 */
export function useUpdateSchedule(timetableId?: number, options?: IScheduleMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationProps) =>
      await fetchJsonOnAPI<ScheduleApiResponse>(`/api/timetables/${timetableId}/schedules/${schedule.scheduleId}`, {
        method: 'PATCH',
        body: JSON.stringify(schedule),
      }),
    onMutate: async mutateData => {
      const prevTimetableSchedules = queryClient.getQueryData<Timetable>(['timetableData', timetableId]) ?? {
        ...InitTimetableSchedules,
      };
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return { ...mutateData, prevTimetableSchedules };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(['timetableData', timetableId], context?.prevTimetableSchedules);
      console.error(error);
    },
    onSuccess: async (schedule, _, context) => {
      if (!context?.prevTimetableSchedules) {
        await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
        await queryClient.invalidateQueries({ queryKey: ['timetableData', timetableId] });
        options?.onSuccess?.();
        return;
      }

      queryClient.setQueryData(['timetableData', timetableId], {
        ...context.prevTimetableSchedules,
        schedules: context.prevTimetableSchedules.schedules.map(sch => {
          if (sch.scheduleId === schedule.scheduleId) {
            return { ...sch, ...schedule }; // Update the specific schedule
          }
          return sch; // Return unchanged schedules
        }),
      });

      options?.onSuccess?.();
    },
  });
}

/** 스케줄을 삭제하는 Mutation 훅입니다.
 * onMutate: mutation 전에 캐싱된 데이터를 context로 넘겨줍니다.
 * onError: 에러 발생 시 캐싱된 데이터를 롤백합니다.
 * onSuccess: 성공 시 캐싱된 데이터를 업데이트합니다.
 * @param timetableId
 */
export function useDeleteSchedule(timetableId?: number, options?: IScheduleMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationProps) =>
      await fetchDeleteJsonOnAPI(`/api/timetables/${timetableId}/schedules/${schedule.scheduleId}`, {
        scheduleType: schedule.scheduleType,
      }),

    onMutate: async mutateData => {
      const prevTimetableSchedules = queryClient.getQueryData<Timetable>(['timetableData', timetableId]) ?? {
        ...InitTimetableSchedules,
      };
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return { ...mutateData, prevTimetableSchedules };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(['timetableData', timetableId], context?.prevTimetableSchedules);
      console.error(error);
    },
    onSuccess: async (_, { schedule }, context) => {
      console.log('스케줄 삭제 성공! timetableId:', timetableId);
      if (!context?.prevTimetableSchedules) {
        await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
        await queryClient.invalidateQueries({ queryKey: ['timetableData', timetableId] });
        options?.onSuccess?.();
        return;
      }

      console.log('스케줄 삭제 성공! 이전 데이터 있음. timetableId:', timetableId, context.prevTimetableSchedules);
      queryClient.setQueryData(['timetableData', timetableId], {
        ...context.prevTimetableSchedules,
        schedules: context.prevTimetableSchedules.schedules.filter(sch => sch.scheduleId !== schedule.scheduleId),
      });

      await queryClient.invalidateQueries({ queryKey: ['timetableData', timetableId] });
      options?.onSuccess?.();
    },
  });
}
