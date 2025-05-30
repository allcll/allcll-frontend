export interface ISubject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  classCode: string;
  professorName: string | null;
}

// Fixme: baskets json 파일을 나중에 로드하도록 변경
const { baskets: mockCartData } = await import('@public-client/baskets.json');
export const subjects: ISubject[] = mockCartData.map(wishes => ({
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
