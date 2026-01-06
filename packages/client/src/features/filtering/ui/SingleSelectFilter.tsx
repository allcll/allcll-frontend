import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/shared/model/useFilterStore.ts';
import { getLabelFormatter, labelPrefix } from '@/features/filtering/lib/getFilteringFormatter.ts';
import { FilterItemProps, RangeMinMaxFilter } from '@/shared/model/types.ts';
import MinMaxFilter from './MinMaxFilter.tsx';
import { Button, Flex, Grid, Label } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

interface ISingleSelectFilter<K extends keyof Filters> {
  selectedValue: FilterValueType<K> | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K> | null) => void;
  options: FilterValueType<K>[];
  ItemComponent: React.ComponentType<FilterItemProps>;
  isMinMax?: boolean;
}

function SingleSelectFilterOption<K extends keyof Filters>({
  selectedValue,
  filterKey,
  setFilter,
  options,
  ItemComponent,
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
      <Grid columns={{ md: 3 }} gap="gap-2">
        {options.map(option => (
          <ItemComponent
            key={String(option)}
            label={labelFormatters[filterKey]?.(option) ?? String(option)}
            selected={selectedValue === option}
            onClick={() => handleChangeCheckbox(option)}
          />
        ))}
      </Grid>

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
