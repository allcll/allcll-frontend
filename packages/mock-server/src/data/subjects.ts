import { mockCartData } from './wishes.ts';

export interface ISubject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  classCode: string;
  professorName: string | null;
}

export const subjects: ISubject[] = mockCartData.baskets.map(wishes => ({
  subjectId: wishes.subjectId,
  subjectName: wishes.subjectName,
  subjectCode: wishes.subjectCode.toString().padStart(6, '0'),
  classCode: wishes.classCode.toString().padStart(3, '0'),
  professorName: wishes.professorName ?? null,
}));

export function getRandomSubjects(count: number) {
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getSubjectById(subjectId: number) {
  return subjects.find(subject => subject.subjectId === subjectId);
}
