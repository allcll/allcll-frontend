import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import { Day } from '@/utils/types';
import CheckboxFilter, { OptionType } from '@common/components/filtering/CheckboxFilter';

const DAYS: OptionType<Day>[] = [
  { value: '월', label: '월요일' },
  { value: '화', label: '화요일' },
  { value: '수', label: '수요일' },
  { value: '목', label: '목요일' },
  { value: '금', label: '금요일' },
];

function DayFilter() {
  const { selectedDays, setFilterSchedule } = useFilterScheduleStore();

  const setFilterScheduleWrapper = (field: string, value: Day[]) => {
    if (field === 'selectedDays') {
      setFilterSchedule('selectedDays', value);
    }
  };

  return (
    <CheckboxFilter
      labelPrefix="요일"
      selectedValues={selectedDays}
      field="selectedDays"
      setFilterSchedule={setFilterScheduleWrapper}
      options={DAYS}
      selected={selectedDays.length !== 0}
    />
  );
}

export default DayFilter;
