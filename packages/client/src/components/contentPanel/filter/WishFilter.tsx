import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import SingleCheckboxFilter, { OptionType } from '@common/components/filtering/SingleCheckbox';

export const WISHRANGE: OptionType<number>[] = [
  { value: 30, label: '관심인원 30명 이상' },
  { value: 50, label: '관심인원 50명 이상' },
  { value: 100, label: '관심인원 100명 이상' },
  { value: 200, label: '관심인원  200명 이상' },
];

function WishFilter() {
  const { selectedWishRange, setFilterSchedule } = useFilterScheduleStore();

  const setFilterScheduleWrapper = (field: string, value: number | null) => {
    if (field === 'selectedWishRange') {
      setFilterSchedule('selectedWishRange', value || 0);
    }
  };

  return (
    <SingleCheckboxFilter
      labelPrefix="관심과목"
      selectedValue={selectedWishRange}
      field="selectedWishRange"
      variant="chip"
      setFilterSchedule={setFilterScheduleWrapper}
      options={WISHRANGE}
      selected={selectedWishRange !== -1}
      className="min-w-max"
    />
  );
}

export default WishFilter;
