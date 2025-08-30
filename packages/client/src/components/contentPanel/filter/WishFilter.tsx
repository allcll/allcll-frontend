import { OptionType, RangeFilter } from '@/utils/types.ts';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import SingleSelectFilterOption from '@/components/common/filter/SingleSelectFilter';
import { Filters } from '@/store/useFilterStore';
import useMobile from '@/hooks/useMobile';

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

interface IWishFilter {
  wishRange: RangeFilter | null;
  setFilter: (field: keyof Filters, value: RangeFilter | null) => void;
}

function WishFilter({ wishRange, setFilter }: IWishFilter) {
  const selectedValue = RANGE_VALUES.findIndex(v => v === wishRange);
  const isMobile = useMobile();


  const setFilterScheduleWrapper = (field: string, value: number | null) => {
    if (field === 'wishRange') {
      setFilter('wishRange', value !== null ? RANGE_VALUES[value] : null);
    }
  };

  const getLabelPrefix = () => {
    if (wishRange) return `관심인원 ${wishRange.value}명 이상`;
    return '관심인원';
  };

  const labelPrefix = getLabelPrefix();

  return isMobile ? (
    <SingleSelectFilterOption
      labelPrefix="관심과목"
      selectedValue={selectedValue}
      field="wishRange"
      setFilter={setFilterScheduleWrapper}
      options={WISHRANGE}
      ItemComponent={Chip}
    />
  ) : (
    <Filtering label={labelPrefix} selected={selectedValue !== -1} className="min-w-max">
      <SingleSelectFilterOption
        labelPrefix="관심과목"
        selectedValue={selectedValue}
        field="wishRange"
        setFilter={setFilterScheduleWrapper}
        options={WISHRANGE}
        ItemComponent={Chip}
      />
    </Filtering>
  );
}

export default WishFilter;
