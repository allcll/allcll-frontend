import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import DayTimeFilter, { IDayTimeItem } from './DayTimeFilter.tsx';
import useMobile from '@/shared/lib/useMobile.ts';
import { Filtering } from '@allcll/common';

interface IDayFilter {
  times: IDayTimeItem[];
  setFilter: (field: keyof Filters, value: IDayTimeItem[]) => void;
}

function DayFilter({ times, setFilter }: IDayFilter) {
  const setFilterWrapper = (_: keyof Filters, value: IDayTimeItem[]) => {
    setFilter('time', value);
  };
  const isMobile = useMobile();

  const getLabelPrefix = () => {
    if (times.length === 1 && times[0].type === 'all' && times[0].day === '') return '시간';
    if (times.length === 1) return ` ${times[0].day}요일`;
    if (times.length > 1) return ` ${times[0].day}요일 외 ${times.length - 1}개`;
    return '시간';
  };

  const labelPrefix = getLabelPrefix();

  return isMobile ? (
    <DayTimeFilter items={times} onChange={items => setFilterWrapper('time', items)} />
  ) : (
    <Filtering label={labelPrefix} selected={times.length > 0 && times[0].day !== ''} className="min-w-max w-72">
      <DayTimeFilter items={times} onChange={items => setFilterWrapper('time', items)} />
    </Filtering>
  );
}

export default DayFilter;
