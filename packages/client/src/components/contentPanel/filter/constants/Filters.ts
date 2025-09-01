import { Credit, Curitype, Day, Grade, OptionType, RangeFilter, RemarkType } from '@/utils/types';

export const CREDITS: OptionType<Credit>[] = [
  { value: 1, label: '1학점' },
  { value: 2, label: '2학점' },
  { value: 3, label: '3학점' },
];

export const CURITYPE: OptionType<Curitype>[] = [
  { value: '교필', label: '교필' },
  { value: '교선', label: '교선' },
  { value: '전필', label: '전필' },
  { value: '전선', label: '전선' },
  { value: '전기', label: '전기' },
  { value: '공필', label: '공필' },
  { value: '균필', label: '균필' },
  { value: '기필', label: '기필' },
  { value: '교직', label: '교직' },
  { value: 'ROTC', label: 'ROTC' },
];

export const DAYS: OptionType<Day>[] = [
  { value: '월', label: '월요일' },
  { value: '화', label: '화요일' },
  { value: '수', label: '수요일' },
  { value: '목', label: '목요일' },
  { value: '금', label: '금요일' },
];

export const GRADE: OptionType<Grade>[] = [
  { value: 1, label: '1학년' },
  { value: 2, label: '2학년' },
  { value: 3, label: '3학년' },
  { value: 4, label: '4학년' },
];

export const SEAT_RANGE: OptionType<number>[] = [
  { value: 1, label: '여석 1개 이하' },
  { value: 2, label: '여석 2개 이상' },
  { value: 5, label: '여석 5개 이상' },
  { value: 10, label: '여석 10개 이상' },
];

export const SEAT_RANGE_VALUES: Array<RangeFilter | null> = [
  null,
  { operator: 'under-equal', value: 1 },
  { operator: 'over-equal', value: 2 },
  { operator: 'over-equal', value: 5 },
  { operator: 'over-equal', value: 10 },
];

export const WISH_RANGE: OptionType<number>[] = [
  { value: 30, label: '관심인원 30명 이상' },
  { value: 50, label: '관심인원 50명 이상' },
  { value: 100, label: '관심인원 100명 이상' },
  { value: 200, label: '관심인원 200명 이상' },
];

export const WISH_RANGE_VALUES: Array<RangeFilter | null> = [
  { operator: 'over-equal', value: 30 },
  { operator: 'over-equal', value: 50 },
  { operator: 'over-equal', value: 100 },
  { operator: 'over-equal', value: 200 },
];

export const REMARK: OptionType<RemarkType>[] = [
  { value: '외국인대상', label: '외국인대상' },
  { value: 'SHP대상', label: 'SHP대상' },
  { value: '기타', label: '기타' },
];
