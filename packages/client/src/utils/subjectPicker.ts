import { SimulationSubject } from '@/utils/types';
import { Lecture } from '@/hooks/server/useLectures';

const TOTAL_SUBJECTS = 5;

function getRandomItems(lectures: Lecture[], count: number) {
  const uniqueSubjectCodes: Set<string> = new Set();
  const randomSubjects: SimulationSubject[] = [];

  for (const item of [...lectures].sort(() => Math.random() - 0.5)) {
    if (uniqueSubjectCodes.size >= count) break;
    if (!uniqueSubjectCodes.has(item.subjectCode)) {
      uniqueSubjectCodes.add(item.subjectCode);
      randomSubjects.push(item);
    }
  }

  return randomSubjects;
}

function pickCollege(department: string) {
  const splitDepartment = department.split(' ');
  const indexOfUniversity = splitDepartment.findIndex(part => part.includes('대학'));

  if (indexOfUniversity !== -1) {
    return splitDepartment.slice(1).join(' ').trim();
  }

  return department;
}

function checkSameDepartment(departmentName: string, collegeName: string) {
  const clean = (name: string) => name.replace(/(과|학부|전공)$/, '');

  return clean(departmentName) === clean(collegeName);
}

function checkMajorCount(count: number) {
  return TOTAL_SUBJECTS - count + 1;
}

export const pickRandomsubjects = (subjects: Lecture[], departmentName: string) => {
  if (departmentName === '') {
    return pickRandomSubjectsByAll(subjects);
  }

  const collegeName = pickCollege(departmentName);

  const departmentSubjects = subjects.filter(subject => checkSameDepartment(subject.departmentName, collegeName));
  const humanitySubjects = subjects.filter(subject => subject.departmentName === '대양휴머니티칼리지');
  const validDepartmentSubjects = departmentSubjects.filter(
    subject => subject.professorName !== null && subject.lesn_time !== null,
  );

  const departmentRandomSubjects = getRandomItems(validDepartmentSubjects, 3);

  const validHumanitySubjects = humanitySubjects.filter(
    subject => subject.professorName !== null && subject.lesn_time !== null,
  );

  const humanityRandomSubjects = getRandomItems(
    validHumanitySubjects,
    checkMajorCount(departmentRandomSubjects.length + 1),
  );

  const allRandomSubjects = [...departmentRandomSubjects, ...humanityRandomSubjects];

  for (let i = allRandomSubjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allRandomSubjects[i], allRandomSubjects[j]] = [allRandomSubjects[j], allRandomSubjects[i]];
  }

  return allRandomSubjects;
};

/**
 * 문제점 : subjectId만 판별할 경우, 분반은 001로 통일 된다.
 * @param subjectId
 */
export const findSubjectsById = (lectures: Lecture[], subjectId: number) => {
  return lectures.find(subject => subjectId === subject.subjectId);
};

export const pickRandomSubjectsByAll = (lectures: Lecture[]) => {
  return getRandomItems(lectures, 5);
};

export const pickNonRandomSubjects = (lectures: Lecture[], departmentName: string) => {
  const collegeName = pickCollege(departmentName);

  if (collegeName === '') {
    return pickRandomSubjectsByAll(lectures);
  }

  const departmentSubjects = lectures.filter(subject => checkSameDepartment(subject.departmentName, collegeName));

  const humanitySubjects = lectures.filter(subject => subject.departmentName === '대양휴머니티칼리지');

  const removeDuplicateSubjects = (subjects: typeof lectures) => {
    const seen = new Set();
    return subjects.filter(subject => {
      if (seen.has(subject.subjectCode)) return false;
      seen.add(subject.subjectCode);
      return true;
    });
  };

  const uniqueDepartmentSubjects = removeDuplicateSubjects(departmentSubjects).slice(0, 3);
  const needed = 5 - uniqueDepartmentSubjects.length;

  const uniqueHumanitySubjects = removeDuplicateSubjects(humanitySubjects).slice(0, needed);

  return [...uniqueDepartmentSubjects, ...uniqueHumanitySubjects];
};

export const applyCreditLimit = (subjects: Lecture[]) => {
  let totalCredit = 0;
  const limitedSubjects: Lecture[] = [];

  for (const subject of subjects) {
    const subjectCredit = Number(subject.tm_num.split('/')[0]) || 0;
    if (totalCredit + subjectCredit > 24) {
      break;
    }
    totalCredit += subjectCredit;
    limitedSubjects.push(subject);
  }

  return limitedSubjects;
};
