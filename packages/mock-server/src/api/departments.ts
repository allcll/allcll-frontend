import {http, HttpResponse} from "msw";
import {SubjectNotFoundError} from '../data/errorJson.ts';

export const handlers = [
  // GET /api/pins
  http.get('/api/departments', async () => {
    // Return a list of pinned subjects
    const {Departments} = await import('../data/departments');
    return HttpResponse.json(Departments)
  }),
  // GET /api/baskets/{subjectId}
  http.get('/api/baskets/:subjectId', async ({ params }) => {
    const { subjectId } = params;
    const {getDepartmentRegister, mockCartData} = await import('../data/wishes.ts');
    const subject = mockCartData.baskets.find((subject) => subject.subjectId === Number(subjectId));

    if (subject === undefined)
      return HttpResponse.json(SubjectNotFoundError, {status: 400});

    return HttpResponse.json(getDepartmentRegister(subject.totalCount), {status: 200});
  }),
];