import { FilterStore } from '@/features/filtering/model/useFilterStore.ts';
import DetailFilterModal from '@/features/filtering/ui/DetailFilterModal.tsx';
import useMobile from '@/shared/lib/useMobile.ts';
import FilterBottomSheet from '@/widgets/filtering/ui/FilterBottomSheet.tsx';

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filterStore: FilterStore;
  showWishRange?: boolean;
  showSeatRange?: boolean;
}

function FilterOverlay({ isOpen, onClose, filterStore, showWishRange, showSeatRange }: Readonly<FilterOverlayProps>) {
  const isMobile = useMobile();
  const filters = filterStore(state => state.filters);
  const setFilter = filterStore(state => state.setFilter);
  const resetFilter = filterStore(state => state.resetFilters);

  if (!isMobile && !isOpen) return null;

  return isMobile ? (
    <FilterBottomSheet
      isOpen={isOpen}
      onCloseFiltering={onClose}
      filters={filters}
      setFilter={setFilter}
      resetFilter={resetFilter}
      showWishRange={showWishRange}
      showSeatRange={showSeatRange}
    />
  ) : (
    <DetailFilterModal filterStore={filterStore} onClose={onClose} />
  );
}

export default FilterOverlay;
