import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import CheckboxFilter from './CheckboxFilter';
import { Grade } from '@/utils/types';

const GRADE: Grade[] = [1, 2, 3, 4];

function GradeFilter(props: { openFilter: '학과' | '학년' | '요일' | null; toggleFilter: () => void }) {
  const { openFilter, toggleFilter } = props;
  const { selectedGrades, setFilterSchedule } = useFilterScheduleStore();
  return (
    <CheckboxFilter
      labelPrefix="학년"
      openFilter={openFilter}
      toggleFilter={toggleFilter}
      selectedItems={selectedGrades}
      setSelectedItems={() => setFilterSchedule('selectedGrades', selectedGrades)}
      options={GRADE}
    />
  );
}

export default GradeFilter;
