import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import useMobile from '@/shared/lib/useMobile.ts';
import { useAlarmSearchStore } from '@/shared/model/useFilterStore.ts';
import { useState } from 'react';
import FilteringBottomSheet from '@/widgets/bottomSheet/FilteringBottomSheet.tsx';
import GenericMultiSelectFilter from '@/features/filtering/ui/GenericMultiSelectFilter.tsx';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import GenericSingleSelectFilter from '@/features/filtering/ui/GenericSingleSelectFilter.tsx';
import FilteringButton from '@/features/filtering/ui/button/FilteringButton.tsx';
import AlarmButton from '@/features/filtering/ui/button/AlarmButton.tsx';
import DepartmentSelectFilter from '@/features/filtering/ui/DepartmentFilter.tsx';
import DayFilter from '@/features/filtering/ui/DayFilter.tsx';
import FilterDelete from '@/features/filtering/ui/FilterDelete.tsx';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import FilteringModal from '@/widgets/filtering/ui/FilteringModal.tsx';
import { Chip, Flex, Label } from '@allcll/allcll-ui';

function SubjectSearches() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const setFilters = useAlarmSearchStore(state => state.setFilter);
  const { keywords, alarmOnly, time } = useAlarmSearchStore(state => state.filters);
  const filters = useAlarmSearchStore(state => state.filters);
  const resetFilter = useAlarmSearchStore(state => state.resetFilters);
  const isMobile = useMobile();

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);

  const handleOpenFilter = () => {
    if (isMobile) {
      setIsBottomSheetOpen(true);
    } else {
      setIsFilterModalOpen(true);
    }
  };

  return (
    <Flex direction="flex-wrap" gap="gap-2">
      <Label className="hidden" htmlFor="searchOption">
        검색 옵션
      </Label>

      <SearchBox
        placeholder="과목명, 교수명 또는 학수번호 및 분반 검색"
        value={keywords}
        className="w-full"
        onDelete={() => setFilters('keywords', '')}
        onChange={e => setFilters('keywords', e.target.value)}
      />

      {isFilterModalOpen && (
        <FilteringModal filterStore={useAlarmSearchStore} onClose={() => setIsFilterModalOpen(false)} />
      )}

      {isBottomSheetOpen && (
        <FilteringBottomSheet
          onCloseFiltering={() => setIsBottomSheetOpen(false)}
          filters={filters}
          setFilter={setFilters}
          resetFilter={resetFilter}
        />
      )}

      <Flex align="items-center" direction="flex-wrap" gap="gap-2">
        <Flex direction="flex-wrap" gap="gap-2" className="hidden md:flex">
          <DepartmentSelectFilter selectedValue={filters.department ?? ''} setFilter={setFilters} />
          <DayFilter times={time} setFilter={setFilters} />

          <GenericMultiSelectFilter
            filterKey="credits"
            options={FilterDomains.credits}
            selectedValues={filters.credits ?? []}
            setFilter={setFilters}
          />

          <GenericMultiSelectFilter
            filterKey="grades"
            options={FilterDomains.grades}
            selectedValues={filters.grades ?? []}
            setFilter={setFilters}
          />

          {filters.classroom.length > 0 && (
            <GenericMultiSelectFilter
              filterKey="classroom"
              options={FilterDomains.classRoom}
              selectedValues={filters.classroom ?? []}
              setFilter={setFilters}
              className="min-w-max"
            />
          )}

          <GenericMultiSelectFilter
            filterKey="note"
            options={FilterDomains.remark}
            selectedValues={filters.note ?? []}
            setFilter={setFilters}
          />

          {filters.categories.length > 0 && (
            <GenericMultiSelectFilter
              filterKey="categories"
              options={categoryOptions}
              selectedValues={(filters.categories as string[]) ?? []}
              setFilter={setFilters}
              className="min-w-max"
            />
          )}

          <GenericSingleSelectFilter
            filterKey="wishRange"
            options={FilterDomains.wishRange}
            selectedValue={filters.wishRange ?? null}
            setFilter={setFilters}
            ItemComponent={Chip}
          />

          <GenericSingleSelectFilter
            filterKey="seatRange"
            options={FilterDomains.seatRange}
            selectedValue={filters.seatRange ?? null}
            setFilter={setFilters}
            ItemComponent={Chip}
          />
        </Flex>

        <FilterDelete filters={filters} resetFilter={resetFilter} />
        <FilteringButton handleOpenFilter={handleOpenFilter} />
        <AlarmButton alarmOnly={alarmOnly} setFilter={setFilters} />
      </Flex>
    </Flex>
  );
}

export default SubjectSearches;
