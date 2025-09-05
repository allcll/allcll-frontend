import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import { Filters, getAllSelectedLabels, initialFilters } from '@/store/useFilterStore.ts';
import CustomButton from '@common/components/Button';
import DepartmentFilter from '@/components/live/DepartmentFilter.tsx';
import GenericMultiSelectFilter from '@/components/filtering/GenericMultiSelectFilter';
import GenericSingleSelectFilter from '@/components/filtering/GenericSingleSelectFilter';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains';
import Chip from '@common/components/chip/Chip';
import DayFilter from '@/components/filtering/DayFilter';
import { FilterValueType } from '@/utils/types';
import useSubject from '@/hooks/server/useSubject';
import useDepartments from '@/hooks/server/useDepartments';

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

  const { data: subjects } = useSubject();
  const departments = useDepartments();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);
  const allSelectedFilters = getAllSelectedLabels(filters, departments.data);

  const handleDeleteFilter = (filterKey: keyof Filters, value: FilterValueType<keyof Filters>) => {
    const currentValue = filters[filterKey];

    if (Array.isArray(currentValue)) {
      setFilter(filterKey, currentValue.filter(item => item !== value) as Filters[keyof Filters]);
    } else {
      setFilter(filterKey, initialFilters[filterKey]);
    }
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
        <div className="flex flex-wrap gap-2">
          {allSelectedFilters.map(filter => {
            return (
              <Chip
                key={`${filter.filterKey}-${filter.values}`}
                chipType="cancel"
                label={filter.label}
                selected={true}
                onClick={() => handleDeleteFilter(filter.filterKey, filter.values)}
              />
            );
          })}
        </div>

        <div className="w-full h-15 flex gap-2 flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">학과</label>
          <DepartmentFilter
            className="cursor-pointer border-gray-100 rounded-sm py-1 text-sm"
            value={filters.department}
            onChange={e => setFilter('department', e.target.value)}
          />
        </div>

        <GenericSingleSelectFilter
          filterKey="wishRange"
          options={FilterDomains.wishRange}
          selectedValue={filters.wishRange ?? null}
          setFilter={setFilter}
          ItemComponent={Chip}
        />

        <GenericSingleSelectFilter
          filterKey="seatRange"
          options={FilterDomains.seatRange}
          selectedValue={filters.seatRange ?? null}
          setFilter={setFilter}
          ItemComponent={Chip}
        />

        <div className="w-full h-15 flex gap-2 flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">시간</label>
          <DayFilter times={filters.time} setFilter={setFilter} />
        </div>

        <GenericMultiSelectFilter
          filterKey="credits"
          options={FilterDomains.credits}
          selectedValues={filters.credits ?? []}
          setFilter={setFilter}
        />

        <GenericMultiSelectFilter
          filterKey="grades"
          options={FilterDomains.grades}
          selectedValues={filters.grades ?? []}
          setFilter={setFilter}
        />

        <GenericMultiSelectFilter
          filterKey="classroom"
          options={FilterDomains.classRoom}
          selectedValues={filters.classroom ?? []}
          setFilter={setFilter}
        />

        <GenericMultiSelectFilter
          filterKey="note"
          options={FilterDomains.remark}
          selectedValues={filters.note ?? []}
          setFilter={setFilter}
        />

        <GenericMultiSelectFilter
          filterKey="categories"
          options={categoryOptions}
          selectedValues={(filters.categories as string[]) ?? []}
          setFilter={setFilter}
        />

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
