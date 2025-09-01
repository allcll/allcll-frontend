import { RangeFilter } from '@/utils/types.ts';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import SingleSelectFilterOption from '@/components/common/filter/SingleSelectFilter';
import { Filters } from '@/store/useFilterStore';
import useMobile from '@/hooks/useMobile';
import { WISH_RANGE, WISH_RANGE_VALUES } from './constants/Filters';

interface IWishFilter {
  wishRange: RangeFilter | null;
  setFilter: (field: keyof Filters, value: RangeFilter | null) => void;
}

function WishFilter({ wishRange, setFilter }: IWishFilter) {
  const selectedValue = WISH_RANGE_VALUES.find(v => v?.value === wishRange?.value) || null;
  const isMobile = useMobile();

  const setFilterWrapper = (_: keyof Filters, optionValue: number | null) => {
    setFilter(
      'wishRange',
      optionValue !== null ? (WISH_RANGE_VALUES.find(v => v?.value === optionValue) ?? null) : null,
    );
  };

  const getLabelPrefix = () => {
    if (wishRange) return `관심인원 ${wishRange.value}명 이상`;
    return '관심인원';
  };

  const labelPrefix = getLabelPrefix();

  return isMobile ? (
    <SingleSelectFilterOption
      labelPrefix="관심과목"
      selectedValue={selectedValue?.value || null}
      field="wishRange"
      setFilter={setFilterWrapper}
      options={WISH_RANGE}
      ItemComponent={Chip}
    />
  ) : (
    <Filtering label={labelPrefix} selected={selectedValue?.value !== -1} className="min-w-max">
      <SingleSelectFilterOption
        labelPrefix="관심과목"
        selectedValue={selectedValue?.value || null}
        field="wishRange"
        setFilter={setFilterWrapper}
        options={WISH_RANGE}
        ItemComponent={Chip}
      />
    </Filtering>
  );
}

export default WishFilter;
