import { Lecture } from '@/hooks/server/useLectures';

const TOTAL_SUBJECTS = 5;
const DEFAULT_MAX_CREDITS = 24;

/**
 * Knuth Shuffle (Fisher-Yates Shuffle) 알고리즘을 사용하여 배열을 무작위로 섞습니다.
 * @param array 섞을 배열
 * @returns 새로운 섞인 배열
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/** subjectCode 가 중복되지 않도록 랜덤으로 과목을 선택합니다. */
function getRandomItems(lectures: Lecture[], count: number) {
  const shuffled = shuffleArray(lectures);
  const uniqueSubjectCodes: Set<string> = new Set();
  const randomSubjects: Lecture[] = [];

  for (const item of shuffled) {
    if (uniqueSubjectCodes.size >= count) break;
    if (uniqueSubjectCodes.has(item.subjectCode)) continue;

    uniqueSubjectCodes.add(item.subjectCode);
    randomSubjects.push(item);
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

// Todo: 예상 입력 값이 -> departmentName : 컴퓨터공학과 - 이것만 들어오는 건지 확인 필요
function checkSameDepartment(departmentName: string, collegeName: string) {
  const clean = (name: string) => name.replace(/(과|학부|전공)$/, '');

  return clean(departmentName) === clean(collegeName);
}

// Fixme: 남은 학과 과목 개수 인가요?
function checkMajorCount(count: number) {
  return TOTAL_SUBJECTS - count + 1;
}

/** valid 한 과목 중에서, 학과 + 휴머니티칼리지 과목을 랜덤으로 선택합니다. */
export const pickRandomSubjects = (subjects: Lecture[], departmentName: string) => {
  if (departmentName === '') {
    return pickRandomSubjectsByAll(subjects);
  }

  const collegeName = pickCollege(departmentName);

  // Todo: 왜 nullish 만 빼는건지, falsy 값을 빼도 되는건지 확인 필요
  // Todo: 랜덤에서 subjectCode 중복 제거 안하는 이유 확인 필요
  const validSubjects = subjects.filter(subject => subject.professorName !== null && subject.lesn_time !== null);
  const departmentSubjects = validSubjects.filter(subject => checkSameDepartment(subject.departmentName, collegeName));
  const humanitySubjects = validSubjects.filter(subject => subject.departmentName === '대양휴머니티칼리지');

  const departmentRandomSubjects = getRandomItems(departmentSubjects, 3);
  const humanityRandomSubjects = getRandomItems(humanitySubjects, checkMajorCount(departmentRandomSubjects.length + 1));

  return shuffleArray([...departmentRandomSubjects, ...humanityRandomSubjects]);
};

/**
 * 문제점 : subjectId만 판별할 경우, 분반은 001로 통일 된다.
 * @param lectures
 * @param subjectId
 */
export const findLecturesById = (lectures: Lecture[], subjectId: number) => {
  return lectures.find(subject => subjectId === subject.subjectId);
};

/** 조건 없이 Random 하게 뽑은 과목들 반환 (valid, subjectCode 중복 제거 안함)*/
const pickRandomSubjectsByAll = (lectures: Lecture[]) => {
  return getRandomItems(lectures, 5);
};

/** 앞에서 부터 학수번호 겹치지 않는 것 선택 */
export const pickNonRandomSubjects = (lectures: Lecture[], departmentName: string) => {
  const collegeName = pickCollege(departmentName);

  if (collegeName === '') {
    return pickRandomSubjectsByAll(lectures);
  }

  const departmentSubjects = lectures.filter(subject => checkSameDepartment(subject.departmentName, collegeName));

  const humanitySubjects = lectures.filter(subject => subject.departmentName === '대양휴머니티칼리지');

  // subjectCode 가 중복되지 않도록 필터링
  const removeDuplicateSubjects = (subjects: Lecture[]) => {
    const seen = new Set();
    return subjects.filter(subject => {
      if (seen.has(subject.subjectCode)) return false;
      seen.add(subject.subjectCode);
      return true;
    });
  };

  const uniqueDepartmentSubjects = removeDuplicateSubjects(departmentSubjects).slice(0, 3);
  const needed = 5 - uniqueDepartmentSubjects.length;

  // Todo: collegeName 이 '대양휴머니티칼리지' 일 때 작동 확인 필요
  const uniqueHumanitySubjects = removeDuplicateSubjects(humanitySubjects).slice(0, needed);

  return [...uniqueDepartmentSubjects, ...uniqueHumanitySubjects];
};

/** 총 학점 제한을 적용합니다. */
export const applyCreditLimit = (subjects: Lecture[], maxCredit = DEFAULT_MAX_CREDITS) => {
  let totalCredit = 0;
  const limitedSubjects: Lecture[] = [];

  for (const subject of subjects) {
    const credit = getCredit(subject.tm_num);
    if (totalCredit + credit > maxCredit) break;

    totalCredit += credit;
    limitedSubjects.push(subject);
  }

  return limitedSubjects;
};

export const getCredit = (tmNum: string) => {
  if (!tmNum) return 0;

  const firstNumber = parseInt(tmNum.split('/')[0], 10);
  return isNaN(firstNumber) ? 0 : firstNumber;
};
