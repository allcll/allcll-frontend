import {http, HttpResponse} from "msw";
import {getRandomSubjects, getSubjectById} from "../data/subjects.ts";
import {MaxPinedSubjectsError, NotPinedSubjectError, SubjectNotFoundError} from "../data/errorJson.ts";

const MaxPinedSubjects = 6;
let pinedSubjects = getRandomSubjects(MaxPinedSubjects-1);


export const handlers = [
  // POST /api/pin
  http.post('/api/pin', (req) => {
    const json = req.request.json();
    const {subjectId} = json as unknown as {subjectId: number};

    // Pin the subject and return a response
    if (pinedSubjects.length >= MaxPinedSubjects)
      return HttpResponse.json(MaxPinedSubjectsError, {status: 400});

    const subject = getSubjectById(Number(subjectId));

    if (subject === undefined) {
      return HttpResponse.json(SubjectNotFoundError, {status: 400});
    }

    pinedSubjects.push(subject);
    return HttpResponse.json(null, {status: 204});
  }),

  // DELETE /api/pin/{subjectId}
  http.delete('/api/pin/:subjectId', ({ params }) => {
    const { subjectId } = params
    // Unpin the subject and return a response
    if (pinedSubjects.every((subject) => subject.subjectId !== Number(subjectId))) {
      return HttpResponse.json(NotPinedSubjectError, {status: 400});
    }

    pinedSubjects = pinedSubjects.filter((subject) => subject.subjectId !== Number(subjectId));

    return new HttpResponse(null, {status: 204});
  }),

  // GET /api/pins
  http.get('/api/pins', () => {
    // Return a list of pinned subjects
    return HttpResponse.json(pinedSubjects)
  })
];