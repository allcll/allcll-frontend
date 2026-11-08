import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet.tsx';
import { Filters, initialFilters } from '@/features/filtering/model/useFilterStore.ts';
import DepartmentSelect from '@/entities/departments/ui/DepartmentSelect.tsx';
import GenericMultiSelectFilter from '@/features/filtering/ui/GenericMultiSelectFilter.tsx';
import GenericSingleSelectFilter from '@/features/filtering/ui/GenericSingleSelectFilter.tsx';
import {
  FilterDomains,
  getCategories,
  getCreditOptions,
  getDayOptions,
  getGradeOptions,
} from '@/features/filtering/lib/filterDomains.ts';
import DayFilter from '@/features/filtering/ui/DayFilter.tsx';
import SelectedFilterChips from '@/features/filtering/ui/SelectedFilterChips.tsx';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { Button, Chip, Flex } from '@allcll/allcll-ui';
import { getAllSelectedLabels } from '@/features/filtering/lib/filterUtils.ts';
import { FilterValueType } from '@/features/filtering/model/types.ts';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam.ts';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onCloseFiltering: () => void;
  filters: Filters;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
  resetFilter: () => void;
  showWishRange?: boolean;
  showSeatRange?: boolean;
}

function FilterBottomSheet({
  isOpen,
  onCloseFiltering,
  filters,
  setFilter,
  resetFilter,
  showWishRange = true,
  showSeatRange = true,
}: FilterBottomSheetProps) {
  const handleClickSave = () => {
    onCloseFiltering();
  };

  const semester = useSemesterParam();

  const { data: subjects } = useSubject(semester);
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
    <BottomSheet title="필터" isOpen={isOpen} onClose={onCloseFiltering}>
      <div className="w-full flex flex-col gap-5">
        <Flex direction="column" justify="center" gap={8} className="w-full">
          <DepartmentSelect showLabel value={filters.department} onChange={code => setFilter('department', code)} />

          {showWishRange && (
            <GenericSingleSelectFilter
              filterKey="wishRange"
              options={FilterDomains.wishRange}
              selectedValue={filters.wishRange ?? null}
              setFilter={setFilter}
              ItemComponent={Chip}
            />
          )}

          {showSeatRange && (
            <GenericSingleSelectFilter
              filterKey="seatRange"
              options={FilterDomains.seatRange}
              selectedValue={filters.seatRange ?? null}
              setFilter={setFilter}
              ItemComponent={Chip}
            />
          )}

          <GenericMultiSelectFilter
            filterKey="credits"
            options={getCreditOptions(subjects ?? [])}
            selectedValues={filters.credits ?? []}
            setFilter={setFilter}
          />

          <GenericMultiSelectFilter
            filterKey="grades"
            options={getGradeOptions(subjects ?? [])}
            selectedValues={filters.grades ?? []}
            setFilter={setFilter}
          />

          <GenericMultiSelectFilter
            filterKey="categories"
            options={categoryOptions}
            selectedValues={(filters.categories as string[]) ?? []}
            setFilter={setFilter}
          />

          <Flex direction="column" gap={2}>
            <DayFilter
              options={getDayOptions(subjects ?? [])}
              days={filters.days ?? []}
              time={filters.time}
              dayTimes={filters.dayTimes}
              setFilter={setFilter}
            />
          </Flex>

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

          <BottomSheet.Footer above={<SelectedFilterChips items={allSelectedFilters} onDelete={handleDeleteFilter} />}>
            <Button
              variant="solid"
              color="gray"
              size="medium"
              onClick={resetFilter}
              disabled={allSelectedFilters.length === 0}
            >
              필터 초기화
            </Button>
            <Button type="submit" variant="solid" size="medium" onClick={handleClickSave}>
              완료
            </Button>
          </BottomSheet.Footer>
        </Flex>
      </div>
    </BottomSheet>
  );
}

export default FilterBottomSheet;
