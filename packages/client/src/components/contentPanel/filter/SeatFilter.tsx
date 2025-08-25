import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import SingleCheckboxFilter, { OptionType } from '@common/components/filtering/SingleCheckbox';

export const SEAT: OptionType<number>[] = [
  { value: 0, label: '여석 없음' },
  { value: 1, label: '여석 1개' },
  { value: 2, label: '여석 2개 이상' },
  { value: 5, label: '여석 5개 이상' },
  { value: 10, label: '여석 10개 이상' },
];

function SeatFilter() {
  const { seatRange } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);

  const setFilterScheduleWrapper = (field: string, value: number | null) => {
    if (field === 'selectedSeatRange') {
      setFilter('seatRange', { operator: 'over-equal', value: value || 0 });
    }
  };

  return (
    <SingleCheckboxFilter
      labelPrefix="여석"
      variant="chip"
      selectedValue={seatRange?.value ?? 0}
      field="selectedSeatRange"
      setFilterSchedule={setFilterScheduleWrapper}
      options={SEAT}
      selected={!!seatRange}
      className="min-w-max"
    />
  );
}

export default SeatFilter;
