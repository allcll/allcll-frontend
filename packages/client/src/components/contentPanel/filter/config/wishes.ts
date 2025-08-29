import { FilterConfiguration } from '@/utils/types';
import { CREDITS, CURITYPE, GRADE, SEAT_RANGE, WISH_RANGE } from '../constants/Filters';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import { FilterDomains, FilterOptions } from '@/utils/filtering/filterDomains';

const ClassroomOptions = FilterOptions.classRoom.sort((a, b) => a.label.localeCompare(b.label));

const RemarkOptions = FilterDomains.remark.map(rm => ({ label: rm, value: rm }));

export const MultiWishFilterConfig: FilterConfiguration<string | number>[] = [
  {
    filterKey: 'credits',
    options: CREDITS,
    labelPrefix: '학점',
    label: '학점',
    default: true,
    ItemComponent: CheckboxAdapter,
  },
  {
    filterKey: 'grades',
    options: GRADE,
    labelPrefix: '학년',
    label: '학년',
    default: true,
    ItemComponent: CheckboxAdapter,
  },
  {
    filterKey: 'categories',
    options: CURITYPE,
    labelPrefix: '유형',
    default: false,
    ItemComponent: Chip,
  },
  {
    filterKey: 'classroom',
    options: ClassroomOptions,
    labelPrefix: '강의실',
    default: false,
    ItemComponent: CheckboxAdapter,
  },
  {
    filterKey: 'note',
    options: RemarkOptions,
    labelPrefix: '비고',
    default: false,
    ItemComponent: CheckboxAdapter,
  },
];

export const SingleWishConfig: FilterConfiguration<string | number>[] = [
  {
    filterKey: 'wishRange',
    options: WISH_RANGE,
    labelPrefix: '관심인원',
    default: true,
    ItemComponent: Chip,
  },
  {
    filterKey: 'seatRange',
    options: SEAT_RANGE,
    labelPrefix: '여석',
    default: true,
    ItemComponent: Chip,
  },
];
