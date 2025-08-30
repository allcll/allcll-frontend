import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import { Filters } from '@/store/useFilterStore.ts';
import GenericMultiSelectFilter from '../filter/common/GenericMultiSelectFilter';
import CustomButton from '@common/components/Button';
import DepartmentFilter from '@/components/live/DepartmentFilter.tsx';
import { FilterConfiguration } from '@/utils/types';
import SeatFilter from '../filter/SeatFilter';
import WishFilter from '../filter/WishFilter';

interface FilteringBottomSheetProps {
  onCloseFiltering: () => void;
  filters: Filters;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
  resetFilter: () => void;
  multiFilterConfig: FilterConfiguration<string | number>[];
}

function FilteringBottomSheet({
  onCloseFiltering,
  filters,
  setFilter,
  resetFilter,
  multiFilterConfig,
}: FilteringBottomSheetProps) {
  const handleClickSave = () => {
    onCloseFiltering();
  };

  return (
    <BottomSheet>
      <BottomSheetHeader
        headerType="close"
        title="필터링"
        onClose={() => {
          onCloseFiltering();
        }}
      />

      <div className="w-full flex px-4 flex-col h-[85vh] gap-5 overflow-y-auto overscroll-contain">
        <div className="w-full h-15 flex gap-2 flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">학과</label>
          <DepartmentFilter
            className="cursor-pointer border-gray-100 rounded-sm py-1 text-sm"
            value={filters.department}
            onChange={e => setFilter('department', e.target.value)}
          />
        </div>

        <SeatFilter seatRange={filters.seatRange} setFilter={setFilter} />
        <WishFilter wishRange={filters.wishRange} setFilter={setFilter} />

        {multiFilterConfig.map(filter => (
          <GenericMultiSelectFilter
            key={filter.filterKey}
            filterKey={filter.filterKey}
            options={filter.options}
            labelPrefix={filter.labelPrefix ?? ''}
            ItemComponent={filter.ItemComponent}
            selectedValues={
              Array.isArray(filters[filter.filterKey]) ? (filters[filter.filterKey] as (string | number)[]) : null
            }
            setFilter={setFilter}
            className="min-w-max"
          />
        ))}

        <div className="sticky bottom-0 pb-14 pt-5 bg-white flex justify-end items-center gap-2 border-gray-200">
          <CustomButton
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
            onClick={resetFilter}
          >
            필터 초기화
          </CustomButton>
          <CustomButton onClick={handleClickSave} type="submit" variants="primary">
            저장
          </CustomButton>
        </div>
      </div>
    </BottomSheet>
  );
}

export default FilteringBottomSheet;
