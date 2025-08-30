import { FilterConfiguration } from '@/utils/types';
import { CREDITS, CURITYPE, GRADE } from '../constants/Filters';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import { FilterDomains, FilterOptions } from '@/utils/filtering/filterDomains';

const ClassroomOptions = FilterOptions.classRoom.sort((a, b) => a.label.localeCompare(b.label));

const RemarkOptions = FilterDomains.remark.map(rm => ({ label: rm, value: rm }));

const ScheduleFilterConfig: FilterConfiguration<string | number>[] = [
  {
    filterKey: 'credits',
    options: CREDITS,
    labelPrefix: '학점',
    default: true,
    ItemComponent: CheckboxAdapter,
  },
  {
    filterKey: 'grades',
    options: GRADE,
    labelPrefix: '학년',
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

export default ScheduleFilterConfig;
