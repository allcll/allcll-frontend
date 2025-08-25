import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import SingleCheckboxFilter, { OptionType } from '@common/components/filtering/SingleCheckbox';

export const SEAT: OptionType<number>[] = [
  { value: 0, label: '여석 없음' },
  { value: 1, label: '여석 1개' },
  { value: 2, label: '여석 2개 이상' },
  { value: 5, label: '여석 5개 이상' },
  { value: 10, label: '여석 10개 이상' },
];

function SeatFilter() {
  const { selectedSeatRange, setFilterSchedule } = useFilterScheduleStore();

  const setFilterScheduleWrapper = (field: string, value: number | null) => {
    if (field === 'selectedSeatRange') {
      setFilterSchedule('selectedSeatRange', value || 0);
    }
  };

  return (
    <SingleCheckboxFilter
      labelPrefix="여석"
      variant="chip"
      selectedValue={selectedSeatRange}
      field="selectedSeatRange"
      setFilterSchedule={setFilterScheduleWrapper}
      options={SEAT}
      selected={selectedSeatRange > -1}
      className="min-w-max"
    />
  );
}

export default SeatFilter;
