import baskets from '../../../client/public/SPRING_26/baskets.json';

export interface ISubjects {
  baskets: basket[];
}

interface basket {
  subjectId: number;
  subjectName: string;
  departmentName: string;
  departmentCode: string;
  subjectCode: string;
  classCode: string;
  professorName: string;
  totalCount: number;
}

export const subjects = (baskets?.baskets ?? []) as basket[];

export function getRandomSubjects(count: number) {
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getSubjectById(subjectId: number) {
  return subjects.find(subject => subject.subjectId === subjectId);
}
