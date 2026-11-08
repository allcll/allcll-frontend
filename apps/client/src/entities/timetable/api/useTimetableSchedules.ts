import { useQuery } from '@tanstack/react-query';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import { ScheduleAdapter } from '@/entities/timetable/model/adapter.ts';
import { fetchJsonOnAPI } from '@/shared/api/api.ts';
import { Subject } from '@/shared/model/types.ts';
import { Day } from '@/entities/timetable/model/types.ts';
import { RECENT_SEMESTERS } from '@/entities/semester/api/semester';

export interface Timetable {
  timetableId: number;
  timetableName: string;
  semesterCode: string; // e.g., "2025-1"
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

export type ScheduleApiResponse = OfficialSchedule | CustomSchedule;

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
  semesterCode: string; // ex: "SPRING_2025"
}

export interface TimetableListResponse {
  timeTables: TimetableType[];
}

export interface InitTimetableType {
  timeTableName: string;
  semesterCode: string;
}

export const getTimetables = async (semesterCode: string): Promise<TimetableListResponse> => {
  return await fetchJsonOnAPI<TimetableListResponse>(
    `/api/timetables?semesterCode=${encodeURIComponent(semesterCode)}`,
    {
      method: 'GET',
    },
  );
};

/**
 * TODO: select -> API 연결 후 백엔드에서 필터링 되도록 수정
 * @param semesterCode
 * @returns
 */
export const useTimetables = (semesterCode: string) => {
  return useQuery({
    queryKey: ['timetableList', semesterCode],
    queryFn: () => getTimetables(semesterCode),
    select: data => data.timeTables,
    staleTime: 1000 * 60 * 5,
  });
};

/** timetableId에 대한 Timetable 데이터를 가져옵니다.
 * @param timetableId
 * @param semester
 */
export function useGetTimetableSchedules(timetableId?: number, semester?: string) {
  semester = semester ?? RECENT_SEMESTERS.semesterCode;
  const { data: subjects } = useSubject(semester);

  const queryFn = async () => {
    if (!timetableId || timetableId <= 0) {
      return {
        timetableId: -1,
        timetableName: '새 시간표',
        semesterCode: '',
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
