import { Filters } from '@/store/useFilterStore';
import { FilterValueType, RangeMinMaxFilter } from '@/utils/types';
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
      <label className=" text-gray-600">범위 설정</label>
      <div className="flex gap-2 sm:gap-4 pt-2">
        <input
          type="text"
          value={input.min}
          onChange={e => {
            const onlyDigits = e.target.value.replace(/[^\d]/g, '');
            handleChangeInput('min', onlyDigits);
          }}
          placeholder="이상"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <span className="flex items-center text-gray-400">~</span>
        <input
          type="text"
          value={input.max}
          onChange={e => {
            const onlyDigits = e.target.value.replace(/[^\d]/g, '');
            handleChangeInput('max', onlyDigits);
          }}
          placeholder="이하"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
    </div>
  );
}

export default MinMaxFilter;
