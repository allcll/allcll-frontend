import lecturesData from '@public/lectures.json';
import { SimulationSubject } from '@/utils/types';

type Department = {
  departmentCode: string;
  departmentName: string;
};

function getRandomItems(subject: SimulationSubject[], count: number) {
  const uniqueSubjectCodes: Set<string> = new Set();
  const randomSubjects: SimulationSubject[] = [];

  for (const item of [...subject].sort(() => Math.random() - 0.5)) {
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

export const pickRandomsubjects = (department: Department) => {
  const collegeName = pickCollege(department.departmentName);

  const departmentSubjects = lecturesData.subjects.filter(subject =>
    checkSameDepartment(subject.departmentName, collegeName),
  );

  const humanitySubjects = lecturesData.subjects.filter(subject => subject.departmentName === '대양휴머니티칼리지');

  const validDepartmentSubjects = departmentSubjects.filter(
    subject => subject.professorName !== null && subject.lesn_time !== null,
  );
  const departmentRandomSubjects = getRandomItems(validDepartmentSubjects, 3);

  const validHumanitySubjects = humanitySubjects.filter(
    subject => subject.professorName !== null && subject.lesn_time !== null,
  );
  const humanityRandomSubjects = getRandomItems(validHumanitySubjects, 2);

  const allRandomSubjects = [...departmentRandomSubjects, ...humanityRandomSubjects];

  for (let i = allRandomSubjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allRandomSubjects[i], allRandomSubjects[j]] = [allRandomSubjects[j], allRandomSubjects[i]];
  }

  return allRandomSubjects;
};

export const checkExistDepartment = (departments: Department[] | undefined) => {
  const arr: Department[] = [];
  departments?.forEach(department => {
    const randomSubject = pickRandomsubjects(department);

    if (randomSubject.length === 2) {
      arr.push(department);
    }
  });

  return arr;
};

export const makeValidateDepartment = (
  departments: Department[] | undefined,
  notExistDepartment: Department[] | undefined,
) => {
  if (!departments) return [];
  if (!notExistDepartment || notExistDepartment.length === 0) return departments;

  const notExistIds = new Set(notExistDepartment.map(dep => dep.departmentCode));
  return departments.filter(dep => !notExistIds.has(dep.departmentCode));
};

/**
 * 문제점 : subjectId만 판별할 경우, 분반은 001로 통일 된다.
 * @param subjectId
 */
export const findSubjectsById = (subjectId: number) => {
  return lecturesData.subjects.find(subject => subjectId === subject.subjectId);
};
