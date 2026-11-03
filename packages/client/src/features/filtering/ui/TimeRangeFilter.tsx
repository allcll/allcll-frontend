import { useEffect, useState } from 'react';
import { Flex, Label, RangeSlider } from '@allcll/allcll-ui';
import { RangeMinMaxFilter } from '@/features/filtering/model/types.ts';
import { getTimeRangeLabel } from '@/features/filtering/lib/getFilteringFormatter.ts';

const TIME_RANGE_START = 9 * 60;
const TIME_RANGE_END = 22 * 60;
const TIME_RANGE_STEP = 30;

interface ITimeRangeFilter {
  value: RangeMinMaxFilter | null;
  onChange: (value: RangeMinMaxFilter | null) => void;
}

function TimeRangeFilter({ value, onChange }: Readonly<ITimeRangeFilter>) {
  const [dragging, setDragging] = useState<[number, number] | null>(null);
  const [low, high] = dragging ?? [value?.min ?? TIME_RANGE_START, value?.max ?? TIME_RANGE_END];

  useEffect(() => setDragging(null), [value]);

  const toRange = (nextLow: number, nextHigh: number): RangeMinMaxFilter | null => {
    const range: RangeMinMaxFilter = {
      ...(nextLow > TIME_RANGE_START && { min: nextLow }),
      ...(nextHigh < TIME_RANGE_END && { max: nextHigh }),
    };
    return Object.keys(range).length ? range : null;
  };

  const handleCommit = ([nextLow, nextHigh]: [number, number]) => {
    setDragging(null);
    onChange(toRange(nextLow, nextHigh));
  };

  return (
    <Flex direction="flex-col" gap="gap-3" className="w-full">
      <Flex justify="justify-between" align="items-center">
        <Label>시간대</Label>
        <span className="text-sm text-gray-600">{getTimeRangeLabel(toRange(low, high)) || '전체'}</span>
      </Flex>

      <RangeSlider
        min={TIME_RANGE_START}
        max={TIME_RANGE_END}
        step={TIME_RANGE_STEP}
        value={[low, high]}
        onValueChange={setDragging}
        onValueCommit={handleCommit}
        thumbLabels={['시작 시각', '끝 시각']}
        className="px-1"
      />
    </Flex>
  );
}

export default TimeRangeFilter;
