import { useState } from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import SearchBox from '@/components/common/SearchBox.tsx';
import Modal from '@common/components/modal/Modal.tsx';
import ModalHeader from '../sejongUI/modal/ModalHeader.tsx';
import DraggableList from '@/components/live/subjectTable/DraggableList.tsx';
import { Filters, getAllSelectedLabels, initialFilters, useWishSearchStore } from '@/store/useFilterStore.ts';
import { HeadTitle, useWishesTableStore } from '@/store/useTableColumnStore.ts';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import useBackSignal from '@/hooks/useBackSignal.ts';
import { FilterValueType, Wishes } from '@/utils/types.ts';
import ListSvg from '@/assets/list.svg?react';
import useMobile from '@/hooks/useMobile';
import FilteringBottomSheet from '../contentPanel/bottomSheet/FilteringBottomSheet';
import GenericMultiSelectFilter from '../filtering/GenericMultiSelectFilter';
import GenericSingleSelectFilter from '../filtering/GenericSingleSelectFilter';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains';
import Chip from '@common/components/chip/Chip';
import FilteringButton from '../filtering/button/FilteringButton';
import DepartmentSelectFilter from '../filtering/DepartmentFilter';
import FilterDelete from '../filtering/FilterDelete';
import useSubject from '@/hooks/server/useSubject';
import FilteringModal from '../filtering/FilteringModal';

export interface WishSearchParams {
  searchInput: string;
  selectedDepartment: string;
  isFavorite: boolean;
}

function Searches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filters = useWishSearchStore(state => state.filters);
  const setFilter = useWishSearchStore(state => state.setFilter);
  const resetFilter = useWishSearchStore(state => state.resetFilters);

  const { keywords, department, favoriteOnly } = filters;

  const tableTitles = useWishesTableStore(state => state.tableTitles);
  const setTableTitles = useWishesTableStore(state => state.setTableTitles);
  const isMobile = useMobile();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);
  const allSelectedFilters = getAllSelectedLabels(filters);

  const setToggleFavorite = () => setFilter('favoriteOnly', !favoriteOnly);

  const handleOpenFilter = () => {
    if (isMobile) {
      setIsBottomSheetOpen(true);
    } else {
      setIsFilterModalOpen(true);
    }
  };

  const handleDeleteFilter = (filterKey: keyof Filters, value: FilterValueType<keyof Filters>) => {
    const currentValue = filters[filterKey];

    if (Array.isArray(currentValue)) {
      setFilter(
        filterKey,
        (currentValue as (typeof value)[]).filter(item => item !== value),
      );
    } else {
      setFilter(filterKey, initialFilters[filterKey]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 lg:flex-wrap lg:flex-row lg:items-center lg:gap-y-0 lg:gap-x-2">
      {isModalOpen && (
        <LiveTableTitleModal
          initialItems={tableTitles}
          onChange={setTableTitles}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isFilterModalOpen && (
        <FilteringModal filterStore={useWishSearchStore} onClose={() => setIsFilterModalOpen(false)} />
      )}

      {isBottomSheetOpen && (
        <FilteringBottomSheet
          onCloseFiltering={() => setIsBottomSheetOpen(false)}
          filters={filters}
          setFilter={setFilter}
          resetFilter={resetFilter}
        />
      )}

      <SearchBox
        type="text"
        className="pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-400 text-[16px] placeholder:text-sm"
        placeholder="과목명, 교수명 또는 학수번호 및 분반 검색"
        value={keywords}
        onDelete={() => setFilter('keywords', '')}
        onChange={event => setFilter('keywords', event.target.value)}
      />

      <div className="flex items-center flex-wrap mt-2 gap-2">
        <div className="hidden md:flex flex-wrap gap-2">
          <DepartmentSelectFilter department={department} setFilter={setFilter} />

          <GenericSingleSelectFilter
            filterKey="wishRange"
            options={FilterDomains.wishRange}
            selectedValue={filters.wishRange ?? null}
            setFilter={setFilter}
            ItemComponent={Chip}
            isMinMax={true}
          />

          <GenericSingleSelectFilter
            filterKey="seatRange"
            options={FilterDomains.seatRange}
            selectedValue={filters.seatRange ?? null}
            setFilter={setFilter}
            ItemComponent={Chip}
            isMinMax={true}
          />

          <GenericMultiSelectFilter
            filterKey="days"
            options={FilterDomains.days}
            selectedValues={filters.days ?? []}
            setFilter={setFilter}
          />

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

          {filters.classroom.length > 0 && (
            <GenericMultiSelectFilter
              filterKey="classroom"
              options={FilterDomains.classRoom}
              selectedValues={filters.classroom ?? []}
              setFilter={setFilter}
              className="min-w-max"
            />
          )}

          {filters.note.length > 0 && (
            <GenericMultiSelectFilter
              filterKey="note"
              options={FilterDomains.remark}
              selectedValues={filters.note ?? []}
              setFilter={setFilter}
            />
          )}

          {filters.categories.length > 0 && (
            <GenericMultiSelectFilter
              filterKey="categories"
              options={categoryOptions}
              selectedValues={(filters.categories as string[]) ?? []}
              setFilter={setFilter}
              className="min-w-max"
            />
          )}
        </div>
        <FilterDelete filters={filters} resetFilter={resetFilter} />
        <FilteringButton handleOpenFilter={handleOpenFilter} />

        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          onClick={setToggleFavorite}
          aria-label={favoriteOnly ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
          title={favoriteOnly ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
        >
          <StarIcon disabled={!favoriteOnly} />
        </button>

        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          aria-label="테이블 수정"
          title="테이블 수정"
          onClick={() => setIsModalOpen(true)}
        >
          <ListSvg className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>

        <div className="flex flex-wrap gap-2 w-fit md:hidden">
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
      </div>
    </div>
  );
}

interface ITableTitleModal {
  initialItems: HeadTitle<Wishes & IPreRealSeat>[];
  onChange: (items: HeadTitle<Wishes & IPreRealSeat>[]) => void;
  onClose: () => void;
}

function LiveTableTitleModal({ initialItems, onChange, onClose }: ITableTitleModal) {
  useBackSignal({
    enabled: true,
    onClose: onClose,
  });

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="테이블 설정" onClose={onClose} />
      <div className="p-4">
        <DraggableList initialItems={initialItems} onChange={onChange} />
      </div>
    </Modal>
  );
}

export default Searches;
