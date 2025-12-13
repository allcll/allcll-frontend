import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/store/useFilterStore';
import { getLabelFormatter, labelPrefix } from '@/utils/filtering/getFilteringFormatter';
import { FilterItemProps, RangeMinMaxFilter } from '@/utils/types';
import MinMaxFilter from './MinMaxFilter';
import { Button, Flex, Label } from '@allcll/allcll-ui';
import useMobile from '@/hooks/useMobile';

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

interface ISingleSelectFilter<K extends keyof Filters> {
  selectedValue: FilterValueType<K> | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K> | null) => void;
  options: FilterValueType<K>[];
  className?: string;
  ItemComponent: React.ComponentType<FilterItemProps>;
  isMinMax?: boolean;
}

function SingleSelectFilterOption<K extends keyof Filters>({
  selectedValue,
  filterKey,
  setFilter,
  options,
  ItemComponent,
  className,
  isMinMax = false,
}: Readonly<ISingleSelectFilter<K>>) {
  const isMobile = useMobile();

  const handleChangeCheckbox = (optionValue: FilterValueType<K>) => {
    const checked = selectedValue === optionValue;
    const newValue = checked ? null : optionValue;

    setFilter(filterKey, newValue);
  };

  const handleClickReset = () => {
    setFilter(filterKey, null);
  };

  const labelFormatters = getLabelFormatter();

  return (
    <div className="relative inline-block">
      <Label>{labelPrefix[filterKey]}</Label>
      <Flex direction="flex-wrap" gap="gap-2" className={className ?? 'mt-1'}>
        {options.map(option => (
          <ItemComponent
            key={String(option)}
            label={labelFormatters[filterKey]?.(option) ?? String(option)}
            selected={selectedValue === option}
            onClick={() => handleChangeCheckbox(option)}
          />
        ))}
      </Flex>
      {isMinMax && (
        <div className="mt-2">
          <MinMaxFilter
            selectedValue={selectedValue as RangeMinMaxFilter | null}
            filterKey={filterKey}
            setFilter={(filterKey, value) => setFilter(filterKey, value as FilterValueType<K> | null)}
            options={options}
          />
        </div>
      )}

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

export default SingleSelectFilterOption;
