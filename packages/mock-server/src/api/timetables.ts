import { http, HttpResponse } from 'msw';
import { TimetableSchedulesRes } from '../data/timetables.ts';

export const handlers = [
  // GET /api/timetables
  http.get('/api/timetables', async () => {
    // Return a list of pinned subjects
    return HttpResponse.json({
      timeTables: [
        {
          timeTableId: 1,
          timeTableName: '시간표1',
          semester: '2025-2',
        },
        {
          timeTableId: 2,
          timeTableName: '시간표2',
          semester: '2025-2',
        },
      ],
    });
  }),
  // GET /api/pins
  http.get('/api/timetables/:timetableId/schedules', async () => {
    // Return a list of pinned subjects
    return HttpResponse.json(TimetableSchedulesRes);
  }),
];
