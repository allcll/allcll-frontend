/** Filter Domain 은 2가지로 구분 가능
 * 1. 미리 정의 (하드 코딩)
 * 2. 동적 정의 (Data 기반 ex..unique) */

import { Subject } from '@/utils/types.ts';

/** Filtering 기능도 2가지로 정의 가능
 * 1. 키워드 Search: string[] 에 속해있는 string 과 비교
 * 2. matching Search: string 과 정확히 일치하는 속성
 * 3. key, value 에 대한 판단?? */

export const FilterDomains = {
  grades: ['전체', '1학년', '2학년', '3학년', '4학년'],
  days: ['전체', '월', '화', '수', '목', '금', '토'],
  remark: ['외국인대상', 'SHP대상', '기타'], // 외국인 들어가는 , SHP 또는 Honor 들어가는
  classRoom: [
    '광개토관',
    '집현관',
    '용덕관',
    '군자관',
    '대양AI센터',
    '동천관(학술정보원)',
    '호텔스쿨',
    '영실관',
    '이당관',
    '충무관',
    '세종관',
    '애지헌',
    '진관홀',
    '율곡관',
    '김원관',
    '다산관',
    '새날관',
    '대양홀',
    '우정당',
    '무방관',
    '모짜르트홀',
    '학생회관',
  ],
};
// 집: '집현관';
// 군: '군자관'; Lab: '군자관 5층';
// 광: '광개토관';
// 충: '충무관';
// 영: '영실관';
// 율: '율곡관';
// 애: '애지헌';
// 새: '새날관';
// 대: '대양홀';
// 용: '용덕관';
// 무: '무방관';
// 진: '진관홀';
// 모: '모짜르트홀';
// 세: '세종관';
// 다: '다산관';
// 학: '학생회관';
// 동: '동천관(학술정보원)';
// 센: '대양AI센터';
// 김: '김원관';
// 호: '호텔스쿨';

export function getCategories(subjects: Subject[]) {
  const categories = unique(subjects.map(s => s.curiTypeCdNm));
  return categories.filter(category => !!category);
}

function unique<T>(array: T[]) {
  return Array.from(new Set(array));
}
