import SearchBox from '@/components/common/SearchBox';
import useMobile from '@/hooks/useMobile';
import { useAlarmSearchStore } from '@/store/useFilterStore';
import { useState } from 'react';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import GenericMultiSelectFilter from '@/components/filtering/GenericMultiSelectFilter';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains';
import GenericSingleSelectFilter from '@/components/filtering/GenericSingleSelectFilter';
import Chip from '@common/components/chip/Chip';
import FilteringButton from '@/components/filtering/button/FilteringButton';
import AlarmButton from '@/components/filtering/button/AlarmButton';
import DepartmentSelectFilter from '@/components/filtering/DepartmentFilter';
import DayFilter from '@/components/filtering/DayFilter';
import FilterDelete from '@/components/filtering/FilterDelete';
import FilteringModal from '@/components/wishTable/FilteringModal';
import useSubject from '@/hooks/server/useSubject';

function SubjectSearches() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const setFilters = useAlarmSearchStore(state => state.setFilter);
  const { department, keywords, alarmOnly, time } = useAlarmSearchStore(state => state.filters);
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
    <div className="flex flex-wrap gap-2 mt-4 text-sm lg:flex-wrap lg:flex-row lg:items-center lg:gap-y-0 lg:gap-x-2">
      <label className="hidden" htmlFor="searchOption">
        검색 옵션
      </label>

      <SearchBox
        type="text"
        placeholder="과목명, 교수명 또는 학수번호 및 분반 검색"
        value={keywords}
        className="pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-400 text-[16px] placeholder:text-sm"
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

      <div className="flex items-center flex-wrap mt-2 gap-2">
        <DepartmentSelectFilter department={department} setFilter={setFilters} />
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

        <FilterDelete filters={filters} resetFilter={resetFilter} />
        <FilteringButton handleOpenFilter={handleOpenFilter} />
        <AlarmButton alarmOnly={alarmOnly} setFilter={setFilters} />
      </div>
    </div>
  );
}

export default SubjectSearches;
