import { Button, Chip, Flex } from '@allcll/allcll-ui';
import { Filtering } from '@allcll/common';
import { Day } from '@/entities/timetable/model/types.ts';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { RangeMinMaxFilter } from '@/features/filtering/model/types.ts';
import { getTimeRangeLabel } from '@/features/filtering/lib/getFilteringFormatter.ts';
import useMobile from '@/shared/lib/useMobile.ts';
import MultiSelectFilter from './MultiSelectFilter.tsx';
import TimeRangeFilter from './TimeRangeFilter.tsx';

interface IDayFilter {
  options: Day[];
  days: Day[];
  time: RangeMinMaxFilter | null;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
}

function DayFilter({ options, days, time, setFilter }: Readonly<IDayFilter>) {
  const isMobile = useMobile();
  const hasValue = days.length > 0 || !!time;

  const content = (
    <Flex direction="flex-col" gap="gap-6" className="w-full">
      <MultiSelectFilter
        filterKey="days"
        options={options}
        selectedValues={days}
        setFilter={(_, value) => setFilter('days', value ?? [])}
        ItemComponent={Chip}
        showReset={false}
      />
      <TimeRangeFilter value={time} onChange={value => setFilter('time', value)} />
    </Flex>
  );

  if (isMobile) return content;

  const label = [days.join(', '), getTimeRangeLabel(time)].filter(Boolean).join(' ') || '시간';

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
          }}
        >
          초기화
        </Button>
      </Flex>
    </Filtering>
  );
}

export default DayFilter;
