import { Filters } from '@/store/useFilterStore';
import { RangeFilter } from '@/utils/types.ts';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import SingleSelectFilterOption from '@/components/common/filter/SingleSelectFilter';
import useMobile from '@/hooks/useMobile';
import { SEAT_RANGE, SEAT_RANGE_VALUES } from './constants/Filters';

interface ISeatFilter {
  seatRange: RangeFilter | null;
  setFilter: (field: keyof Filters, value: RangeFilter | null) => void;
}

function SeatFilter({ seatRange, setFilter }: ISeatFilter) {
  const selectedValue = Math.max(0, SEAT_RANGE_VALUES.find(v => v?.value === seatRange?.value)?.value ?? 0);
  const isMobile = useMobile();

  const setFilterWrapper = (_: keyof Filters, value: number | null) => {
    setFilter('seatRange', value !== null ? (SEAT_RANGE_VALUES.find(v => v?.value === value) ?? null) : null);
  };

  const getLabelPrefix = () => {
    if (seatRange?.operator === 'under-equal') return `여석 ${seatRange.value}개 이하`;

    if (seatRange) return `여석 ${seatRange.value}개 이상`;
    return '여석';
  };

  const labelPrefix = getLabelPrefix();

  return isMobile ? (
    <SingleSelectFilterOption
      labelPrefix="여석"
      selectedValue={selectedValue}
      field="seatRange"
      setFilter={setFilterWrapper}
      options={SEAT_RANGE}
      ItemComponent={Chip}
    />
  ) : (
    <Filtering label={labelPrefix} selected={selectedValue !== 0} className="min-w-max">
      <SingleSelectFilterOption
        labelPrefix="여석"
        selectedValue={selectedValue}
        field="seatRange"
        setFilter={setFilterWrapper}
        options={SEAT_RANGE}
        ItemComponent={Chip}
      />
    </Filtering>
  );
}

export default SeatFilter;
