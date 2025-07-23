import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import CheckboxFilter from './CheckboxFilter';
import { Grade } from '@/utils/types';

const GRADE: Grade[] = [1, 2, 3, 4];

interface IGradeFilter {
  openFilter: boolean;
  onToggle: () => void;
}

function GradeFilter(props: IGradeFilter) {
  const { openFilter, onToggle } = props;
  const { selectedGrades, setFilterSchedule } = useFilterScheduleStore();

  const handleChangeCheckbox = (item: Grade) => {
    const isSelected = selectedGrades.includes(item);
    const updateGrades = isSelected ? selectedGrades.filter(grade => grade !== item) : [...selectedGrades, item];

    setFilterSchedule('selectedGrades', updateGrades);
  };

  return (
    <CheckboxFilter
      labelPrefix="학년"
      openFilter={openFilter}
      toggleFilter={onToggle}
      selectedItems={selectedGrades}
      handleChangeCheckbox={handleChangeCheckbox}
      options={GRADE}
    />
  );
}

export default GradeFilter;
