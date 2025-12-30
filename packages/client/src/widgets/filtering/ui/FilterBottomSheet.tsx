import BottomSheet from '../../../shared/ui/bottomsheet/BottomSheet.tsx';
import BottomSheetHeader from '../../../shared/ui/bottomsheet/BottomSheetHeader.tsx';
import { Filters, getAllSelectedLabels, initialFilters } from '@/shared/model/useFilterStore.ts';
import DepartmentFilter from '@/widgets/filtering/ui/DepartmentFilter.tsx';
import GenericMultiSelectFilter from '@/features/filtering/ui/GenericMultiSelectFilter.tsx';
import GenericSingleSelectFilter from '@/features/filtering/ui/GenericSingleSelectFilter.tsx';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import Chip from '@common/components/chip/Chip.tsx';
import DayFilter from '@/features/filtering/ui/DayFilter.tsx';
import { FilterValueType } from '@/utils/types.ts';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { Button, Flex } from '@allcll/allcll-ui';

interface FilteringBottomSheetProps {
  onCloseFiltering: () => void;
  filters: Filters;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
  resetFilter: () => void;
}

function FilterBottomSheet({ onCloseFiltering, filters, setFilter, resetFilter }: FilteringBottomSheetProps) {
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
        <Flex direction="flex-wrap" gap="gap-2">
          {allSelectedFilters.map(filter => (
            <Chip
              key={`${filter.filterKey}-${filter.values}`}
              chipType="cancel"
              label={filter.label}
              selected={true}
              onClick={() => handleDeleteFilter(filter.filterKey, filter.values)}
            />
          ))}
        </Flex>

        <Flex direction="flex-col" justify="justify-center" gap="gap-8" className="w-full">
          <DepartmentFilter
            className="cursor-pointer border-gray-100 rounded-sm py-1 text-sm"
            value={filters.department}
            onChange={e => setFilter('department', e.target.value)}
          />

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

          <Flex direction="flex-col" gap="gap-2">
            <DayFilter times={filters.time} setFilter={setFilter} />
          </Flex>

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

          <div className="sticky bottom-0 py-3 bg-white flex justify-end items-center gap-2 border-gray-200">
            <Button variant="outlined" size="medium" onClick={resetFilter}>
              필터 초기화
            </Button>
            <Button type="submit" variant="primary" size="medium" onClick={handleClickSave}>
              저장
            </Button>
          </div>
        </Flex>
      </div>
    </BottomSheet>
  );
}

export default FilterBottomSheet;
