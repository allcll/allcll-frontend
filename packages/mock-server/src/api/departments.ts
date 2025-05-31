import { http, HttpResponse } from 'msw';
import { SubjectNotFoundError } from '../data/errorJson.ts';
import { DataType, getData } from '../data/caching.ts';
import { subjects } from '../data/subjects.ts';

export interface IDepartments {
  departments: Department[];
}
interface Department {
  departmentName: string;
  departmentCode: string;
}

export const handlers = [
  // GET /api/pins
  http.get('/api/departments', async () => {
    // Return a list of pinned subjects
    const { departments } = (await getData(DataType.DEPARTMENTS)) as IDepartments;
    return HttpResponse.json(departments);
  }),
  // GET /api/baskets/{subjectId}
  http.get('/api/baskets/:subjectId', async ({ params }) => {
    const { subjectId } = params;
    const { getDepartmentRegister } = await import('../data/wishes.ts');
    const subject = subjects.find(subject => subject.subjectId === Number(subjectId));

    if (subject === undefined) return HttpResponse.json(SubjectNotFoundError, { status: 400 });

    return HttpResponse.json(getDepartmentRegister(subject.totalCount), { status: 200 });
  }),
];
