import lecturesData from '@public/lectures.json';
import { SimulationSubject } from '@/utils/types';

type Department = {
  departmentCode: string;
  departmentName: string;
};

function getRandomItems(subject: SimulationSubject[], count: number) {
  return [...subject].sort(() => Math.random() - 0.5).slice(0, Math.min(count, subject.length));
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

  const departmentRandomSubjects = getRandomItems(departmentSubjects, 3);
  const humanityRandomSubjects = getRandomItems(humanitySubjects, 2);

  const allRandomSubjects = [...departmentRandomSubjects, ...humanityRandomSubjects];

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
