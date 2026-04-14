const semesters = [
  { code: 'SPRING_25', startId: 1, endId: 2422 },
  { code: 'SUMMER_25', startId: 2562, endId: 2647 },
  { code: 'FALL_25', startId: 2648, endId: 5144 },
  { code: 'WINTER_25', startId: 5185, endId: 5253 },
  // { code: "SPRING_26", startId: 5254, endId: 7862 },
];

export function useSemesterNameBySubjectId(subjectId: number) {
  const semester = semesters.find(sem => subjectId >= sem.startId && subjectId <= sem.endId);

  return { semesterCode: semester ? semester.code : undefined };
}
