import CheckboxFilter from './CheckboxFilter';
import { Day } from '@/utils/types';

const DAYS: Day[] = ['월', '화', '수', '목', '금'];

function DayFilter(props: {
  openFilter: '학과' | '학년' | '요일' | null;
  toggleFilter: () => void;
  selectedDays: Day[];
  setSelectedDays: React.Dispatch<React.SetStateAction<Day[]>>;
}) {
  const { openFilter, toggleFilter, selectedDays, setSelectedDays } = props;

  return (
    <CheckboxFilter
      labelPrefix="요일"
      openFilter={openFilter}
      toggleFilter={toggleFilter}
      selectedItems={selectedDays}
      setSelectedItems={setSelectedDays}
      options={DAYS}
    />
  );
}

export default DayFilter;
