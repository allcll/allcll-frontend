import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { Curitype } from '@/utils/types';
import MultiSelectFilter, { OptionType } from '@common/components/filtering/MultiSelectFilter';
import useSubject from '@/hooks/server/useSubject.ts';
import { getCategories } from '@/utils/filtering/filterDomains.ts';
import Chip from '@common/components/chip/Chip';

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

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => ({ label: cat, value: cat }));

  const setFilterScheduleWrapper = (field: string, value: string[]) => {
    if (field === 'selectedCuriTypes') {
      setFilter('categories', value as Curitype[]);
    }
  };

  return (
    <MultiSelectFilter
      labelPrefix="유형"
      selectedValues={categories}
      field="selectedCuriTypes"
      setFilterSchedule={setFilterScheduleWrapper}
      options={categoryOptions}
      selected={categories.length !== 0}
      className="min-w-max"
      ItemComponent={Chip}
    />
  );
}

export default CuriTypeFilter;
