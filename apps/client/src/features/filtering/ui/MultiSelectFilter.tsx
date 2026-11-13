import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { getLabelFormatter, labelPrefix } from '@/features/filtering/lib/getFilteringFormatter.ts';
import { Button, ChevronDownIcon, Flex, Grid, Label } from '@allcll/allcll-ui';
import { useState } from 'react';
import { FilterItemProps, FilterValueType } from '@/features/filtering/model/types.ts';

const MAX_VISIBLE = 9;

interface IMultiSelectFilter<K extends keyof Filters> {
  selectedValues: FilterValueType<K>[] | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K>[] | null) => void;
  options: FilterValueType<K>[];
  ItemComponent: React.ComponentType<FilterItemProps>;
  showReset?: boolean;
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
  showReset = true,
}: Readonly<IMultiSelectFilter<K>>) {
  const labelFormatters = getLabelFormatter();
  const layout = (ItemComponent as ItemWithLayout).layout ?? 'grid';

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
      <Flex direction="column" gap={2}>
        <Label>{labelPrefix[filterKey]}</Label>

        {layout === 'grid' ? (
          <Grid columns={{ md: 3 }} gap={2}>
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
          <Flex direction="column" gap={2} className="pr-4">
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
      </Flex>

      {(showReset || options.length > MAX_VISIBLE) && (
        <Flex
          justify="between"
          align="center"
          className={showReset ? 'mt-3 pt-1.5 -mb-1.5 border-t border-line-subtle' : 'mt-1'}
        >
          {options.length > MAX_VISIBLE && (
            <Button variant="text" size="small" color="gray" onClick={() => setIsExpanded(prev => !prev)}>
              <ChevronDownIcon className={`w-4 h-4 ${isExpanded ? 'rotate-180' : ''}`} />
              {isExpanded ? '간략히' : '더보기'}
            </Button>
          )}

          {showReset && (
            <Button
              variant="text"
              size="small"
              color="gray"
              className="ml-auto"
              disabled={selectedValues == null || selectedValues.length === 0}
              onClick={() => handleClickReset()}
            >
              초기화
            </Button>
          )}
        </Flex>
      )}
    </div>
  );
}

export default MultiSelectFilter;
