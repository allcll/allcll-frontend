import { Filters } from '@/store/useFilterStore';
import { OptionType, RangeFilter } from '@/utils/types.ts';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import SingleSelectFilterOption from '@/components/common/filter/SingleSelectFilter';

const SEAT_RANGE: OptionType<number>[] = [
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

interface ISeatFilter {
  seatRange: RangeFilter | null;
  setFilter: (field: keyof Filters, value: RangeFilter | null) => void;
}

function SeatFilter({ seatRange, setFilter }: ISeatFilter) {
  const selectedValue = Math.max(
    0,
    RANGE_VALUES.findIndex(v => v === seatRange),
  );

  const setFilterScheduleWrapper = (field: keyof Filters, value: number | null) => {
    if (field === 'seatRange') {
      setFilter('seatRange', value !== null ? RANGE_VALUES[value] : null);
    }
  };

  const getLabelPrefix = () => {
    if (seatRange) return `여석 ${seatRange.value}개 이상`;
    return '여석';
  };

  const labelPrefix = getLabelPrefix();

  return (
    <Filtering label={labelPrefix} selected={selectedValue !== 0} className="min-w-max">
      <SingleSelectFilterOption
        labelPrefix="여석"
        selectedValue={selectedValue}
        field="seatRange"
        setFilter={setFilterScheduleWrapper}
        options={SEAT_RANGE}
        ItemComponent={Chip}
      />
    </Filtering>
  );
}

export default SeatFilter;
