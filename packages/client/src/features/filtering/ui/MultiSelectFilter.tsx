import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/store/useFilterStore.ts';
import { getLabelFormatter, labelPrefix } from '@/utils/filtering/getFilteringFormatter.ts';
import { FilterItemProps, FilterValueType } from '@/utils/types.ts';
import { Button, Flex, Label } from '../../../../../allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';

interface IMultiSelectFilter<K extends keyof Filters> {
  selectedValues: FilterValueType<K>[] | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K>[] | null) => void;
  options: FilterValueType<K>[];
  className?: string;
  ItemComponent: React.ComponentType<FilterItemProps>;
}

function MultiSelectFilter<K extends keyof Filters>({
  selectedValues,
  filterKey,
  setFilter,
  options,
  ItemComponent,
  className,
}: Readonly<IMultiSelectFilter<K>>) {
  const labelFormatters = getLabelFormatter();
  const isMobile = useMobile();

  const handleChangeCheckbox = (optionValue: FilterValueType<K>) => {
    console.log('optionValue', optionValue);
    const checked = selectedValues?.includes(optionValue);
    const newValues = checked
      ? selectedValues?.filter(selected => selected !== optionValue)
      : [...(selectedValues ?? []), optionValue];

    setFilter(filterKey, newValues ?? null);
  };

  const handleClickReset = () => {
    setFilter(filterKey, null);
  };

  return (
    <div className="relative inline-block ">
      <Label>{labelPrefix[filterKey]}</Label>
      <Flex direction="flex-wrap" gap="gap-2" className={className ?? 'mt-1'}>
        {options.map(option => (
          <ItemComponent
            key={String(option)}
            label={labelFormatters[filterKey]?.(option) ?? String(option)}
            selected={selectedValues?.includes(option) ?? false}
            onClick={() => handleChangeCheckbox(option)}
          />
        ))}
      </Flex>

      {!isMobile && (
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
