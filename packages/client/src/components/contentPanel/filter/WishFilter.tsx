import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';

const WISHRANGE = ['30명 이상', '50명 이상', '100명 이상', '200명 이상'];

function WishFilter() {
  const { selectedWishRange, setFilterSchedule } = useFilterScheduleStore();

  const handleWishRangeChange = (value: string) => {
    const currentSelection = selectedWishRange.includes(value);
    if (currentSelection) {
      setFilterSchedule('selectedWishRange', '');
    } else {
      setFilterSchedule('selectedWishRange', value);
    }
  };

  const getFilteringLabel = () => {
    if (selectedWishRange) {
      return `관심인원 ${selectedWishRange}`;
    }
    return '관심과목';
  };

  return (
    <Filtering label={getFilteringLabel()} selected={selectedWishRange.length !== 0} className="min-w-max">
      <h3 className="text-gray-700 font-semibold">관심과목</h3>
      <div className="grid grid-cols-2 gap-2">
        {WISHRANGE.map(range => (
          <Chip
            key={range}
            label={range}
            selected={range === selectedWishRange}
            onClick={() => handleWishRangeChange(range)}
          />
        ))}
      </div>
    </Filtering>
  );
}

export default WishFilter;
