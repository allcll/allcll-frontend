import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { Curitype } from '@/utils/types';
import MultiCheckboxFilter from '@common/components/filtering/MultiCheckboxFilter';
import { OptionType } from '@common/components/filtering/MultiCheckboxFilter';

export const CURITYPE: OptionType<Curitype>[] = [
  { value: '교필', label: '교필' },
  { value: '교선', label: '교선' },
  { value: '전필', label: '전필' },
  { value: '전선', label: '전선' },
  { value: '전기', label: '전기' },
  { value: '공필', label: '공필' },
  { value: '균필', label: '균필' },
  { value: '기필', label: '기필' },
];

function CuriTypeFilter() {
  const { categories } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);

  const setFilterScheduleWrapper = (field: string, value: Curitype[]) => {
    if (field === 'selectedCuriTypes') {
      setFilter('categories', value);
    }
  };

  return (
    <MultiCheckboxFilter
      labelPrefix="유형"
      variant="chip"
      selectedValues={categories}
      field="selectedCuriTypes"
      setFilterSchedule={setFilterScheduleWrapper}
      options={CURITYPE}
      selected={categories.length !== 0}
      className="min-w-max"
    />
  );
}

export default CuriTypeFilter;
