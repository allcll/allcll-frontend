import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import { ScheduleMutateType, useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { ScheduleAdapter, TimeslotAdapter } from '@/entities/timetable/model/adapter.ts';
import { fetchDeleteJsonOnAPI, fetchJsonOnAPI, fetchOnAPI } from '@/shared/api/api.ts';
import { Subject } from '@/shared/model/types.ts';
import { timeSleep } from '@/shared/lib/time.ts';
import { Day } from '@/entities/timetable/model/types.ts';
import { SEMESTERS } from '@/entities/semester/api/semester';
import { useSearchParams } from 'react-router-dom';

export interface Timetable {
  timetableId: number;
  timetableName: string;
  semester: string; // e.g., "2025-1"
  schedules: ScheduleApiResponse[];
}

export interface OfficialSchedule {
  scheduleId: number;
  scheduleType: 'official';
  subjectId: number;
  subjectName: null;
  professorName: null;
  location: null;
  timeSlots: never[] | null;
}

export interface CustomSchedule {
  scheduleId: number;
  scheduleType: 'custom';
  subjectId: null;
  subjectName: string;
  professorName: string;
  location: string;
  timeSlots: TimeSlot[];
}

type ScheduleApiResponse = OfficialSchedule | CustomSchedule;

// 정보를 모두 담는 GeneralSchedule 인터페이스 - 코드 전반에 사용
export interface GeneralSchedule {
  scheduleId: number;
  scheduleType: 'official' | 'custom';
  subjectId: number | null;
  subjectName: string;
  professorName: string;
  location: string;
  tmNum: string;
  isDeleted: boolean;
  timeSlots: TimeSlot[]; // Todo: GeneralTimeSlot 으로 형태 변경하기 (Refactor 필요)
}

export interface TimeSlot {
  dayOfWeeks: Day;
  startTime: string;
  endTime: string;
}

export interface ScheduleSlot {
  title: string;
  professor: string | null;
  location: string | null;
  schedule: GeneralSchedule;
  color: 'rose' | 'amber' | 'green' | 'emerald' | 'blue' | 'violet' | 'gray';
  depth: number;
  left: string;
  right: string;
  height: string;
  top: string;
}

export interface TimetableType {
  timeTableId: number;
  timeTableName: string;
  semester: string; // ex: "2025-2"
}

export interface TimetableListResponse {
  timeTables: TimetableType[];
}

export interface InitTimetableType {
  timeTableName: string;
  semester: string;
}

const InitTimetableSchedules = {
  timeTableId: -1,
  timeTableName: '새 시간표',
  semester: '',
  schedules: [],
};

export const getTimetables = async (): Promise<TimetableListResponse> => {
  return await fetchJsonOnAPI<TimetableListResponse>('/api/timetables');
};

/**
 * TODO: select -> API 연결 후 백엔드에서 필터링 되도록 수정
 * @param semester
 * @returns
 */
export const useTimetables = (semester: string) => {
  return useQuery({
    queryKey: ['timetableList', semester],
    queryFn: getTimetables,
    select: data => data.timeTables.filter(timetable => timetable.semester === semester),
    staleTime: 1000 * 60 * 5,
  });
};

/** timetableId에 대한 Timetable 데이터를 가져옵니다.
 * @param timetableId
 */
export function useGetTimetableSchedules(timetableId?: number, semester?: string) {
  semester = semester ?? SEMESTERS[SEMESTERS.length - 1];
  const { data: subjects } = useSubject(semester);

  const queryFn = async () => {
    if (!timetableId || timetableId <= 0) {
      return {
        timetableId: -1,
        timetableName: '새 시간표',
        semester: '',
        schedules: [],
      };
    }

    return await fetchJsonOnAPI<Timetable>(`/api/timetables/${timetableId}/schedules`);
  };

  return useQuery({
    queryKey: ['timetableData', timetableId],
    queryFn: queryFn,
    select: data => toGeneralSchedules(data, subjects),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 시간표 수정 훅
 * timetableId에에 대한 timetableName을 수정합니다.
 */
export function useUpdateTimetable() {
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
          semester: updated.semester,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      await queryClient.invalidateQueries({ queryKey: ['timetableList', updatedId] });
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
export function useDeleteTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timeTableId: number) => {
      return await fetchOnAPI(`/api/timetables/${timeTableId}`, { method: 'DELETE' });
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
    },
  });
}

/**
 * 시간표 생성 훅
 * 시간표를 생성합니다.
 */
export function useCreateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ timeTableName, semester }: InitTimetableType) => {
      return await fetchJsonOnAPI<TimetableType>('/api/timetables', {
        method: 'POST',
        body: JSON.stringify({
          timeTableName: timeTableName,
          semester: semester,
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
        semester: data.semester,
      });

      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
    onError: async error => {
      try {
        const e = JSON.parse(error.message);
        alert(e.message);
      } catch {
        alert('Error adding Timetable');
      }
      await queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
  });
}

interface ScheduleMutationProps {
  schedule: ScheduleApiResponse;
}

/** 스케줄을 생성하는 Mutation 훅입니다.
 * onMutate: mutation 전에 캐싱된 데이터를 context로 넘겨줍니다.
 * onError: 에러 발생 시 캐싱된 데이터를 롤백합니다.
 * onSuccess: 성공 시 캐싱된 데이터를 업데이트합니다.
 * @param timetableId
 */
export function useCreateSchedule(timetableId?: number) {
  const [searchParams] = useSearchParams();
  const semester = searchParams.get('semester') ?? SEMESTERS[SEMESTERS.length - 1];

  const queryClient = useQueryClient();
  const setSelectedSchedule = useScheduleState(state => state.changeScheduleData);
  const { mutateAsync: createTimetable } = useCreateTimetable();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationProps) => {
      let targetTimetableId = timetableId;

      if (!targetTimetableId || targetTimetableId <= 0) {
        const timetable = await createTimetable({
          timeTableName: '새 시간표',
          semester: semester,
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
          semester: timetable.semester,
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
          if (sch.scheduleId === context.schedule.scheduleId) return schedule; // Update the specific schedule
          return sch; // Return unchanged schedules
        }),
      });
    },
  });
}

/** 스케줄을 업데이트하는 Mutation 훅입니다.
 * onMutate: mutation 전에 캐싱된 데이터를 context로 넘겨줍니다.
 * onError: 에러 발생 시 캐싱된 데이터를 롤백합니다.
 * onSuccess: 성공 시 캐싱된 데이터를 업데이트합니다.
 * @param timetableId
 */
export function useUpdateSchedule(timetableId?: number) {
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
    },
  });
}

/** 스케줄을 삭제하는 Mutation 훅입니다.
 * onMutate: mutation 전에 캐싱된 데이터를 context로 넘겨줍니다.
 * onError: 에러 발생 시 캐싱된 데이터를 롤백합니다.
 * onSuccess: 성공 시 캐싱된 데이터를 업데이트합니다.
 * @param timetableId
 */
export function useDeleteSchedule(timetableId?: number) {
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
        return;
      }

      console.log('스케줄 삭제 성공! 이전 데이터 있음. timetableId:', timetableId, context.prevTimetableSchedules);
      queryClient.setQueryData(['timetableData', timetableId], {
        ...context.prevTimetableSchedules,
        schedules: context.prevTimetableSchedules.schedules.filter(sch => sch.scheduleId !== schedule.scheduleId),
      });

      await queryClient.invalidateQueries({ queryKey: ['timetableData', timetableId] });
    },
  });
}

//// 데이터 변경 로직

/** API에서 받은 Timetable 데이터를 Wishes와 병합하여, Schedule 배열을 반환합니다.
 * @param timetable
 * @param subjects
 */
function toGeneralSchedules(timetable: Timetable, subjects?: Subject[]): GeneralSchedule[] {
  if (!timetable || !subjects) return [];

  const { schedules } = timetable;
  return schedules.map(schedule => new ScheduleAdapter(schedule, subjects).toUiData());
}

/** timetable 데이터를 ScheduleSlots 형태 (UI Data)로 변환합니다.
 * @param generalSchedules - Schedule 배열
 * @param minTime
 */
export function getScheduleSlots(generalSchedules?: GeneralSchedule[], minTime = 9) {
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
export function getEmptyScheduleSlots(generalSchedules?: GeneralSchedule[]): EmptyScheduleSlot[] {
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
