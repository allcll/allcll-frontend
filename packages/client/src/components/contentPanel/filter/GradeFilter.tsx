import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { Grade } from '@/utils/types';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import MultiCheckboxFilter from '@common/components/filtering/MultiCheckboxFilter';
import { OptionType } from '@common/components/filtering/MultiCheckboxFilter';

export const GRADE: OptionType<Grade>[] = [
  { value: 1, label: '1학년' },
  { value: 2, label: '2학년' },
  { value: 3, label: '3학년' },
  { value: 4, label: '4학년' },
];

function GradeFilter() {
  const { grades } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);

  const setFilterScheduleWrapper = (field: string, value: Grade[]) => {
    if (field === 'selectedGrades') {
      setFilter('grades', value);
    }
  };

  return (
    <MultiCheckboxFilter
      labelPrefix="학년"
      selectedValues={grades}
      field="selectedGrades"
      setFilterSchedule={setFilterScheduleWrapper}
      options={GRADE}
      selected={grades.length !== 0}
      ItemComponent={CheckboxAdapter}
    />
  );
}

export default GradeFilter;
