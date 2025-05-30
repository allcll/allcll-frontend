import { http, HttpResponse } from 'msw';
import { SubjectNotFoundError } from '../data/errorJson.ts';

export const handlers = [
  // GET /api/pins
  http.get('/api/departments', async () => {
    // Return a list of pinned subjects
    const { departments } = await import('@public/departments.json');
    return HttpResponse.json(departments);
  }),
  // GET /api/baskets/{subjectId}
  http.get('/api/baskets/:subjectId', async ({ params }) => {
    const { subjectId } = params;
    const { getDepartmentRegister } = await import('../data/wishes.ts');
    const { baskets: mockCartData } = await import('@public-client/baskets.json');
    const subject = mockCartData.find(subject => subject.subjectId === Number(subjectId));

    if (subject === undefined) return HttpResponse.json(SubjectNotFoundError, { status: 400 });

    return HttpResponse.json(getDepartmentRegister(subject.totalCount), { status: 200 });
  }),
];
