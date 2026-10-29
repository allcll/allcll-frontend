import { SEMESTERS } from '../api/semester';

// Fixme: 매 학기마다 설정하는 항목이므로 따로 분리하여 관리할 것
const SEMESTER_RANGES = [
  { code: 'SPRING_25', startId: 1, endId: 2422 },
  { code: 'SUMMER_25', startId: 2562, endId: 2647 },
  { code: 'FALL_25', startId: 2648, endId: 5144 },
  { code: 'WINTER_25', startId: 5185, endId: 5253 },
  { code: 'SPRING_26', startId: 5254, endId: 8222 },
  { code: 'SUMMER_26', startId: 8223, endId: 8310 },
];

export function useSemesterNameBySubjectId(subjectId: number) {
  const semester = SEMESTER_RANGES.find(sem => subjectId >= sem.startId && subjectId <= sem.endId);

  const semesterData = SEMESTERS.find(s => s.semesterCode === semester?.code);

  if (!semesterData) {
    return {
      semesterCode: undefined,
      semesterValue: undefined,
    };
  }

  return semesterData;
}
