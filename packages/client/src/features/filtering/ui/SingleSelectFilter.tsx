import { Button, Flex, Grid, Label, useIsInPopoverContent } from '@allcll/allcll-ui';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { getLabelFormatter, labelPrefix } from '@/features/filtering/lib/getFilteringFormatter.ts';
import MinMaxFilter from './MinMaxFilter.tsx';
import useMobile from '@/shared/lib/useMobile.ts';
import { FilterItemProps, RangeMinMaxFilter } from '@/features/filtering/model/types.ts';

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
  const footerClass = useIsInPopoverContent() ? 'mt-2 pt-2 border-t border-gray-100' : '';

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
      <Flex direction="flex-col" gap="gap-2">
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
      </Flex>

      {!isMobile && (
        <Flex justify="justify-end" className={footerClass}>
          <Button
            variant="text"
            size="small"
            color="gray"
            disabled={selectedValue == null}
            onClick={() => handleClickReset()}
          >
            초기화
          </Button>
        </Flex>
      )}
    </div>
  );
}

export default SingleSelectFilterOption;
