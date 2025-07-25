import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import CheckboxFilter from './CheckboxFilter';
import { Grade } from '@/utils/types';

const GRADE: Grade[] = [1, 2, 3, 4];

function GradeFilter() {
  const { selectedGrades, setFilterSchedule } = useFilterScheduleStore();

  const handleChangeCheckbox = (item: Grade) => {
    const isSelected = selectedGrades.includes(item);
    const updateGrades = isSelected ? selectedGrades.filter(grade => grade !== item) : [...selectedGrades, item];

    setFilterSchedule('selectedGrades', updateGrades);
  };

  return (
    <CheckboxFilter
      labelPrefix="학년"
      selectedItems={selectedGrades}
      handleChangeCheckbox={handleChangeCheckbox}
      options={GRADE}
      selected={selectedGrades.length !== 0}
    />
  );
}

export default GradeFilter;
