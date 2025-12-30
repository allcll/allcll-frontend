import { Filters } from '@/shared/model/useFilterStore.ts';
import { FilterValueType, RangeMinMaxFilter } from '@/shared/model/types.ts';
import { Flex, Input, Label } from '@allcll/allcll-ui';
import { useState } from 'react';

interface IMinMaxFilter<K extends keyof Filters> {
  selectedValue: RangeMinMaxFilter | null;
  filterKey: K;
  setFilter: (field: K, value: RangeMinMaxFilter | null) => void;
  options: FilterValueType<K>[];
  className?: string;
}

function MinMaxFilter<K extends keyof Filters>({ selectedValue, filterKey, setFilter }: Readonly<IMinMaxFilter<K>>) {
  const [input, setInput] = useState<RangeMinMaxFilter>({ min: selectedValue?.min ?? 0, max: selectedValue?.max ?? 0 });

  const handleChangeInput = (range: 'min' | 'max', optionValue: string) => {
    const updated: RangeMinMaxFilter = { ...input, [range]: optionValue };
    setInput(updated);

    setFilter(filterKey, updated);
  };

  return (
    <div className="relative inline-block w-full space-y-2">
      <Label>범위 설정</Label>

      <Flex gap="gap-2">
        <Input
          type="text"
          placeholder="이상"
          value={input.min}
          onChange={e => {
            const onlyDigits = e.target.value.replace(/[^\d]/g, '');
            handleChangeInput('min', onlyDigits);
          }}
          className="w-full"
        />

        <span className="flex items-center text-gray-400">~</span>

        <Input
          type="text"
          placeholder="이하"
          value={input.max}
          onChange={e => {
            const onlyDigits = e.target.value.replace(/[^\d]/g, '');
            handleChangeInput('max', onlyDigits);
          }}
          className="w-full"
        />
      </Flex>
    </div>
  );
}

export default MinMaxFilter;
