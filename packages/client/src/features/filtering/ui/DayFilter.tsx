import { Filters } from '@/store/useFilterStore.ts';
import Filtering from '@common/components/filtering/Filtering.tsx';
import DayTimeFilter, { IDayTimeItem } from './DayTimeFilter.tsx';
import useMobile from '@/shared/lib/useMobile.ts';
import { Label } from '../../../../../allcll-ui';

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
    if (times.length === 1 && times[0].type === 'all' && times[0].day === '') return '요일';
    if (times.length === 1) return ` ${times[0].day}요일`;
    if (times.length > 1) return ` ${times[0].day}요일 외 ${times.length - 1}개`;
    return '요일';
  };

  const labelPrefix = getLabelPrefix();

  return isMobile ? (
    <DayTimeFilter items={times} onChange={items => setFilterWrapper('time', items)} />
  ) : (
    <Filtering label={labelPrefix} selected={times.length > 0 && times[0].day !== ''} className="min-w-max">
      <Label>강의 시간</Label>
      <DayTimeFilter items={times} onChange={items => setFilterWrapper('time', items)} />
    </Filtering>
  );
}

export default DayFilter;
