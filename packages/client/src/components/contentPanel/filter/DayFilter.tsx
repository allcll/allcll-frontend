import { Filters } from '@/store/useFilterStore';
import Filtering from '@common/components/filtering/Filtering';
import DayTimeFilter, { IDayTimeItem } from './DayTimeFilter';

interface IDayFilter {
  times: IDayTimeItem[];
  setFilter: (field: keyof Filters, value: IDayTimeItem[]) => void;
}

function DayFilter({ times, setFilter }: IDayFilter) {
  const setFilterScheduleWrapper = (field: keyof Filters, value: IDayTimeItem[]) => {
    if (field === 'time') {
      setFilter('time', value);
    }
  };

  const getLabelPrefix = () => {
    if (times.length === 1 && times[0].type === 'all' && times[0].day === '') return '요일';
    if (times.length > 0) return ` ${times[0].day}`;
    return '요일';
  };

  const labelPrefix = getLabelPrefix();

  return (
    <Filtering label={labelPrefix} selected={times.length > 0} className="min-w-max">
      <DayTimeFilter items={times} onChange={items => setFilterScheduleWrapper('time', items)} />
    </Filtering>
  );
}

export default DayFilter;
