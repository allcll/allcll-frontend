import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import SingleCheckboxFilter, { OptionType } from '@common/components/filtering/SingleCheckbox';
import { RangeFilter } from '@/utils/types.ts';

const WISHRANGE: OptionType<number>[] = [
  { value: 0, label: '관심인원 30명 이상' },
  { value: 1, label: '관심인원 50명 이상' },
  { value: 2, label: '관심인원 100명 이상' },
  { value: 3, label: '관심인원  200명 이상' },
];

const RANGE_VALUES: Array<RangeFilter | null> = [
  { operator: 'over-equal', value: 30 },
  { operator: 'over-equal', value: 50 },
  { operator: 'over-equal', value: 100 },
  { operator: 'over-equal', value: 200 },
];

function WishFilter() {
  const { wishRange } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const selectedValue = RANGE_VALUES.findIndex(v => v === wishRange);

  const setFilterScheduleWrapper = (field: string, value: number | null) => {
    if (field === 'selectedWishRange') {
      setFilter('wishRange', value !== null ? RANGE_VALUES[value] : null);
    }
  };

  return (
    <SingleCheckboxFilter
      labelPrefix="관심과목"
      selectedValue={selectedValue}
      field="selectedWishRange"
      variant="chip"
      setFilterSchedule={setFilterScheduleWrapper}
      options={WISHRANGE}
      selected={!!wishRange}
      className="min-w-max"
    />
  );
}

export default WishFilter;
