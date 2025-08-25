import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import MultiCheckboxFilter from '@common/components/filtering/MultiCheckboxFilter';
import { OptionType } from '@common/components/filtering/MultiCheckboxFilter';

export const CREDITS: OptionType<number>[] = [
  { value: 1, label: '1학점' },
  { value: 2, label: '2학점' },
  { value: 3, label: '3학점' },
];

function CreditFilter() {
  const { credits } = useScheduleSearchStore(state => state.filters);
  const setFilters = useScheduleSearchStore(state => state.setFilter);

  const setFilterScheduleWrapper = (field: string, value: number[]) => {
    if (field === 'selectedCredits') {
      setFilters('credits', value);
    }
  };

  return (
    <MultiCheckboxFilter
      labelPrefix="학점"
      selectedValues={credits}
      field="selectedCredits"
      setFilterSchedule={setFilterScheduleWrapper}
      options={CREDITS}
      selected={credits.length !== 0}
    />
  );
}

export default CreditFilter;
