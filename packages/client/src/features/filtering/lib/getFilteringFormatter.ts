import { IDayTimeItem } from '@/features/filtering/ui/DayTimeFilter.tsx';
import { FilterOptions } from './filterDomains.ts';
import { Filters } from '@/shared/model/useFilterStore.ts';
import { Credit, Day, DepartmentType, Grade, RangeMinMaxFilter, RemarkType } from '../../../shared/model/types.ts';

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
  time: IDayTimeItem;
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
export function getMultiSelectedLabel<K extends keyof Filters>(filterKey: K, selectedValues: Filters[K]): string {
  if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
    return labelPrefix[filterKey];
  }

  const firstValue = selectedValues[0] as FilterValueType<K>;
  if (selectedValues.length === 1) {
    return getLabelFormatter()[filterKey]?.(firstValue) ?? labelPrefix[filterKey];
  }

  return `${getLabelFormatter()[filterKey]?.(firstValue) ?? labelPrefix[filterKey]} 외 ${selectedValues.length - 1}개`;
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
    department: value => getDepartmentLabel(value as string),
    grades: value => getLabelWithSuffix(value, labelPrefix.grades),
    credits: value => getLabelWithSuffix(value, labelPrefix.credits),
    classroom: getClassRoomLabel,
    seatRange: getRangeLabel,
    wishRange: getRangeLabel,
    time: getTimesLabel,
    days: getDaysLabel,
    categories: value => value as string,
    note: value => value as string,
    language: value => value as string,
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
const getRangeLabel = (value: RangeMinMaxFilter | null) => {
  if (!value) {
    return '';
  }

  const { min, max } = value;

  if (min !== undefined && max !== undefined) {
    return `${min}개 이상 ~ ${max}개 이하`;
  }

  if (min !== undefined) {
    return `${min}개 이상`;
  }
  if (max !== undefined) {
    return `${max}개 이하`;
  }

  return '';
};

const getTimesLabel = (value: IDayTimeItem) => {
  return `${value.day}${labelPrefix.time} ${value.start}~${value.end}`;
};

const getDaysLabel = (value: Day) => {
  return value + '요일';
};

const getLabelWithSuffix = (value: string | number, labelSuffix: string) => {
  return value + labelSuffix;
};
