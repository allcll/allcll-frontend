import lecturesData from '@public/lectures.json';

const POPULAR_SUBJECTS = [
  '현대인의정신건강과자기발견',
  '행복한가정만들기',
  '창업과기업가정신1',
  '취창업과진로설계',
  '동서양의사상과윤리',
  '세계사',
  '생명과학의이해',
  '현대과학으로의초대',
  '우리차문화의이해',
  '중급미술심리치료',
  '과학사',
  '성과문화',
  '교양스키',
  '교양배드민턴',
  '생활일본어',
  '영어듣기연습',
  '영어읽기연습',
  'English Listening',
  'English Reading',
];

export const checkSubjectResult = (currentSubjectId: number, elaspedTime: number) => {
  const findSubject = lecturesData.subjects.find(subject => subject.subjectId === currentSubjectId);

  let limitTime = 40;

  if (findSubject?.departmentName === '대양휴머니티칼리지') {
    const isPopular = POPULAR_SUBJECTS.find(subject => {
      subject === findSubject.subjectName;
    });

    if (isPopular) {
      limitTime = 4.6 * 2;
    } else {
      limitTime = 4.6 * 3;
    }
  }

  if (elaspedTime < limitTime) return true;

  return false;
};
