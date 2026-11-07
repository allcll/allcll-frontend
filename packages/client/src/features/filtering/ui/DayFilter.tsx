import { Button, Chip, Flex, Label, SegmentedControl } from '@allcll/allcll-ui';
import { Filtering, formatMultiSelectedLabel } from '@allcll/common';
import { Day, DAYS } from '@/entities/timetable/model/types.ts';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { DayTimeRanges, RangeMinMaxFilter } from '@/features/filtering/model/types.ts';
import { getTimeRangeLabel } from '@/features/filtering/lib/getFilteringFormatter.ts';
import useMobile from '@/shared/lib/useMobile.ts';
import MultiSelectFilter from './MultiSelectFilter.tsx';
import TimeRangeFilter from './TimeRangeFilter.tsx';

interface IDayFilter {
  options: Day[];
  days: Day[];
  time: RangeMinMaxFilter | null;
  dayTimes: DayTimeRanges | null;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
}

function DayFilter({ options, days, time, dayTimes, setFilter }: Readonly<IDayFilter>) {
  const isMobile = useMobile();
  const hasValue = days.length > 0 || !!time || !!dayTimes;
  const showPerDay = !!dayTimes && days.length > 0;

  const handlePerDayChange = (checked: boolean) => {
    if (checked) {
      setFilter('dayTimes', time ? Object.fromEntries(days.map(day => [day, time])) : {});
      setFilter('time', null);
      return;
    }

    const ranges = days.map(day => dayTimes?.[day]);
    const [first] = ranges;
    const isSameRange = !!first && ranges.every(range => range?.min === first.min && range?.max === first.max);
    setFilter('dayTimes', null);
    if (isSameRange) setFilter('time', first);
  };

  const handleDaysChange = (selectedDays: Day[]) => {
    setFilter(
      'days',
      DAYS.filter(day => selectedDays.includes(day)),
    );
  };

  const handleDayTimeChange = (day: Day, range: RangeMinMaxFilter | null) => {
    const next: DayTimeRanges = { ...dayTimes };
    if (range) next[day] = range;
    else delete next[day];
    setFilter('dayTimes', next);
  };

  const modeSwitch = (
    <SegmentedControl
      aria-label="시간대 설정 방식"
      options={[
        { value: 'common', label: '공통' },
        { value: 'perDay', label: '요일별', disabled: !days.length },
      ]}
      value={showPerDay ? 'perDay' : 'common'}
      onValueChange={value => handlePerDayChange(value === 'perDay')}
    />
  );

  const content = (
    <Flex direction="flex-col" gap="gap-6" className="w-full">
      <MultiSelectFilter
        filterKey="days"
        options={options}
        selectedValues={days}
        setFilter={(_, value) => handleDaysChange(value ?? [])}
        ItemComponent={Chip}
        showReset={false}
      />

      {showPerDay ? (
        <Flex direction="flex-col" gap="gap-3">
          <Flex justify="justify-between" align="items-center">
            <Label>시간대</Label>
            {modeSwitch}
          </Flex>
          {days.map(day => (
            <TimeRangeFilter
              key={day}
              label={`${day}요일`}
              value={dayTimes?.[day] ?? null}
              onChange={range => handleDayTimeChange(day, range)}
            />
          ))}
        </Flex>
      ) : (
        <TimeRangeFilter label="시간대" action={modeSwitch} value={time} onChange={value => setFilter('time', value)} />
      )}
    </Flex>
  );

  if (isMobile) return content;

  const label = showPerDay
    ? formatMultiSelectedLabel('시간', days, day =>
        [day, getTimeRangeLabel(dayTimes?.[day] ?? null)].filter(Boolean).join(' '),
      )
    : [days.join(', '), getTimeRangeLabel(time)].filter(Boolean).join(' ') || '시간';

  return (
    <Filtering label={label} selected={hasValue} className="w-80">
      {content}
      <Flex justify="justify-end" className="mt-3 pt-1.5 -mb-1.5 border-t border-gray-100">
        <Button
          variant="text"
          size="small"
          color="gray"
          disabled={!hasValue}
          onClick={() => {
            setFilter('days', []);
            setFilter('time', null);
            setFilter('dayTimes', null);
          }}
        >
          초기화
        </Button>
      </Flex>
    </Filtering>
  );
}

export default DayFilter;
