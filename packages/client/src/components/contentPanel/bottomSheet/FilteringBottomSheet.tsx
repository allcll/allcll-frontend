import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import useDepartments from '@/hooks/server/useDepartments';
import { Filters } from '@/store/useFilterStore.ts';
import ScheduleFilterConfing from '../filter/config/schedule';
import GenericMultiSelectFilter from '../filter/common/GenericMultiSelectFilter';

interface FilteringBottomSheetProps {
  onCloseFiltering: () => void;
  filters: Filters;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
  resetFilter: () => void;
}

function FilteringBottomSheet({ onCloseFiltering, filters, setFilter, resetFilter }: FilteringBottomSheetProps) {
  const { data: departments } = useDepartments();

  const isFiltered =
    (filters.department.length ||
      filters.grades.length ||
      filters.time.length ||
      filters.credits.length ||
      filters.categories.length) > 0;

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

      <section className="w-full flex flex-col px-4 gap-5 max-h-[85vh]  overflow-y-scroll">
        {/* TODO: Department 공통 필터 만들기 */}
        <div className="w-full  h-15 flex gap-2 flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">학과</label>
          <div className="w-full flex flex-col gap-2 justify-center">
            <select
              className="cursor-pointer border border-gray-300 rounded-sm px-2 py-1 w-full bg-white text-sm"
              value={filters.department}
              onChange={e => setFilter('department', e.target.value)}
            >
              <option value="">전체</option>
              {departments?.map(department => (
                <option key={department.departmentCode} value={department.departmentCode}>
                  {department.departmentName}
                </option>
              ))}
            </select>
          </div>
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

        <div className="flex justify-end items-center gap-3 mt-5">
          {isFiltered && (
            <button
              className="text-xs text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
              onClick={resetFilter}
            >
              필터 초기화
            </button>
          )}

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
