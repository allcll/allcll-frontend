import { http, HttpResponse } from 'msw';
import { getRandomSubjects, getSubjectById } from '../data/subjects.ts';
import { MaxPinedSubjectsError, NotPinedSubjectError, SubjectNotFoundError } from '../data/errorJson.ts';

const MaxPinedSubjects = 6;
export let pinedSubjects = getRandomSubjects(MaxPinedSubjects - 1);

export const handlers = [
  // POST /api/pin
  http.post('/api/pin', req => {
    const queryString = new URLSearchParams(req.request.url.split('?')[1]);
    const subjectId = Number(queryString.get('subjectId'));

    // Pin the subject and return a response
    if (pinedSubjects.length >= MaxPinedSubjects) return HttpResponse.json(MaxPinedSubjectsError, { status: 400 });

    const subject = getSubjectById(Number(subjectId));

    if (subject === undefined) {
      return HttpResponse.json(SubjectNotFoundError, { status: 400 });
    }

    pinedSubjects.push(subject);
    return new HttpResponse(null, { status: 204 });
  }),

  // DELETE /api/pin/{subjectId}
  http.delete('/api/pin/:subjectId', ({ params }) => {
    const { subjectId } = params;
    // Unpin the subject and return a response
    if (pinedSubjects.every(subject => subject.subjectId !== Number(subjectId))) {
      return HttpResponse.json(NotPinedSubjectError, { status: 400 });
    }

    pinedSubjects = pinedSubjects.filter(subject => subject.subjectId !== Number(subjectId));

    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/pins
  http.get('/api/pins', () => {
    // Return a list of pinned subjects
    return HttpResponse.json({
      subjects: pinedSubjects.map(({ subjectId }) => ({ subjectId })),
    });
  }),
];
