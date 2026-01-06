import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/shared/model/useFilterStore.ts';
import { getLabelFormatter, labelPrefix } from '@/features/filtering/lib/getFilteringFormatter.ts';
import { FilterItemProps, FilterValueType } from '@/shared/model/types.ts';
import { Button, Flex, Grid, Label } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';
import { useState } from 'react';

const MAX_VISIBLE = 9;

interface IMultiSelectFilter<K extends keyof Filters> {
  selectedValues: FilterValueType<K>[] | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K>[] | null) => void;
  options: FilterValueType<K>[];
  ItemComponent: React.ComponentType<FilterItemProps>;
}

type ItemWithLayout = React.ComponentType<FilterItemProps> & {
  layout?: 'grid' | 'flex';
};

function MultiSelectFilter<K extends keyof Filters>({
  selectedValues,
  filterKey,
  setFilter,
  options,
  ItemComponent,
}: Readonly<IMultiSelectFilter<K>>) {
  const labelFormatters = getLabelFormatter();
  const layout = (ItemComponent as ItemWithLayout).layout ?? 'grid';

  const isMobile = useMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChangeCheckbox = (optionValue: FilterValueType<K>) => {
    const checked = selectedValues?.includes(optionValue);
    const newValues = checked
      ? selectedValues?.filter(selected => selected !== optionValue)
      : [...(selectedValues ?? []), optionValue];

    setFilter(filterKey, newValues ?? null);
  };

  const handleClickReset = () => {
    setFilter(filterKey, null);
  };

  const visibleOptions = !isExpanded && options.length > MAX_VISIBLE ? options.slice(0, MAX_VISIBLE) : options;

  return (
    <div className="relative inline-block w-full">
      <Flex direction="flex-row" gap="gap-2" className="mb-4">
        <Label>{labelPrefix[filterKey]}</Label>
      </Flex>

      {layout === 'grid' ? (
        <Grid columns={{ md: 3 }} gap="gap-2">
          {visibleOptions.map(option => (
            <ItemComponent
              key={String(option)}
              label={labelFormatters[filterKey]?.(option) ?? String(option)}
              selected={selectedValues?.includes(option) ?? false}
              onClick={() => handleChangeCheckbox(option)}
            />
          ))}
        </Grid>
      ) : (
        <Flex direction="flex-col" gap="gap-2">
          {visibleOptions.map(option => (
            <ItemComponent
              key={String(option)}
              label={labelFormatters[filterKey]?.(option) ?? String(option)}
              selected={selectedValues?.includes(option) ?? false}
              onClick={() => handleChangeCheckbox(option)}
            />
          ))}
        </Flex>
      )}

      {options.length > MAX_VISIBLE && (
        <Button variant="text" size="small" textColor="gray" onClick={() => setIsExpanded(prev => !prev)}>
          {isExpanded ? '간략히' : '더보기'}
        </Button>
      )}

      {!isMobile && selectedValues && selectedValues.length > 0 && (
        <Flex justify="justify-end">
          <Button variant="text" size="small" textColor="gray" onClick={() => handleClickReset()}>
            <ResetSvg className="inline w-3 h-3 mr-1" stroke="currentColor" />
            초기화
          </Button>
        </Flex>
      )}
    </div>
  );
}

export default MultiSelectFilter;
