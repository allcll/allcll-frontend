export const TimetableSchedulesRes = {
  timetableId: 30,
  timetableName: '시간표1',
  semester: '2025-2',
  schedules: [
    {
      scheduleId: 3,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '일반과목',
      professorName: '채현우',
      location: '센B204',
      timeSlots: null,
    },
    {
      scheduleId: 65,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '일반과목',
      professorName: '채현우',
      location: '센B204',
      timeSlots: [
        {
          dayOfWeeks: '수',
          startTime: '11:50',
          endTime: '14:10',
        },
      ],
    },
    {
      scheduleId: 91,
      scheduleType: 'official',
      subjectId: 4371,
      subjectName: null,
      professorName: null,
      location: null,
      timeSlots: [],
    },
    {
      scheduleId: 92,
      scheduleType: 'official',
      subjectId: 4661,
      subjectName: null,
      professorName: null,
      location: null,
      timeSlots: [],
    },
  ],
};
