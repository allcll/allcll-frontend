import SearchBox from '@/components/common/SearchBox';
import FilteringModal from '@/components/wishTable/FilteringModal';
import useMobile from '@/hooks/useMobile';
import { isFilterEmpty, useAlarmSearchStore } from '@/store/useFilterStore';
import { ChangeEvent, useState } from 'react';
import DepartmentFilter from '../DepartmentFilter';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import DepartmentSelectFilter from '@/components/contentPanel/filter/DepartmentFilter';
import { MultiPreSeatFilterConfig } from '@/components/contentPanel/filter/config/preSeat';
import GenericMultiSelectFilter from '@/components/contentPanel/filter/common/GenericMultiSelectFilter';
import DayFilter from '@/components/contentPanel/filter/DayFilter';
import WishFilter from '@/components/contentPanel/filter/WishFilter';
import SeatFilter from '@/components/contentPanel/filter/SeatFilter';
import FilterDelete from '@/components/contentPanel/filter/FilterDelete';
import FilterSvg from '@/assets/filter.svg?react';
import AlarmIcon from '@/components/svgs/AlarmIcon';

function SubjectSearches() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const setFilter = useAlarmSearchStore(state => state.setFilter);
  const { department, keywords, alarmOnly, time, wishRange, seatRange } = useAlarmSearchStore(state => state.filters);
  const filters = useAlarmSearchStore(state => state.filters);
  const resetFilter = useAlarmSearchStore(state => state.resetFilters);
  const isMobile = useMobile();

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter('department', event.target.value);
  };

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
        onDelete={() => setFilter('keywords', '')}
        onChange={e => setFilter('keywords', e.target.value)}
      />

      {isFilterModalOpen && (
        <FilteringModal filterStore={useAlarmSearchStore} onClose={() => setIsFilterModalOpen(false)} />
      )}

      <div className="flex items-center flex-wrap mt-2 gap-2">
        {isMobile ? (
          <>
            <DepartmentFilter
              value={department}
              style={{ maxWidth: 'calc(100vw - 64px)' }}
              onChange={handleDepartmentChange}
            />
            {isBottomSheetOpen && (
              <FilteringBottomSheet
                onCloseFiltering={() => setIsBottomSheetOpen(false)}
                filters={filters}
                setFilter={setFilter}
                resetFilter={resetFilter}
                multiFilterConfig={MultiPreSeatFilterConfig}
              />
            )}
          </>
        ) : (
          <>
            <DepartmentSelectFilter department={department} setFilter={setFilter} />
            {MultiPreSeatFilterConfig.map(filter => {
              const value = filters?.[filter.filterKey];
              if (isFilterEmpty(filter.filterKey, value) && !filter.default) return null;
              return (
                <GenericMultiSelectFilter
                  key={filter.filterKey}
                  filterKey={filter.filterKey}
                  options={filter.options}
                  labelPrefix={filter.labelPrefix}
                  ItemComponent={filter.ItemComponent}
                  selectedValues={
                    Array.isArray(filters[filter.filterKey]) ? (filters[filter.filterKey] as (string | number)[]) : null
                  }
                  setFilter={setFilter}
                  className="min-w-max"
                />
              );
            })}

            <DayFilter times={time} setFilter={setFilter} />
            <WishFilter wishRange={wishRange} setFilter={setFilter} />
            <SeatFilter seatRange={seatRange} setFilter={setFilter} />
          </>
        )}

        <FilterDelete filters={filters} resetFilter={resetFilter} />

        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          aria-label="필터 수정"
          title="필터 수정"
          onClick={handleOpenFilter}
        >
          <FilterSvg className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>

        <button
          className="px-4 py-2 rounded-md flex gap-2 items-center text-nowrap border border-gray-400 hover:bg-white cursor-pointer"
          onClick={() => setFilter('alarmOnly', !alarmOnly)}
        >
          <AlarmIcon disabled={!alarmOnly} />
          알림과목
        </button>
      </div>
    </div>
  );
}

export default SubjectSearches;
