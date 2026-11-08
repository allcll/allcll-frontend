import { Button, Flex, Grid, Label } from '@allcll/allcll-ui';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { getLabelFormatter, labelPrefix } from '@/features/filtering/lib/getFilteringFormatter.ts';
import MinMaxFilter from './MinMaxFilter.tsx';
import { FilterItemProps, RangeMinMaxFilter } from '@/features/filtering/model/types.ts';

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

interface ISingleSelectFilter<K extends keyof Filters> {
  selectedValue: FilterValueType<K> | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K> | null) => void;
  options: FilterValueType<K>[];
  ItemComponent: React.ComponentType<FilterItemProps>;
  showReset?: boolean;
}

function SingleSelectFilterOption<K extends keyof Filters>({
  selectedValue,
  filterKey,
  setFilter,
  options,
  ItemComponent,
  showReset = true,
}: Readonly<ISingleSelectFilter<K>>) {
  const handleChangeCheckbox = (optionValue: FilterValueType<K>) => {
    const checked = isSameOption(selectedValue, optionValue);
    const newValue = checked ? null : optionValue;

    setFilter(filterKey, newValue);
  };

  const handleClickReset = () => {
    setFilter(filterKey, null);
  };

  const labelFormatters = getLabelFormatter();

  return (
    <div className="relative w-full">
      <Flex direction="column" gap={2}>
        <Label>{labelPrefix[filterKey]}</Label>
        <Grid columns={{ md: 3 }} gap="gap-2">
          {options.map(option => {
            const label = labelFormatters[filterKey]?.(option) ?? String(option);
            return (
              <ItemComponent
                key={label}
                label={label}
                selected={isSameOption(selectedValue, option)}
                onClick={() => handleChangeCheckbox(option)}
              />
            );
          })}
        </Grid>

        {(filterKey === 'wishRange' || filterKey === 'seatRange') && (
          <div className="mt-2">
            <MinMaxFilter
              selectedValue={selectedValue as RangeMinMaxFilter | null}
              filterKey={filterKey}
              setFilter={(filterKey, value) => setFilter(filterKey, value as FilterValueType<K> | null)}
            />
          </div>
        )}
      </Flex>

      {showReset && (
        <Flex justify="end" className="mt-3 pt-1.5 -mb-1.5 border-t border-gray-100">
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

// 범위 필터는 슬라이더가 새 객체를 만들기 때문에 같은 값인지로 비교
function isSameOption(a: unknown, b: unknown) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;

  const rangeA = a as RangeMinMaxFilter;
  const rangeB = b as RangeMinMaxFilter;
  return rangeA.min === rangeB.min && rangeA.max === rangeB.max;
}

export default SingleSelectFilterOption;
