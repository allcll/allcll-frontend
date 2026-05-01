import { SEMESTERS } from '../api/semester';

// Todo: 다음 학기에 SPRING_26 주석 해제 할 것
const SEMESTER_RANGES = [
  { code: 'SPRING_25', startId: 1, endId: 2422 },
  { code: 'SUMMER_25', startId: 2562, endId: 2647 },
  { code: 'FALL_25', startId: 2648, endId: 5144 },
  { code: 'WINTER_25', startId: 5185, endId: 5253 },
  // { code: "SPRING_26", startId: 5254, endId: 7862 },
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
