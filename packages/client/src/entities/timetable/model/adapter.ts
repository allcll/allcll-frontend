import {
  CustomSchedule,
  OfficialSchedule,
  GeneralSchedule,
  TimeSlot,
} from '@/entities/timetable/api/useTimetableSchedules.ts';
import { ROW_HEIGHT } from '@/widgets/timetable/TimetableComponent.tsx';
import { Subject } from '@/shared/model/types.ts';
import { Day } from '@/features/filtering/model/types.ts';

interface ApiUiAdapter<T, U> {
  data: U; // Initial data
  toApiData: () => T;
  toUiData: () => U;
}

type ScheduleApiResponse = OfficialSchedule | CustomSchedule;

export class ScheduleAdapter implements ApiUiAdapter<ScheduleApiResponse, GeneralSchedule> {
  data: GeneralSchedule;

  /**
   * Schedule 을 변환하는 어댑터 클래스입니다.
   * @param data - Schedule 또는 ScheduleApiResponse 타입의 데이터, 빈 경우 기본값으로 초기화됩니다.
   * @param subjects - data가 ScheduleApiResponse 인 경우, Wishes 배열이 필요합니다.
   */
  constructor(data?: GeneralSchedule | ScheduleApiResponse, subjects?: Subject | Subject[]) {
    if (!data) {
      this.data = this.#toDefaultData();
      return;
    }

    const isApiResponse = data.scheduleType === 'official' && !data.subjectName;
    if (isApiResponse) {
      this.data = this.#apiToUiData(data as ScheduleApiResponse, subjects);
      return;
    }

    this.data = data as GeneralSchedule;
    if (!this.data.timeSlots) this.data.timeSlots = [];
  }

  #toDefaultData(): GeneralSchedule {
    return {
      scheduleId: -1,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '',
      professorName: '',
      location: '',
      tmNum: '',
      isDeleted: false,
      timeSlots: [],
    };
  }

  #apiToUiData(schedule: ScheduleApiResponse, subjects?: Subject | Subject[]): GeneralSchedule {
    if (!subjects) {
      throw new TypeError('Subjects must be provided for API to UI conversion');
    }

    const subj = subjects instanceof Array ? subjects.find(s => s.subjectId === schedule.subjectId) : subjects;

    return {
      scheduleId: schedule.scheduleId,
      scheduleType: schedule.scheduleType,
      subjectId: schedule.subjectId,
      subjectName: subj?.subjectName ?? '',
      professorName: subj?.professorName ?? '',
      location: subj?.lesnRoom ?? '',
      tmNum: subj?.tmNum ?? '',
      isDeleted: subj?.isDeleted ?? false,
      timeSlots: new TimeslotAdapter(subj?.lesnTime).toApiData(),
    };
  }

  toApiData(): ScheduleApiResponse {
    const schedule = this.data;

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
    }

    return {
      ...schedule,
      scheduleType: 'custom',
      subjectId: null,
    };
  }

  toUiData(): GeneralSchedule {
    return this.data;
  }
}

interface GeneralTimeslot {
  dayOfWeeks: Day;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export class TimeslotAdapter {
  data: GeneralTimeslot[];

  constructor(data?: TimeSlot | TimeSlot[] | string | null) {
    if (!data) {
      this.data = [];
      return;
    }

    // lesnTime 형식
    if (typeof data === 'string') {
      this.data = this.#parseLesnTime(data);
      return;
    }

    if (Array.isArray(data)) {
      this.data = data.map(d => this.#apiToGenericData(d));
      return;
    }

    this.data = [this.#apiToGenericData(data)];
  }

  // #toDefaultData(): GeneralTimeslot {
  //   return {
  //     dayOfWeeks: '월',
  //     startHour: 9,
  //     startMinute: 0,
  //     endHour: 10,
  //     endMinute: 0,
  //   };
  // }

  #apiToGenericData(data: TimeSlot): GeneralTimeslot {
    const [sh, sm] = data.startTime.split(':');
    const [eh, em] = data.endTime.split(':');

    return {
      dayOfWeeks: data.dayOfWeeks,
      startHour: parseInt(sh),
      startMinute: parseInt(sm),
      endHour: parseInt(eh),
      endMinute: parseInt(em),
    };
  }

  #parseLesnTime(lesnTM: string) {
    const pattern = /([월화수목금토일]+)(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/g;

    const result = [];
    let match;

    while ((match = pattern.exec(lesnTM)) !== null) {
      const daysStr = match[1]; // '화목' 또는 '금'
      const start = match[2]; // '13:30'
      const end = match[3]; // '15:00'

      const days = daysStr.split(''); // ['화', '목']
      for (const day of days) {
        result.push(
          this.#apiToGenericData({
            dayOfWeeks: day as Day,
            startTime: start,
            endTime: end,
          }),
        );
      }
    }

    return result;
  }

  validate() {
    return this.data.every(slot => {
      const { startHour, startMinute, endHour, endMinute } = slot;
      return startHour < endHour || (startHour === endHour && startMinute < endMinute);
    });
  }

  toApiData(): TimeSlot[] {
    const pad = (num: number) => num.toString().padStart(2, '0');

    return this.data.map(d => ({
      dayOfWeeks: d.dayOfWeeks,
      startTime: `${pad(d.startHour)}:${pad(d.startMinute)}`,
      endTime: `${pad(d.endHour)}:${pad(d.endMinute)}`,
    }));
  }

  /** Schedule의 시작 시간과 종료 시간을 계산하여, Schedule의 위치와 크기를 반환합니다.
   * @param minTime
   */
  toUiData(minTime: number) {
    return this.data.map(({ startHour, startMinute, endHour, endMinute, dayOfWeeks }) => {
      const start = (startHour * 60 + startMinute) / 60;
      const end = (endHour * 60 + endMinute) / 60;
      return {
        dayOfWeek: dayOfWeeks,
        depth: 0,
        left: '0px',
        right: '0px',
        height: `${(end - start) * ROW_HEIGHT}px`,
        top: `${(start - minTime) * ROW_HEIGHT}px`,
      };
    });
  }
}
export function moveTimeSlot(timeSlots: TimeSlot, diffDay: number, diffTime: number): TimeSlot {
  const { dayOfWeeks, startTime, endTime } = timeSlots;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // 시간 이동
  const newStart = Math.min(24, startHour + startMinute / 60 + diffTime);
  const newEnd = Math.min(24, endHour + endMinute / 60 + diffTime);

  const newStartHour = Math.floor(newStart);
  const newStartMinute = Math.round((newStart - newStartHour) * 60);
  const newEndHour = Math.floor(newEnd);
  const newEndMinute = Math.round((newEnd - newEndHour) * 60);

  // 요일 이동
  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
  const currentIndex = daysOfWeek.indexOf(dayOfWeeks);
  const newIndex = (currentIndex + diffDay + daysOfWeek.length) % daysOfWeek.length;
  const newDayOfWeeks = daysOfWeek[newIndex];

  return {
    dayOfWeeks: newDayOfWeeks as Day,
    startTime: `${newStartHour.toString().padStart(2, '0')}:${newStartMinute.toString().padStart(2, '0')}`,
    endTime: `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`,
  };
}
