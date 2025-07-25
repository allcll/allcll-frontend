import { CustomSchedule, OfficialSchedule, Schedule, Timeslot } from '@/hooks/server/useTimetableData.ts';
import { Day, Wishes } from '@/utils/types.ts';
import { ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';

interface ApiUiAdapter<T, U> {
  data: U; // Initial data
  toApiData: () => T;
  toUiData: () => U;
}

// Todo: Implement TimetableAdapter
// export class TimetableAdapter implements ApiUiAdapter<Timetable> {}

type ScheduleApiResponse = OfficialSchedule | CustomSchedule;

export class ScheduleAdapter implements ApiUiAdapter<ScheduleApiResponse, Schedule> {
  data: Schedule;

  /**
   * Schedule 을 변환하는 어댑터 클래스입니다.
   * @param data - Schedule 또는 ScheduleApiResponse 타입의 데이터, 빈 경우 기본값으로 초기화됩니다.
   * @param wishes - data가 ScheduleApiResponse 인 경우, Wishes 배열이 필요합니다.
   */
  constructor(data?: Schedule | ScheduleApiResponse, wishes?: Wishes[]) {
    if (!data) {
      this.data = this.#toDefaultData();
      return;
    }

    const isApiResponse = data.scheduleType === 'official' && !data.subjectName;
    if (isApiResponse) {
      this.data = this.#apiToUiData(data as ScheduleApiResponse, wishes);
      return;
    }

    this.data = data as Schedule;
  }

  #toDefaultData(): Schedule {
    return {
      scheduleId: -1,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '',
      professorName: '',
      location: '',
      timeslots: [],
    };
  }

  #apiToUiData(schedule: ScheduleApiResponse, wishes?: Wishes[]): Schedule {
    if (!wishes) {
      throw new TypeError('Wishes must be provided for API to UI conversion');
    }

    const wish = wishes.find(w => w.subjectId === schedule.scheduleId);

    // Todo: Add Location Parsing Logic / timeslots
    return {
      scheduleId: schedule.scheduleId,
      scheduleType: schedule.scheduleType,
      subjectId: schedule.subjectId,
      subjectName: wish?.subjectName ?? '',
      professorName: wish?.professorName ?? '',
      location: wish ? '센B209' : '',
      timeslots: [],
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
        timeslots: [],
      };
    }

    return {
      ...schedule,
      scheduleType: 'custom',
      subjectId: null,
    };
  }

  toUiData(): Schedule {
    return this.data;
  }
}

interface TimeslotGeneric {
  dayOfWeek: Day;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export class TimeslotAdapter {
  data: TimeslotGeneric;

  constructor(data?: Timeslot) {
    if (!data) {
      this.data = this.#toDefaultData();
      return;
    }

    this.data = this.#apiToGenericData(data);
  }

  #toDefaultData(): TimeslotGeneric {
    return {
      dayOfWeek: '월',
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
    };
  }

  #apiToGenericData(data: Timeslot): TimeslotGeneric {
    const [sh, sm] = data.startTime.split(':');
    const [eh, em] = data.endTime.split(':');

    return {
      dayOfWeek: data.dayOfWeek,
      startHour: parseInt(sh),
      startMinute: parseInt(sm),
      endHour: parseInt(eh),
      endMinute: parseInt(em),
    };
  }

  toApiData(): Timeslot {
    const pad = (num: number) => num.toString().padStart(2, '0');

    return {
      dayOfWeek: this.data.dayOfWeek,
      startTime: `${pad(this.data.startHour)}:${pad(this.data.startMinute)}`,
      endTime: `${pad(this.data.endHour)}:${pad(this.data.endMinute)}`,
    };
  }

  /** Schedule의 시작 시간과 종료 시간을 계산하여, Schedule의 위치와 크기를 반환합니다.
   * @param minTime
   */
  toUiData(minTime: number) {
    const { startHour, startMinute, endHour, endMinute } = this.data;

    const start = (startHour * 60 + startMinute) / 60;
    const end = (endHour * 60 + endMinute) / 60;
    return {
      width: 'calc(100% - 4px)',
      height: `${(end - start) * ROW_HEIGHT}px`,
      top: `${(start - minTime) * ROW_HEIGHT}px`,
    };
  }
}
