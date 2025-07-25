import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api.ts';
import { Day, Wishes } from '@/utils/types.ts';
import { ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';
import useWishes from '@/hooks/server/useWishes.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';

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
  timeSlots: never[];
}

export interface CustomSchedule extends Schedule {
  scheduleType: 'custom';
  subjectId: null;
}

type ScheduleApiResponse = OfficialSchedule | CustomSchedule;

// 정보를 모두 담는 Schedule 인터페이스 - 코드 전반에 사용
export interface Schedule {
  scheduleId: number;
  scheduleType: 'official' | 'custom';
  subjectId: number | null;
  subjectName: string;
  professorName: string;
  location: string;
  timeSlots: {
    dayOfWeeks: Day;
    startTime: string;
    endTime: string;
  }[];
}

// Todo: Render에 필요한 데이터로 변환 / 필요 없는 정보 제거하기
export interface ScheduleTime {
  title: string;
  professor: string | null;
  location: string | null;
  schedule: Schedule;
  color: 'rose' | 'amber' | 'green' | 'emerald' | 'blue' | 'violet';
  width: string;
  height: string;
  top: string;
}

export const initCustomSchedule: Schedule = {
  scheduleId: -1,
  scheduleType: 'custom',
  subjectId: null,
  subjectName: '',
  professorName: '',
  location: '',
  timeSlots: [],
};

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

export const getTimetables = async (): Promise<TimetableListResponse> => {
  return await fetchJsonOnAPI<TimetableListResponse>('/api/timetables');
};

export const useTimetables = () => {
  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const timetableId = currentTimetable?.timeTableId ?? -1;
  const pickTimetable = useScheduleState(state => state.pickTimetable);

  const onSelect = (res: TimetableListResponse) => {
    const { timeTables } = res;

    if (timetableId === -1 && timeTables.length > 0) {
      pickTimetable(timeTables[0]);
    }

    return timeTables;
  };

  return useQuery({
    queryKey: ['timetableList'],
    queryFn: getTimetables,
    select: onSelect,
    staleTime: 1000 * 60 * 5,
  });
};

// Fixme: useTimetableSchedules로 이름 변경하기
/** timetableId에 대한 Timetable 데이터를 가져옵니다.
 * @param timetableId
 */
export function useTimetableData(timetableId?: number) {
  const { data: wishes } = useWishes();

  return useQuery({
    queryKey: ['timetableData', timetableId],
    queryFn: async () => await fetchJsonOnAPI<Timetable>(`/api/timetables/${timetableId}/schedules`),

    select: data => scheduleTimeAdapter(data, wishes),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!timetableId && timetableId > 0,
  });
}

/**
 * 시간표 수정 훅
 * timetableId에에 대한 timetableName을 수정합니다.
 */
export function useUpdateTimetable() {
  const queryClient = useQueryClient();

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
    onError: (error, _variables, context) => {
      console.error(`시간표 수정 실패 (id: ${context?.timeTableId})`, error);
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      queryClient.invalidateQueries({ queryKey: ['timetableList', context?.timeTableId] });
    },
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      queryClient.invalidateQueries({ queryKey: ['timetableList', context?.timeTableId] });
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
      await queryClient.cancelQueries({ queryKey: ['timetableList', timeTableId] });
      return { timeTableId };
    },
    onError: (error, timeTableId) => {
      console.error(`시간표 삭제 실패 (id: ${timeTableId})`, error);
      queryClient.invalidateQueries({ queryKey: ['timetableList', timeTableId] });
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
    onSuccess: (_, timeTableId) => {
      queryClient.invalidateQueries({ queryKey: ['timetableList', timeTableId] });
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
  });
}

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
    onMutate: async ({ timeTableName, semester }: InitTimetableType) => {
      await queryClient.cancelQueries({ queryKey: ['timetableList'] });
      const { timeTables: previousTimetables } = queryClient.getQueryData<TimetableListResponse>(['timetableList']) ?? {
        timetables: [],
      };

      const newTimetable: TimetableType = {
        timeTableId: -1,
        timeTableName: timeTableName,
        semester: semester,
      };

      if (previousTimetables) {
        const newTimetables = [...previousTimetables, newTimetable];

        queryClient.setQueryData<TimetableListResponse>(['timetableList'], { timeTables: newTimetables });
        previousTimetables.push(newTimetable);
      }

      return { previousTimetables };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
    onError: error => {
      try {
        const e = JSON.parse(error.message);
        alert(e.message);
      } catch {
        alert('Error adding Timetable');
      }
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
    },
  });
}

interface ScheduleMutationData {
  schedule: ScheduleApiResponse;
  prevTimetable?: Timetable;
}

/** 스케줄을 생성하는 Mutation 훅입니다.
 * onMutate: mutation 전에 캐싱된 데이터를 context로 넘겨줍니다.
 * onError: 에러 발생 시 캐싱된 데이터를 롤백합니다.
 * onSuccess: 성공 시 캐싱된 데이터를 업데이트합니다.
 * @param timetableId
 */
export function useCreateSchedule(timetableId?: number) {
  const queryClient = useQueryClient();
  const setTimetableId = useScheduleState(state => state.pickTimetable);
  const { mutateAsync: createTimetable } = useCreateTimetable();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationData) => {
      let newTimetableId = timetableId;

      if (!timetableId || timetableId <= 0) {
        const timetable = await createTimetable({ timeTableName: '새 시간표', semester: '2025-2' });
        setTimetableId(timetable);
      }

      console.log('POST요청 전 새로운 스케줄', schedule, schedule.timeSlots);

      await fetchJsonOnAPI<ScheduleApiResponse>(`/api/timetables/${newTimetableId}/schedules`, {
        method: 'POST',
        body: JSON.stringify(schedule),
      });
    },
    // Fixme: timetable 도 같이 생성 될 때 오류 처리하기
    onMutate: async mutateData => {
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return mutateData;
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(['timetableData', timetableId], context?.prevTimetable);
      console.error(error);
    },
    onSuccess: async (schedule, _, context) => {
      console.log('요청 성공:', schedule);
      if (!context?.prevTimetable) {
        queryClient.invalidateQueries({ queryKey: ['timetableList'] });
        queryClient.invalidateQueries({ queryKey: ['timetableData', timetableId] });
        return;
      }

      console.log('POST요청 전 이전 데이터와 새 데이터 합치는 스케줄', [...context.prevTimetable.schedules, schedule]);

      queryClient.setQueryData(['timetableData', timetableId], {
        ...context.prevTimetable,
        schedules: [...context.prevTimetable.schedules, schedule],
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
    mutationFn: async ({ schedule }: ScheduleMutationData) =>
      await fetchJsonOnAPI<ScheduleApiResponse>(`/api/timetables/${timetableId}/schedules/${schedule.scheduleId}`, {
        method: 'PATCH',
        body: JSON.stringify(schedule),
      }),
    onMutate: async mutateData => {
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return mutateData;
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(['timetableData', timetableId], context?.prevTimetable);
      console.error(error);
    },
    onSuccess: async (schedule, _, context) => {
      if (!context?.prevTimetable) {
        queryClient.invalidateQueries({ queryKey: ['timetableList'] });
        queryClient.invalidateQueries({ queryKey: ['timetableData', timetableId] });
        return;
      }

      queryClient.setQueryData(['timetableData', timetableId], {
        ...context.prevTimetable,
        schedules: context.prevTimetable.schedules.map(sch => {
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
    mutationFn: async ({ schedule }: ScheduleMutationData) =>
      await fetchJsonOnAPI(`/api/timetables/${timetableId}/schedules/${schedule.scheduleId}`, { method: 'DELETE' }),
    onMutate: async mutateData => {
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return mutateData;
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(['timetableData', timetableId], context?.prevTimetable);
      console.error(error);
    },
    onSuccess: async (_, { schedule }, context) => {
      if (!context?.prevTimetable) {
        queryClient.invalidateQueries({ queryKey: ['timetableList'] });
        queryClient.invalidateQueries({ queryKey: ['timetableData', timetableId] });
        return;
      }

      queryClient.setQueryData(['timetableData', timetableId], {
        ...context.prevTimetable,
        schedules: context.prevTimetable.schedules.filter(sch => sch.scheduleId !== schedule.scheduleId),
      });
    },
  });
}

//// api 데이터 변경 로직

interface IApiScheduleData {
  schedules: ScheduleApiResponse[];
}

/** API에서 받은 Timetable 데이터를 Wishes와 병합하여, Schedule 배열을 반환합니다.
 * @param apiScheduleData
 * @param wishes
 */
function mergeTimetableData(apiScheduleData?: IApiScheduleData, wishes?: Wishes[]) {
  if (!apiScheduleData || !wishes) return undefined;

  const mergedData: Schedule[] = [];
  apiScheduleData.schedules.forEach(schedule => {
    if (schedule.scheduleType === 'official') {
      const wish = wishes.find(w => w.subjectId === schedule.scheduleId);

      // Todo: Add Location Parsing Logic / timeSlots
      mergedData.push({
        scheduleId: schedule.scheduleId,
        scheduleType: schedule.scheduleType,
        subjectId: schedule.subjectId,
        subjectName: wish?.subjectName ?? '',
        professorName: wish?.professorName ?? '',
        location: wish ? '센B209' : '',
        timeSlots: [],
      });
    } else {
      mergedData.push({ ...schedule });
    }
  });

  return mergedData;
}

/** timetable 데이터를 ScheduleTime 형태로 변환합니다.
 * @param timetable
 * @param wishes
 */
export function scheduleTimeAdapter(timetable: IApiScheduleData, wishes?: Wishes[]) {
  const colors: ScheduleTime['color'][] = ['rose', 'amber', 'green', 'emerald', 'blue', 'violet'];

  const scheduleTimes: Record<string, ScheduleTime[]> = {};
  const mergedData = mergeTimetableData(timetable, wishes);
  const settings = getSettings(mergedData);

  if (!mergedData) return undefined;

  mergedData.forEach((schedule, index) => {
    const color = colors[index % colors.length];
    const { subjectName: title, professorName: professor, location } = schedule;

    schedule.timeSlots.forEach(time => {
      if (!scheduleTimes[time.dayOfWeeks]) {
        scheduleTimes[time.dayOfWeeks] = [];
      }

      scheduleTimes[time.dayOfWeeks].push({
        title,
        professor,
        location,
        schedule,
        color,
        ...getPositionFromString(settings?.minTime ?? 9, time),
      });
    });
  });

  return {
    ...settings,
    scheduleTimes,
  };
}

/** Schedule의 시작 시간과 종료 시간을 계산하여, Schedule의 위치와 크기를 반환합니다.
 * @param startTime
 * @param time
 */
function getPositionFromString(startTime: number, time: Schedule['timeSlots'][number]) {
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const start = parseTime(time.startTime) / 60;
  const end = parseTime(time.endTime) / 60;
  return {
    width: 'calc(100% - 4px)',
    height: `${(end - start) * ROW_HEIGHT}px`, // Assuming each hour is 60px tall
    top: `${(start - startTime) * ROW_HEIGHT}px`, // Assuming each hour is 60px tall
  };
}

/** Timetable을 렌더링 할 때 필요한 정보 (위치, 크기)를 반환합니다.
 * @param schedule
 */
function getSettings(schedule?: Schedule[]) {
  if (!schedule) return undefined;

  // 요일을 활성화 할지 판단하는 로직
  let hasSaturday = false;
  let hasSunday = false;
  schedule.forEach(item => {
    if (item.timeSlots.some(time => time.dayOfWeeks === '토')) hasSaturday = true;
    if (item.timeSlots.some(time => time.dayOfWeeks === '일')) hasSunday = true;
  });

  const colNames: Day[] = ['월', '화', '수', '목', '금'];
  if (hasSunday) {
    colNames.push('토');
    colNames.push('일');
  } else if (hasSaturday) {
    colNames.push('토');
  }

  // Timetable의 시작시간, 종료시간을 계산
  const { minTime, maxTime } = schedule.reduce(
    (acc, item) => {
      item.timeSlots.forEach(time => {
        const start = parseInt(time.startTime.split(':')[0]);
        const end = parseInt(time.endTime.split(':')[0]);
        acc.minTime = Math.min(acc.minTime, start);
        acc.maxTime = Math.max(acc.maxTime, end);
      });
      return acc;
    },
    { minTime: 9, maxTime: 20 },
  );

  return {
    colNames,
    rowNames: Array.from({ length: maxTime - minTime + 1 }, (_, i) => `${i + minTime}`),
    maxTime,
    minTime,
  };
}

/** Schedule을 API에서 사용하는 형식으로 변환합니다.
 * Todo: Adapter 형식으로 변환하기
 * @param schedule
 */
export function scheduleAsApiSchedule(schedule: Schedule): ScheduleApiResponse {
  if (schedule.scheduleType === 'official') {
    return {
      scheduleId: schedule.scheduleId,
      scheduleType: 'official',
      subjectId: schedule.subjectId ?? 0,
      subjectName: null,
      professorName: null,
      location: null,
      timeSlots: [],
    };
  } else {
    return {
      ...schedule,
      scheduleType: 'custom',
      subjectId: null,
    };
  }
}
