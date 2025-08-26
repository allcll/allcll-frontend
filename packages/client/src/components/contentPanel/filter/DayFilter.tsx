import useMobile from '@/hooks/useMobile';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { Day } from '@/utils/types';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';
import MultiSelectFilterOption, { OptionType } from '@common/components/filtering/MultiSelectFilterOption';

export const DAYS: OptionType<Day>[] = [
  { value: '월', label: '월요일' },
  { value: '화', label: '화요일' },
  { value: '수', label: '수요일' },
  { value: '목', label: '목요일' },
  { value: '금', label: '금요일' },
];

function DayFilter() {
  const { time } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const isMobile = useMobile();

  const setFilterWrapper = (field: string, value: Day[]) => {
    if (field === 'selectedDays') {
      setFilter(
        'time',
        value.map(day => ({ day, type: 'all' })),
      );
    }
  };

  const getLabelPrefix = () => {
    if (time.length === 0) return '요일';
    if (time.length === 1) return time[0].day + '요일';
    return time[0].day + '요일 외 ' + (time.length - 1) + '개';
  };

  const labelPrefix = getLabelPrefix();

  return (
    <>
      {isMobile ? (
        <MultiSelectFilterOption<Day>
          labelPrefix="요일"
          selectedValues={time.map(t => t.day).filter((day): day is Day => day !== '')}
          field="selectedDays"
          setFilter={setFilterWrapper}
          options={DAYS}
          ItemComponent={Chip}
          className="w-full flex flex-row gap-2"
        />
      ) : (
        <Filtering label={labelPrefix} selected={time.length > 0} className="min-w-max">
          <MultiSelectFilterOption<Day>
            labelPrefix="요일"
            selectedValues={time.map(t => t.day).filter((day): day is Day => day !== '')}
            field="selectedDays"
            setFilter={setFilterWrapper}
            options={DAYS}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
      )}
    </>
  );
}

export default DayFilter;
