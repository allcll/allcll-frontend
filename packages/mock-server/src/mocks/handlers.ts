import { http, HttpResponse } from 'msw';
import { handlers as pinHandlers } from '../api/pin.ts';
import { handlers as sseHandlers } from '../api/sse.ts';
import { handlers as wishHandlers } from '../api/wishes.ts';
import { handlers as departmentHandlers } from '../api/departments.ts';
import { getRandomSubjects } from '../data/subjects.ts';
import { handlers as subjectHandlers } from '../api/subjects.ts';

const TopMajors = getRandomSubjects(10);

export const handlers = [
  // POST /api/set-major
  http.post('/api/set-major', () => {
    // Handle the request and return a response
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/major
  http.get('/api/major', () => {
    // Return a list of ten majors as random data
    return HttpResponse.json(TopMajors);
  }),

  // // GET /api/subjects
  // http.get('/api/subjects', () => {
  //   // const param = req.url.searchParams.get('param')
  //   // Return subjects based on the param
  //   return HttpResponse.json(SubjectDummies);
  // }),

  // POST /api/subjects/upload
  http.post('/api/subjects/upload', () => {
    // Handle the file upload and return a response
    return new HttpResponse(null, { status: 204 });
  }),

  ...pinHandlers,
  ...sseHandlers,
  ...subjectHandlers,
  ...wishHandlers,
  ...departmentHandlers,
];
