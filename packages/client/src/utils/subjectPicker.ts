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
