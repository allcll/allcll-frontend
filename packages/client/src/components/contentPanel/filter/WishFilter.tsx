import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { RangeFilter } from '@/utils/types.ts';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import SingleSelectFilter, { OptionType } from '@common/components/filtering/SingleSelectFilter';

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

  const getLabelPrefix = () => {
    if (wishRange) return `관심인원 ${wishRange.value}명 이상`;
    return '관심인원';
  };

  const labelPrefix = getLabelPrefix();

  return (
    <Filtering label={labelPrefix} selected={selectedValue !== -1} className="min-w-max">
      <SingleSelectFilter
        labelPrefix="관심과목"
        selectedValue={selectedValue}
        field="selectedWishRange"
        setFilter={setFilterScheduleWrapper}
        options={WISHRANGE}
        ItemComponent={Chip}
      />
    </Filtering>
  );
}

export default WishFilter;
