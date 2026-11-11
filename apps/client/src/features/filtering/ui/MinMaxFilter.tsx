import { useEffect, useState } from 'react';
import { Flex, Label, RangeSlider } from '@allcll/allcll-ui';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { RangeMinMaxFilter } from '@/features/filtering/model/types.ts';
import { getLabelFormatter, labelPrefix } from '@/features/filtering/lib/getFilteringFormatter.ts';

// 대부분 낮은 값에 몰려 있어 끝을 열어 두고, 끝에 놓으면 상한 없음으로 처리
const RANGE_END: Partial<Record<keyof Filters, number>> = {
  wishRange: 200,
  seatRange: 20,
};

interface IMinMaxFilter<K extends keyof Filters> {
  selectedValue: RangeMinMaxFilter | null;
  filterKey: K;
  setFilter: (field: K, value: RangeMinMaxFilter | null) => void;
}

function MinMaxFilter<K extends keyof Filters>({ selectedValue, filterKey, setFilter }: Readonly<IMinMaxFilter<K>>) {
  const end = RANGE_END[filterKey] ?? 100;
  const [dragging, setDragging] = useState<[number, number] | null>(null);
  const [low, high] = dragging ?? [selectedValue?.min ?? 0, selectedValue?.max ?? end];

  // 키보드 조작은 확정이 변경보다 먼저 와서 임시 값이 남을 수 있으므로 필터 값이 바뀌면 비움
  useEffect(() => setDragging(null), [selectedValue]);

  const toRange = (nextLow: number, nextHigh: number): RangeMinMaxFilter | null => {
    const range: RangeMinMaxFilter = {
      ...(nextLow > 0 && { min: nextLow }),
      ...(nextHigh < end && { max: nextHigh }),
    };
    return Object.keys(range).length ? range : null;
  };

  // 끄는 동안 목록을 다시 거르지 않도록 손을 뗄 때만 필터에 반영
  const handleCommit = ([nextLow, nextHigh]: [number, number]) => {
    setDragging(null);
    setFilter(filterKey, toRange(nextLow, nextHigh));
  };

  const formatRange = getLabelFormatter()[filterKey] as ((value: RangeMinMaxFilter | null) => string) | undefined;
  const rangeLabel = formatRange?.(toRange(low, high)) || '전체';

  return (
    <Flex direction="column" gap={3} className="w-full">
      <Flex justify="between" align="center">
        <Label>범위 설정</Label>
        <span className="text-sm text-gray-600">{rangeLabel}</span>
      </Flex>

      <RangeSlider
        min={0}
        max={end}
        value={[low, high]}
        onValueChange={setDragging}
        onValueCommit={handleCommit}
        thumbLabels={[`${labelPrefix[filterKey]} 최솟값`, `${labelPrefix[filterKey]} 최댓값`]}
        className="px-1"
      />
    </Flex>
  );
}

export default MinMaxFilter;
