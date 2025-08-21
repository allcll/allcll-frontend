import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import { Grade } from '@/utils/types';
import CheckboxFilter, { OptionType } from '@common/components/filtering/CheckboxFilter';

const GRADE: OptionType<Grade>[] = [
  { value: 1, label: '1학년' },
  { value: 2, label: '2학년' },
  { value: 3, label: '3학년' },
  { value: 4, label: '4학년' },
];

function GradeFilter() {
  const { selectedGrades, setFilterSchedule } = useFilterScheduleStore();

  const setFilterScheduleWrapper = (field: string, value: Grade[]) => {
    if (field === 'selectedGrades') {
      setFilterSchedule('selectedGrades', value);
    }
  };

  return (
    <CheckboxFilter
      labelPrefix="학년"
      selectedValues={selectedGrades}
      field="selectedGrades"
      setFilterSchedule={setFilterScheduleWrapper}
      options={GRADE}
      selected={selectedGrades.length !== 0}
    />
  );
}

export default GradeFilter;
