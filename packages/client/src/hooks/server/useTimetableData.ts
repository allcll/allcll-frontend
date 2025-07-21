import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';
import { Wishes } from '@/utils/types.ts';
import { ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';

type DayNameType = '월' | '화' | '수' | '목' | '금' | '토' | '일';

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
}
export interface CustomSchedule {
  scheduleId: number;
  scheduleType: 'custom';
  subjectName: string;
  professorName: string;
  location: string;
  dayOfWeek: DayNameType[];
  startTime: string;
  endTime: string;
}

export interface Schedule {
  scheduleId: number;
  scheduleType: 'official' | 'custom';
  subjectName: string;
  professorName: string | null;
  location: string;
  times: {
    dayOfWeek: DayNameType;
    startTime: string;
    endTime: string;
  }[];
}

export interface ScheduleTime {
  title: string;
  professor: string | null;
  location: string | null;
  schedule: OfficialSchedule | CustomSchedule | Schedule; // Reference to the schedule
  color: 'rose' | 'amber' | 'green' | 'emerald' | 'blue' | 'violet';
  width: string;
  height: string;
  top: string;
}

export function useTimetableData(timetableId: number) {
  return useQuery({
    queryKey: ['timetableData'],
    queryFn: async () => await fetchJsonOnAPI<Timetable>(`/api/timetables/${timetableId}`),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}

function mergeTimetableData(timetableData?: Timetable, wishes?: Wishes[]) {
  if (!timetableData || !wishes) return undefined;

  const mergedData: Schedule[] = [];
  timetableData.schedules.forEach(schedule => {
    if (schedule.scheduleType === 'official') {
      const wish = wishes.find(w => w.subjectId === schedule.scheduleId);

      // Todo: Add Location Parsing Logic
      mergedData.push({
        scheduleId: schedule.scheduleId,
        scheduleType: schedule.scheduleType,
        subjectName: wish ? wish.subjectName : `과목 ${schedule.scheduleId}`,
        professorName: wish ? wish.professorName : `교수 ${schedule.scheduleId}`,
        location: wish ? '센B209' : `장소 ${schedule.scheduleId}`,
        times: [],
      });
    } else {
      mergedData.push({
        scheduleId: schedule.scheduleId,
        scheduleType: schedule.scheduleType,
        subjectName: schedule.subjectName,
        professorName: schedule.professorName,
        location: schedule.location,
        times: schedule.dayOfWeek.map(day => ({
          dayOfWeek: day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        })),
      });
    }
  });

  return mergedData;
}

export function scheduleTimeAdapter(timetable: Timetable, wishes?: Wishes[]) {
  const colors: ScheduleTime['color'][] = ['rose', 'amber', 'green', 'emerald', 'blue', 'violet'];

  const scheduleTimes: Record<string, ScheduleTime[]> = {};
  const mergedData = mergeTimetableData(timetable, wishes);
  const settings = getSettings(mergedData);

  if (!mergedData) return undefined;

  mergedData.forEach((schedule, index) => {
    const color = colors[index % colors.length];
    const { subjectName: title, professorName: professor, location } = schedule;

    schedule.times.forEach(time => {
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

function getPositionFromString(startTime: number, time: Schedule['times'][number]) {
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
    if (item.times.some(time => time.dayOfWeek === '토')) hasSaturday = true;
    if (item.times.some(time => time.dayOfWeek === '일')) hasSunday = true;
  });

  const colNames = ['월', '화', '수', '목', '금'];
  if (hasSunday) {
    colNames.push('토');
    colNames.push('일');
  } else if (hasSaturday) {
    colNames.push('토');
  }

  // Timetable의 시작시간, 종료시간을 계산
  const { minTime, maxTime } = schedule.reduce(
    (acc, item) => {
      item.times.forEach(time => {
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
