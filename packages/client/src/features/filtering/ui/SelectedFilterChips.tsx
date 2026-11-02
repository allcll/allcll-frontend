import { useLayoutEffect, useRef, useState } from 'react';
import { Button, Chip, ChevronDownIcon, Flex, Label } from '@allcll/allcll-ui';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { FilterValueType } from '@/features/filtering/model/types.ts';
import { getAllSelectedLabels } from '@/features/filtering/lib/filterUtils.ts';

const COLLAPSED_ROWS = 1;
const CHIP_GAP = 8;

interface SelectedFilterChipsProps {
  items: ReturnType<typeof getAllSelectedLabels>;
  onDelete: (filterKey: keyof Filters, value: FilterValueType<keyof Filters>) => void;
}

function SelectedFilterChips({ items, onDelete }: Readonly<SelectedFilterChipsProps>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState<{ height: number; hiddenFrom: number } | null>(null);

  // 칩 길이와 폭에 따라 줄 수가 달라지므로, 실제 배치에서 다음 줄이 시작되는 위치로 접힌 높이를 정함
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const chipTops = [...list.children].map(chip => (chip as HTMLElement).offsetTop);
      const rowTops = [...new Set(chipTops)];
      if (rowTops.length <= COLLAPSED_ROWS) return setCollapsed(null);

      const hiddenTop = rowTops[COLLAPSED_ROWS];
      setCollapsed({ height: hiddenTop - CHIP_GAP, hiddenFrom: chipTops.indexOf(hiddenTop) });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const isCollapsed = collapsed !== null && !isExpanded;

  return (
    <Flex direction="flex-col" gap="gap-2">
      <Flex justify="justify-between" align="items-center">
        <Label>
          선택된 필터 <span className="text-primary-500">{items.length}</span>
        </Label>
        {collapsed !== null && (
          <Button variant="text" size="small" color="gray" onClick={() => setIsExpanded(prev => !prev)}>
            <ChevronDownIcon className={`w-4 h-4 ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? '간략히' : '더보기'}
          </Button>
        )}
      </Flex>

      <div
        ref={listRef}
        className="relative flex flex-wrap gap-2 overflow-hidden"
        style={isCollapsed ? { maxHeight: collapsed.height } : undefined}
      >
        {items.map((filter, index) => {
          const isHidden = isCollapsed && index >= collapsed.hiddenFrom;
          return (
            <Chip
              key={`${filter.filterKey}-${filter.values}`}
              variant="cancel"
              label={filter.label}
              selected
              onClick={() => onDelete(filter.filterKey, filter.values)}
              tabIndex={isHidden ? -1 : undefined}
              aria-hidden={isHidden || undefined}
            />
          );
        })}
      </div>
    </Flex>
  );
}

export default SelectedFilterChips;
