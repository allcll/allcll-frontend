import { Button } from '@allcll/allcll-ui';
import AddSvg from '@/assets/add.svg?react';
import SearchBottomSheet from '@/widgets/filtering/search/ui/ScheduleSearchBottomSheet';
import FilterBottomSheet from '@/widgets/filtering/ui/FilterBottomSheet';
import ScheduleFormModal from '@/features/timetable/ui/ScheduleFormModal.tsx';
import ScheduleInfoModal from '@/features/timetable/ui/ScheduleInfoModal.tsx';
import { useBottomSheetStore } from '@/shared/model/useBottomSheetStore.ts';
import { useScheduleSearchStore } from '@/shared/model/useFilterStore.ts';
import useMobile from '@/shared/lib/useMobile.ts';
import FormBottomSheet from '../bottomSheet/ui/ScheduleFormBottomSheet';
import ScheduleInfoBottomSheet from '../bottomSheet/ui/ScheduleDetailBottomSheet';

function TimetableOverlay() {
  const isMobile = useMobile();
  return isMobile ? <MobileTimetableOverlay /> : <DesktopTimetableOverlay />;
}

export default TimetableOverlay;

function MobileTimetableOverlay() {
  const bottomSheetType = useBottomSheetStore(state => state.type);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);

  const handleCloseSearch = () => {
    closeBottomSheet('search');
    openBottomSheet('filter');
  };

  const handleCloseFiltering = () => {
    closeBottomSheet('filter');
  };

  const handleClickSearch = () => {
    openBottomSheet('search');
  };

  const filters = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);

  return (
    <>
      <RenderIf when={bottomSheetType.search.isOpen}>
        <SearchBottomSheet onCloseSearch={handleCloseSearch} />
      </RenderIf>

      <RenderIf when={bottomSheetType.filter.isOpen}>
        <FilterBottomSheet
          onCloseFiltering={handleCloseFiltering}
          filters={filters}
          setFilter={setFilter}
          resetFilter={resetFilter}
        />
      </RenderIf>

      <RenderIf when={bottomSheetType.edit.isOpen}>
        <FormBottomSheet />
      </RenderIf>
      <RenderIf when={bottomSheetType.info.isOpen}>
        <ScheduleInfoBottomSheet />
      </RenderIf>

      <RenderIf
        when={
          !bottomSheetType.search.isOpen &&
          !bottomSheetType.filter.isOpen &&
          !bottomSheetType.edit.isOpen &&
          !bottomSheetType.info.isOpen
        }
      >
        <div className="fixed bottom-4 right-4 z-5">
          <Button size="small" variant="circle" onClick={handleClickSearch}>
            <AddSvg className="w-6 h-6 cursor-pointer" />
          </Button>
        </div>
      </RenderIf>
    </>
  );
}

function DesktopTimetableOverlay() {
  const bottomSheetType = useBottomSheetStore(state => state.type);

  return (
    <>
      <RenderIf when={bottomSheetType.edit.isOpen}>
        <ScheduleFormModal />
      </RenderIf>
      <RenderIf when={bottomSheetType.info.isOpen}>
        <ScheduleInfoModal />
      </RenderIf>
    </>
  );
}

function RenderIf({ when, children }: { when: boolean; children: React.ReactNode }) {
  return when ? <>{children}</> : null;
}
