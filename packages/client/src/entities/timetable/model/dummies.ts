import { Timetable } from '@/entities/timetable/api/useTimetableSchedules.ts';

export const timetableAPIDummies: Timetable = {
  timetableId: 1,
  timetableName: '새 시간표',
  semester: '2025-1',
  schedules: [
    {
      scheduleId: 1,
      scheduleType: 'official',
      subjectId: 2562,
      subjectName: null,
      professorName: null,
      location: null,
      timeSlots: [],
    },
    {
      scheduleId: 2,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '캡스톤 디자인',
      professorName: '박교수',
      location: '산학협력관 102호',
      timeSlots: [
        {
          dayOfWeeks: '화',
          startTime: '16:00',
          endTime: '18:50',
        },
        {
          dayOfWeeks: '목',
          startTime: '16:00',
          endTime: '18:50',
        },
      ],
    },
    {
      scheduleId: 3,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '알고리즘',
      professorName: '김교수',
      location: '센B201',
      timeSlots: [
        {
          dayOfWeeks: '월',
          startTime: '09:00',
          endTime: '10:30',
        },
        {
          dayOfWeeks: '수',
          startTime: '09:00',
          endTime: '10:30',
        },
        {
          dayOfWeeks: '금',
          startTime: '09:00',
          endTime: '10:30',
        },
      ],
    },
    {
      scheduleId: 4,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '컴퓨터네트워크',
      professorName: '최교수',
      location: '센B209',
      timeSlots: [
        {
          dayOfWeeks: '화',
          startTime: '10:40',
          endTime: '12:10',
        },
        {
          dayOfWeeks: '목',
          startTime: '10:40',
          endTime: '12:10',
        },
      ],
    },
    {
      scheduleId: 5,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '소프트웨어공학',
      professorName: '정교수',
      location: '센B210',
      timeSlots: [
        {
          dayOfWeeks: '월',
          startTime: '13:00',
          endTime: '14:30',
        },
        {
          dayOfWeeks: '수',
          startTime: '13:00',
          endTime: '14:30',
        },
        {
          dayOfWeeks: '금',
          startTime: '13:00',
          endTime: '14:30',
        },
      ],
    },
    {
      scheduleId: 6,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '알바',
      professorName: '',
      location: '카페',
      timeSlots: [
        {
          dayOfWeeks: '월',
          startTime: '18:50',
          endTime: '22:00',
        },
        {
          dayOfWeeks: '수',
          startTime: '18:50',
          endTime: '22:00',
        },
      ],
    },
  ],
};
