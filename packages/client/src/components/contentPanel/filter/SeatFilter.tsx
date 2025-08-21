import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';

const SEAT = ['0명', '1명이상', '5명이상', '10명이상'];

function SeatFilter() {
  const { selectedSeatRange, setFilterSchedule } = useFilterScheduleStore();

  const handleSeatRangeChange = (value: string) => {
    const currentSelection = selectedSeatRange.includes(value);
    if (currentSelection) {
      setFilterSchedule('selectedSeatRange', '');
    } else {
      setFilterSchedule('selectedSeatRange', value);
    }
  };

  const getFilteringLabel = () => {
    if (selectedSeatRange) {
      return `여석 ${selectedSeatRange}`;
    }
    return '여석';
  };

  return (
    <Filtering label={getFilteringLabel()} selected={selectedSeatRange.length !== 0} className="min-w-max">
      <h3 className="text-gray-700 font-semibold">여석</h3>
      <div className="grid grid-cols-2 gap-2">
        {SEAT.map(seat => (
          <Chip
            key={seat}
            label={seat}
            selected={seat === selectedSeatRange}
            onClick={() => handleSeatRangeChange(seat)}
          />
        ))}
      </div>
    </Filtering>
  );
}

export default SeatFilter;
