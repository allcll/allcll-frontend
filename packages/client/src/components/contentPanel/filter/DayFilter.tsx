import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import CheckboxFilter from './CheckboxFilter';
import { Day } from '@/utils/types';

const DAYS: Day[] = ['월', '화', '수', '목', '금'];

function DayFilter() {
  const { selectedDays, setFilterSchedule } = useFilterScheduleStore();

  const handleChangeCheckbox = (item: Day) => {
    const isSelected = selectedDays.includes(item);
    const updatedDays = isSelected ? selectedDays.filter(day => day !== item) : [...selectedDays, item];

    setFilterSchedule('selectedDays', updatedDays);
  };

  return (
    <CheckboxFilter
      labelPrefix="요일"
      selectedItems={selectedDays}
      handleChangeCheckbox={handleChangeCheckbox}
      options={DAYS}
    />
  );
}

export default DayFilter;
