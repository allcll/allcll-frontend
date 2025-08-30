import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import { Filters } from '@/store/useFilterStore.ts';
import ScheduleFilterConfing from '../filter/config/schedule';
import GenericMultiSelectFilter from '../filter/common/GenericMultiSelectFilter';
import CustomButton from '@common/components/Button';
import DepartmentFilter from '@/components/live/DepartmentFilter.tsx';

interface FilteringBottomSheetProps {
  onCloseFiltering: () => void;
  filters: Filters;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
  resetFilter: () => void;
}

function FilteringBottomSheet({ onCloseFiltering, filters, setFilter, resetFilter }: FilteringBottomSheetProps) {
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

      <section className="w-full flex flex-col px-4 gap-5 max-h-[85vh] overflow-y-scroll">
        <div className="w-full h-15 flex gap-2 flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">학과</label>

          <DepartmentFilter
            className="cursor-pointer border-gray-100 rounded-sm py-1 text-sm"
            value={filters.department}
            onChange={e => setFilter('department', e.target.value)}
          />
        </div>

        {ScheduleFilterConfing.map(filter => {
          return (
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
          );
        })}

        <div className="sticky bottom-0 bg-white flex justify-end items-center pt-2 gap-2 border-t border-gray-200">
          <CustomButton
            className="text-xs text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
            onClick={resetFilter}
          >
            필터 초기화
          </CustomButton>
          <button
            onClick={handleClickSave}
            type="submit"
            className="bg-blue-500 font-semibold text-xs w-15 text-white rounded px-4 py-2 cursor-pointer "
          >
            저장
          </button>
        </div>
      </section>
    </BottomSheet>
  );
}

export default FilteringBottomSheet;
