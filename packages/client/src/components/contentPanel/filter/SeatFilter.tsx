import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import SingleCheckboxFilter, { OptionType } from '@common/components/filtering/SingleCheckbox';
import { RangeFilter } from '@/utils/types.ts';
import Chip from '@common/components/chip/Chip';

const SEAT: OptionType<number>[] = [
  { value: 0, label: '전체' },
  { value: 1, label: '여석 1개 이하' },
  { value: 2, label: '여석 2개 이상' },
  { value: 3, label: '여석 5개 이상' },
  { value: 4, label: '여석 10개 이상' },
];

const RANGE_VALUES: Array<RangeFilter | null> = [
  null,
  { operator: 'under-equal', value: 1 },
  { operator: 'over-equal', value: 2 },
  { operator: 'over-equal', value: 5 },
  { operator: 'over-equal', value: 10 },
];

function SeatFilter() {
  const { seatRange } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const selectedValue = Math.max(
    0,
    RANGE_VALUES.findIndex(v => v === seatRange),
  );

  const setFilterScheduleWrapper = (field: string, value: number | null) => {
    if (field === 'selectedSeatRange') {
      setFilter('seatRange', RANGE_VALUES[value ?? 0]);
    }
  };

  return (
    <SingleCheckboxFilter
      labelPrefix="여석"
      selectedValue={selectedValue}
      field="selectedSeatRange"
      setFilterSchedule={setFilterScheduleWrapper}
      options={SEAT}
      selected={!!seatRange}
      ItemComponent={Chip}
      className="min-w-max"
    />
  );
}

export default SeatFilter;
