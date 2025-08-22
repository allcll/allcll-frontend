import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
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
  const { selectedCuriTypes, setFilterSchedule } = useFilterScheduleStore();

  const setFilterScheduleWrapper = (field: string, value: Curitype[]) => {
    if (field === 'selectedCuriTypes') {
      setFilterSchedule('selectedCuriTypes', value);
    }
  };

  return (
    <MultiCheckboxFilter
      labelPrefix="유형"
      variant="chip"
      selectedValues={selectedCuriTypes}
      field="selectedCuriTypes"
      setFilterSchedule={setFilterScheduleWrapper}
      options={CURITYPE}
      selected={selectedCuriTypes.length !== 0}
      className="min-w-max"
    />
  );
}

export default CuriTypeFilter;
