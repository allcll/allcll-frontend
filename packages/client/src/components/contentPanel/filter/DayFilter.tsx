import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import MultiSelectFilter from '@common/components/filtering/MultiSelectFilter';
import { OptionType } from '@common/components/filtering/MultiSelectFilter';
import { Day } from '@/utils/types';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';

export const DAYS: OptionType<Day>[] = [
  { value: '월', label: '월요일' },
  { value: '화', label: '화요일' },
  { value: '수', label: '수요일' },
  { value: '목', label: '목요일' },
  { value: '금', label: '금요일' },
];

function DayFilter() {
  const { time } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);

  const setFilterScheduleWrapper = (field: string, value: Day[]) => {
    if (field === 'selectedDays') {
      setFilter(
        'time',
        value.map(day => ({ day, type: 'all' })),
      );
    }
  };

  return (
    <MultiSelectFilter<Day>
      labelPrefix="요일"
      selectedValues={time.map(t => t.day).filter((day): day is Day => day !== '')}
      field="selectedDays"
      setFilterSchedule={setFilterScheduleWrapper}
      options={DAYS}
      selected={time.length !== 0}
      ItemComponent={CheckboxAdapter}
    />
  );
}

export default DayFilter;
