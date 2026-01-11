import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { FilterDomainsType } from '@/features/filtering/lib/filterDomains.ts';

export interface DepartmentType {
  departmentCode: string;
  departmentName: string;
}

export interface RangeFilter {
  operator: 'over-equal' | 'under-equal';
  value: number;
}

export interface RangeMinMaxFilter {
  min?: number;
  max?: number;
}

export type RemarkType = '외국인대상' | 'SHP대상' | '기타';
export type Grade = 1 | 2 | 3 | 4;
export type Curitype = '교필' | '교선' | '전필' | '전선' | '전기' | '공필' | '균필' | '기필' | '교직' | 'ROTC';
export type Credit = 1 | 2 | 3;

export interface FilterItemProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export interface OptionType<VALUE> {
  value: VALUE;
}

export interface FilterConfiguration {
  filterKey: keyof Filters;
  options: FilterDomainsType[keyof FilterDomainsType][];
  default: boolean;
  ItemComponent: React.ComponentType<FilterItemProps>;
}

export type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];
