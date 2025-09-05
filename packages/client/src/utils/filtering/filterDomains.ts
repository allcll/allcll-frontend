/** Filter Domain 은 2가지로 구분 가능
 * 1. 미리 정의 (하드 코딩)
 * 2. 동적 정의 (Data 기반 ex..unique) */
import { Credit, Day, Grade, RangeMinMaxFilter, RemarkType, Subject } from '@/utils/types.ts';

/** Filtering 기능도 2가지로 정의 가능
 * 1. 키워드 Search: string[] 에 속해있는 string 과 비교
 * 2. matching Search: string 과 정확히 일치하는 속성
 * 3. key, value 에 대한 판단?? */

export interface FilterDomainsType {
  grades: Grade[];
  credits: Credit[];
  days: Day[];
  remark: RemarkType[];
  classRoom: string[];
  wishRange: RangeMinMaxFilter[];
  seatRange: RangeMinMaxFilter[];
}

export const FilterDomains: FilterDomainsType = {
  grades: [1, 2, 3, 4],
  credits: [1, 2, 3],
  days: ['월', '화', '수', '목', '금'],
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
  wishRange: [{ min: 10 }, { min: 50 }, { min: 100 }, { min: 200 }],
  seatRange: [{ min: 1 }, { max: 2 }, { max: 5 }, { max: 10 }],
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

export const FilterOptions = {
  classRoom: [
    { label: '광개토관', value: '광' },
    { label: '집현관', value: '집' },
    { label: '용덕관', value: '용' },
    { label: '군자관', value: '군' },
    { label: '대양AI센터', value: '센' },
    { label: '동천관(학술정보원)', value: '동' },
    { label: '호텔스쿨', value: '호' },
    { label: '영실관', value: '영' },
    { label: '이당관', value: '이' },
    { label: '충무관', value: '충' },
    { label: '세종관', value: '세' },
    { label: '애지헌', value: '애' },
    { label: '진관홀', value: '진' },
    { label: '율곡관', value: '율' },
    { label: '김원관', value: '김' },
    { label: '다산관', value: '다' },
    { label: '새날관', value: '새' },
    { label: '대양홀', value: '대' },
    { label: '우정당', value: '우' },
    { label: '무방관', value: '무' },
    { label: '모짜르트홀', value: '모' },
    { label: '학생회관', value: '학' },
  ],
};

export function getCategories(subjects: Subject[]) {
  const categories = unique(subjects.map(s => s.curiTypeCdNm));
  return categories.filter(category => !!category);
}

function unique<T>(array: T[]) {
  return Array.from(new Set(array));
}
