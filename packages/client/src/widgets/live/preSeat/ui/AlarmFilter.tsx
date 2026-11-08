import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import { useAlarmSearchStore } from '@/features/filtering/model/useFilterStore.ts';
import { useState } from 'react';
import GenericMultiSelectFilter from '@/features/filtering/ui/GenericMultiSelectFilter.tsx';
import {
  FilterDomains,
  getCategories,
  getCreditOptions,
  getDayOptions,
  getGradeOptions,
} from '@/features/filtering/lib/filterDomains.ts';
import GenericSingleSelectFilter from '@/features/filtering/ui/GenericSingleSelectFilter.tsx';
import FilteringButton from '@/features/filtering/ui/button/FilteringButton.tsx';
import AlarmButton from '@/features/filtering/ui/button/AlarmButton.tsx';
import DepartmentFilter from '@/features/filtering/ui/DepartmentFilter';
import DayFilter from '@/features/filtering/ui/DayFilter.tsx';
import FilterDelete from '@/features/filtering/ui/FilterDelete.tsx';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import { Chip, Flex, Label } from '@allcll/allcll-ui';
import FilterOverlay from '@/widgets/filtering/ui/FilterOverlay.tsx';

function AlarmFilter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const setFilters = useAlarmSearchStore(state => state.setFilter);
  const { keywords, alarmOnly } = useAlarmSearchStore(state => state.filters);
  const filters = useAlarmSearchStore(state => state.filters);
  const resetFilter = useAlarmSearchStore(state => state.resetFilters);

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);

  return (
    <Flex wrap gap={2}>
      <Label className="sr-only" htmlFor="searchOption">
        검색 옵션
      </Label>

      <SearchBox
        placeholder="과목명, 교수명, 학수번호 검색"
        value={keywords}
        className="w-full"
        onDelete={() => setFilters('keywords', '')}
        onChange={e => setFilters('keywords', e.target.value)}
      />

      <FilterOverlay
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterStore={useAlarmSearchStore}
        showWishRange={false}
      />

      <Flex align="center" wrap gap={2}>
        <Flex wrap gap={2} className="hidden md:flex">
          <DepartmentFilter selectedValue={filters.department ?? ''} setFilter={setFilters} />
          <DayFilter
            options={getDayOptions(subjects ?? [])}
            days={filters.days ?? []}
            time={filters.time}
            dayTimes={filters.dayTimes}
            setFilter={setFilters}
          />

          <GenericMultiSelectFilter
            filterKey="credits"
            options={getCreditOptions(subjects ?? [])}
            selectedValues={filters.credits ?? []}
            setFilter={setFilters}
          />

          <GenericMultiSelectFilter
            filterKey="grades"
            options={getGradeOptions(subjects ?? [])}
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
            filterKey="seatRange"
            options={FilterDomains.seatRange}
            selectedValue={filters.seatRange ?? null}
            setFilter={setFilters}
            ItemComponent={Chip}
          />
        </Flex>

        <AlarmButton alarmOnly={alarmOnly} setFilter={setFilters} />
        <FilteringButton handleOpenFilter={() => setIsFilterOpen(true)} />
        <FilterDelete filters={filters} resetFilter={resetFilter} />
      </Flex>
    </Flex>
  );
}

export default AlarmFilter;
