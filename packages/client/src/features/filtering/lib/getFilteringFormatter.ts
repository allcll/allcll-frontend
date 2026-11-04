import { formatMultiSelectedLabel } from '@allcll/common';
import { Time } from '@/shared/lib/time.ts';
import { FilterOptions, MIN_HIGH_CREDIT } from './filterDomains.ts';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { Credit, DepartmentType, Grade, RangeMinMaxFilter, RemarkType } from '@/features/filtering/model/types.ts';
import { Day } from '@/entities/timetable/model/types.ts';

export const labelPrefix: Record<keyof Filters, string> = {
  keywords: '키워드',
  department: '학과',
  grades: '학년',
  credits: '학점',
  classroom: '강의실',
  seatRange: '여석',
  wishRange: '관심 인원',
  time: '시간',
  days: '요일',
  categories: '수업 유형',
  note: '비고',
  language: '언어',
  alarmOnly: '알림',
  favoriteOnly: '즐겨찾기',
};

export type FiltersValueMap = {
  keywords: string;
  department: string;
  grades: Grade;
  credits: Credit;
  categories: string;
  seatRange: RangeMinMaxFilter | null;
  wishRange: RangeMinMaxFilter | null;
  time: RangeMinMaxFilter | null;
  days: Day;
  classroom: string;
  note: RemarkType;
  language: string;
  alarmOnly: boolean;
  favoriteOnly: boolean;
};

// Filters의 배열/단일 값 타입을 추출하는 유틸리티 타입
export type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer T)[] ? T : Filters[K];

// 선택된 여러 필터의 라벨을 가져오는 함수
export function getMultiSelectedLabel<K extends keyof Filters>(
  filterKey: K,
  selectedValues: FilterValueType<K>[],
): string {
  return formatMultiSelectedLabel(labelPrefix[filterKey], selectedValues, getLabelFormatter()[filterKey]);
}

export function getSingleSelectedLabel<K extends keyof Filters>(
  filterKey: K,
  selectedValue: FilterValueType<K> | null,
): string {
  if (selectedValue === null || selectedValue === undefined) {
    return labelPrefix[filterKey];
  }

  const castedValue = selectedValue;
  if (filterKey === 'seatRange') {
    const label = getLabelFormatter()[filterKey]?.(castedValue) ?? labelPrefix[filterKey];
    return `여석 ${label}`;
  }

  if (filterKey === 'wishRange') {
    const label = getLabelFormatter()[filterKey]?.(castedValue) ?? labelPrefix[filterKey];
    return `관심 인원 ${label}`;
  }

  return getLabelFormatter()[filterKey]?.(castedValue) ?? labelPrefix[filterKey];
}

// 칩에 표시될 라벨을 가져오는 함수
export function getLabelByFilters<K extends keyof Filters>(
  filterKey: K,
  selectedValue: FilterValueType<K> | null,
  departments?: DepartmentType[],
): string {
  if (selectedValue === null || selectedValue === undefined) {
    return '';
  }

  const castedValue = selectedValue;
  const formattedLabel = getLabelFormatter(departments)[filterKey]?.(castedValue);
  if (!formattedLabel) {
    return '';
  }

  if (filterKey === 'seatRange') {
    return `여석 ${formattedLabel}`;
  }

  if (filterKey === 'wishRange') {
    return `관심 ${formattedLabel}`;
  }

  return formattedLabel;
}

export function getLabelFormatter(departments?: DepartmentType[]): Partial<{
  [K in keyof Filters]: (value: FilterValueType<K>) => string;
}> {
  const getDepartmentLabel = (value: string) => {
    if (!departments) return '';
    const department = departments.find(d => d.departmentCode === value);
    return department?.departmentName || value;
  };

  return {
    keywords: value => (typeof value === 'string' ? value : ''),
    department: value => getDepartmentLabel(value),
    grades: value => getLabelWithSuffix(value, labelPrefix.grades),
    credits: value =>
      value === MIN_HIGH_CREDIT
        ? `${value}${labelPrefix.credits} 이상`
        : getLabelWithSuffix(value, labelPrefix.credits),
    classroom: getClassRoomLabel,
    seatRange: value => getRangeLabel(value, '개'),
    wishRange: value => getRangeLabel(value, '명'),
    time: getTimeRangeLabel,
    days: getDaysLabel,
    categories: value => value,
    note: value => value,
    language: value => value,
    alarmOnly: () => labelPrefix.alarmOnly,
    favoriteOnly: () => labelPrefix.favoriteOnly,
  };
}

const getClassRoomLabel = (value: string) => {
  if (!value || typeof value !== 'string') return '';
  return FilterOptions.classRoom.find(room => room.value === value)?.label || value;
};

/**
 * Range을 보여주는 라벨입니다.
 * @param value
 * @returns
 */
export function getTimeRangeLabel(range: RangeMinMaxFilter | null) {
  if (!range) return '';

  const { min, max } = range;
  const format = (minutes: number) => new Time(minutes).toString();

  if (min !== undefined && max !== undefined) return `${format(min)}~${format(max)}`;
  if (min !== undefined) return `${format(min)} 이후`;
  if (max !== undefined) return `${format(max)} 이전`;
  return '';
}

const getRangeLabel = (value: RangeMinMaxFilter | null, unit: string) => {
  if (!value) {
    return '';
  }

  const { min, max } = value;

  if (min !== undefined && max !== undefined) {
    return min === max ? `${min}${unit}` : `${min}~${max}${unit}`;
  }

  if (min !== undefined) {
    return `${min}${unit} 이상`;
  }
  if (max !== undefined) {
    return `${max}${unit} 이하`;
  }

  return '';
};

const getDaysLabel = (value: Day) => {
  return value + '요일';
};

const getLabelWithSuffix = (value: string | number, labelSuffix: string) => {
  return value + labelSuffix;
};
