import { http, HttpResponse } from 'msw';
import { DataType, getData } from '../data/caching.ts';
import { ISubjects } from '../data/letures.ts';

export const handlers = [
  http.get('/api/subjects', async () => {
    const { subjectResponses } = (await getData(DataType.LECTURES)) as ISubjects;
    return HttpResponse.json({ subjectResponses });
  }),

  http.post('/api/timetables/:timetableId/schedules', async ({ request }) => {
    const body = (await request.json()) as {
      scheduleType: 'official' | 'custom';
      subjectId?: number;
      subjectName?: string;
      professorName?: string;
      location?: string;
      timeSlots?: {
        dayOfWeeks: string;
        startTime: string;
        endTime: string;
      }[];
    };

    if (body.scheduleType === 'official') {
      return HttpResponse.json(
        {
          scheduleId: 8,
          scheduleType: 'official',
          subjectId: body.subjectId ?? null,
          subjectName: null,
          professorName: null,
          location: null,
          timeSlots: [],
        },
        { status: 201 },
      );
    }

    return HttpResponse.json(
      { code: 'INVALID_SCHEDULE_TYPE', message: 'scheduleType must be "official" or "custom".' },
      { status: 400 },
    );
  }),
];
