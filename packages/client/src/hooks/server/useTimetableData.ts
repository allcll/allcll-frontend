import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';
import { Wishes } from '@/utils/types.ts';
import { ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';
import useWishes from '@/hooks/server/useWishes.ts';
import { timetableAPIDummies } from '@/utils/timetable/dummies.ts';

export type DayNameType = '월' | '화' | '수' | '목' | '금' | '토' | '일';

export interface Timetable {
  timetableId: number;
  timetableName: string;
  semester: string; // e.g., "2025-1"
  schedules: (OfficialSchedule | CustomSchedule)[];
}
export interface OfficialSchedule {
  scheduleId: number;
  scheduleType: 'official';
  subjectId: number;
  subjectName: null;
  professorName: null;
  location: null;
  timeslots: never[];
}
export interface CustomSchedule extends Schedule {
  scheduleType: 'custom';
  subjectId: null;
}

// 정보를 모두 담는 Schedule 인터페이스
export interface Schedule {
  scheduleId: number;
  scheduleType: 'official' | 'custom';
  subjectId: number | null;
  subjectName: string;
  professorName: string;
  location: string;
  timeslots: {
    dayOfWeek: DayNameType;
    startTime: string;
    endTime: string;
  }[];
}

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

export function useTimetableData(timetableId?: number) {
  const { data: wishes } = useWishes();

  return useQuery({
    queryKey: ['timetableData', timetableId],
    queryFn: () => {
      // await fetchJsonOnAPI<Timetable>(`/api/timetables/${timetableId}`);
      return timetableAPIDummies;
    },
    select: data => scheduleTimeAdapter(data, wishes),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!timetableId && timetableId > 0,
  });
}

interface ScheduleMutationData {
  schedule: OfficialSchedule | CustomSchedule;
  prevTimetable: Timetable;
}

export function useCreateSchedule(timetableId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationData) =>
      await fetchJsonOnAPI(`/api/timetables/${timetableId}/schuedules`, {
        method: 'POST',
        body: JSON.stringify(schedule),
      }),
    onMutate: async mutateData => {
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return mutateData;
    },
  });
}

export function useUpdateSchedule(timetableId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationData) =>
      await fetchJsonOnAPI(`/api/timetables/${timetableId}/schuedules/${schedule.scheduleId}`, {
        method: 'PUT',
        body: JSON.stringify(schedule),
      }),
    onMutate: async mutateData => {
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return mutateData;
    },
  });
}

export function useDeleteSchedule(timetableId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ schedule }: ScheduleMutationData) =>
      await fetchJsonOnAPI(`/api/timetables/${timetableId}/schuedules/${schedule.scheduleId}`, { method: 'DELETE' }),
    onMutate: async mutateData => {
      // Optimistically update the timetable data
      await queryClient.cancelQueries({ queryKey: ['timetableData', timetableId] });
      return mutateData;
    },
  });
}

//// api 데이터 변경 로직

interface IApiScheduleData {
  schedules: (OfficialSchedule | CustomSchedule)[];
}

function mergeTimetableData(apiScheduleData?: IApiScheduleData, wishes?: Wishes[]) {
  if (!apiScheduleData || !wishes) return undefined;

  const mergedData: Schedule[] = [];
  apiScheduleData.schedules.forEach(schedule => {
    if (schedule.scheduleType === 'official') {
      const wish = wishes.find(w => w.subjectId === schedule.scheduleId);

      // Todo: Add Location Parsing Logic / timeslots
      mergedData.push({
        scheduleId: schedule.scheduleId,
        scheduleType: schedule.scheduleType,
        subjectId: schedule.subjectId,
        subjectName: wish?.subjectName ?? '',
        professorName: wish?.professorName ?? '',
        location: wish ? '센B209' : '',
        timeslots: [],
      });
    } else {
      mergedData.push({ ...schedule });
    }
  });

  return mergedData;
}

export function scheduleTimeAdapter(timetable: IApiScheduleData, wishes?: Wishes[]) {
  const colors: ScheduleTime['color'][] = ['rose', 'amber', 'green', 'emerald', 'blue', 'violet'];

  const scheduleTimes: Record<string, ScheduleTime[]> = {};
  const mergedData = mergeTimetableData(timetable, wishes);
  const settings = getSettings(mergedData);

  if (!mergedData) return undefined;

  mergedData.forEach((schedule, index) => {
    const color = colors[index % colors.length];
    const { subjectName: title, professorName: professor, location } = schedule;

    schedule.timeslots.forEach(time => {
      if (!scheduleTimes[time.dayOfWeek]) {
        scheduleTimes[time.dayOfWeek] = [];
      }

      scheduleTimes[time.dayOfWeek].push({
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

function getPositionFromString(startTime: number, time: Schedule['timeslots'][number]) {
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

function getSettings(schedule?: Schedule[]) {
  if (!schedule) return undefined;

  // 요일을 활성화 할지 판단하는 로직
  let hasSaturday = false;
  let hasSunday = false;
  schedule.forEach(item => {
    if (item.timeslots.some(time => time.dayOfWeek === '토')) hasSaturday = true;
    if (item.timeslots.some(time => time.dayOfWeek === '일')) hasSunday = true;
  });

  const colNames: DayNameType[] = ['월', '화', '수', '목', '금'];
  if (hasSunday) {
    colNames.push('토');
    colNames.push('일');
  } else if (hasSaturday) {
    colNames.push('토');
  }

  // Timetable의 시작시간, 종료시간을 계산
  const { minTime, maxTime } = schedule.reduce(
    (acc, item) => {
      item.timeslots.forEach(time => {
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
