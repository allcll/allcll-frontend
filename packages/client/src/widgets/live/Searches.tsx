import { useState } from 'react';
import StarIcon from '@/shared/ui/svgs/StarIcon.tsx';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import DraggableList from '@/features/live/board/ui/DraggableList.tsx';
import { Filters, getAllSelectedLabels, initialFilters, useWishSearchStore } from '@/shared/model/useFilterStore.ts';
import { IPreRealSeat } from '@/features/live/preseat/api/usePreRealSeats.ts';
import useBackSignal from '@/shared/lib/useBackSignal.ts';
import { FilterValueType, Wishes } from '@/utils/types.ts';
import ListSvg from '@/assets/list.svg?react';
import useMobile from '@/shared/lib/useMobile.ts';
import FilteringBottomSheet from '@/widgets/bottomSheet/FilteringBottomSheet.tsx';
import GenericMultiSelectFilter from '../../features/filtering/ui/GenericMultiSelectFilter.tsx';
import GenericSingleSelectFilter from '../../features/filtering/ui/GenericSingleSelectFilter.tsx';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import FilteringButton from '@/features/filtering/ui/button/FilteringButton.tsx';
import DepartmentSelectFilter from '../../features/filtering/ui/DepartmentFilter.tsx';
import FilterDelete from '../../features/filtering/ui/FilterDelete.tsx';
import FilteringModal from '../filtering/ui/FilteringModal.tsx';
import usePreSeatGate from '@/features/live/preseat/lib/usePreSeatGate.ts';
import useWishesPreSeats from '@/entities/subjectAggregate/model/useWishesPreSeats.ts';
import { IconButton, Flex, Chip, Dialog } from '@allcll/allcll-ui';
import { useWishesTableStore } from '@/features/wish/model/useWishTableColumnStore.ts';
import { HeadTitle } from '@/shared/model/createColumnStore.ts';

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

  const { keywords, favoriteOnly } = filters;

  const tableTitles = useWishesTableStore(state => state.tableTitles);
  const setTableTitles = useWishesTableStore(state => state.setTableTitles);
  const isMobile = useMobile();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const { data: subjects } = useWishesPreSeats([]);
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);
  const allSelectedFilters = getAllSelectedLabels(filters);

  const hasPreSeats = subjects && 'seat' in subjects;
  const { isPreSeatAvailable } = usePreSeatGate({ hasSeats: hasPreSeats });
  const isWishesAvailable = subjects && 'totalCount' in subjects;

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
        placeholder="과목명, 교수명 또는 학수번호 및 분반 검색"
        value={keywords}
        onDelete={() => setFilter('keywords', '')}
        onChange={event => setFilter('keywords', event.target.value)}
        className="w-full"
      />

      <div className="flex items-center flex-wrap mt-2 gap-2">
        <div className="hidden md:flex flex-wrap gap-2">
          <DepartmentSelectFilter setFilter={setFilter} selectedValue={filters.department ?? ''} />

          {isWishesAvailable && (
            <GenericSingleSelectFilter
              filterKey="wishRange"
              options={FilterDomains.wishRange}
              selectedValue={filters.wishRange ?? null}
              setFilter={setFilter}
              ItemComponent={Chip}
              isMinMax={true}
            />
          )}

          {isPreSeatAvailable && (
            <GenericSingleSelectFilter
              filterKey="seatRange"
              options={FilterDomains.seatRange}
              selectedValue={filters.seatRange ?? null}
              setFilter={setFilter}
              ItemComponent={Chip}
              isMinMax={true}
            />
          )}

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

        <IconButton
          variant="contain"
          icon={<StarIcon disabled={!favoriteOnly} />}
          aria-label={favoriteOnly ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
          label={favoriteOnly ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
          onClick={setToggleFavorite}
        />

        <IconButton
          variant="contain"
          label="테이블 수정"
          icon={<ListSvg className="w-5 h-5" />}
          onClick={() => setIsModalOpen(true)}
        />

        <Flex direction="flex-wrap" gap="gap-2" className="w-fit md:hidden">
          {allSelectedFilters.map(filter => {
            return (
              <Chip
                key={`${filter.filterKey}-${filter.values}`}
                variant="cancel"
                label={filter.label}
                selected={true}
                onClick={() => handleDeleteFilter(filter.filterKey, filter.values)}
              />
            );
          })}
        </Flex>
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
    <Dialog title="테이블 설정" onClose={onClose} isOpen={true}>
      <div className="p-4">
        <DraggableList initialItems={initialItems} onChange={onChange} />
      </div>
    </Dialog>
  );
}

export default Searches;
