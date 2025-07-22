import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import CheckboxFilter from './CheckboxFilter';
import { Day } from '@/utils/types';

const DAYS: Day[] = ['월', '화', '수', '목', '금'];

function DayFilter(props: { openFilter: '학과' | '학년' | '요일' | null; toggleFilter: () => void }) {
  const { openFilter, toggleFilter } = props;
  const { selectedDays, setFilterSchedule } = useFilterScheduleStore();

  return (
    <CheckboxFilter
      labelPrefix="요일"
      openFilter={openFilter}
      toggleFilter={toggleFilter}
      selectedItems={selectedDays}
      setSelectedItems={() => setFilterSchedule('selectedDays', selectedDays)}
      options={DAYS}
    />
  );
}

export default DayFilter;
