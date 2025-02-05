import {http, HttpResponse} from "msw";
import {Departments} from '../data/departments';
import {getDepartmentRegister, mockCartData} from '../data/wishes.ts';
import {SubjectNotFoundError} from '../data/errorJson.ts';

export const handlers = [
  // GET /api/pins
  http.get('/api/departments', () => {
    // Return a list of pinned subjects
    return HttpResponse.json(Departments)
  }),
  // GET /api/baskets/{subjectId}
  http.get('/api/baskets/:subjectId', ({ params }) => {
    const { subjectId } = params;
    const subject = mockCartData.baskets.find((subject) => subject.subjectId === Number(subjectId));

    if (subject === undefined)
      return HttpResponse.json(SubjectNotFoundError, {status: 400});

    return HttpResponse.json(getDepartmentRegister(subject.totalCount), {status: 200});
  }),
];