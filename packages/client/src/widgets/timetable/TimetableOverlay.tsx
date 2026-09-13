import AddSvg from '@/assets/add.svg?react';
import FloatingButton from '@/shared/ui/FloatingButton';
import ScheduleSearchBottomSheet from '@/widgets/filtering/search/ui/ScheduleSearchBottomSheet';
import FilterBottomSheet from '@/widgets/filtering/ui/FilterBottomSheet';
import ScheduleFormModal from '@/features/timetable/ui/ScheduleFormModal.tsx';
import ScheduleInfoModal from '@/features/timetable/ui/ScheduleInfoModal.tsx';
import { useBottomSheetStore } from '@/shared/model/useBottomSheetStore.ts';
import { useScheduleSearchStore } from '@/features/filtering/model/useFilterStore.ts';
import useMobile from '@/shared/lib/useMobile.ts';
import ScheduleFormBottomSheet from '../bottomSheet/ui/ScheduleFormBottomSheet';
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
  };

  const handleCloseFiltering = () => {
    closeBottomSheet('filter');
    openBottomSheet('search');
  };

  const handleOpenSearch = () => {
    openBottomSheet('search');
  };

  const handleOpenFiltering = () => {
    openBottomSheet('filter');
  };

  const filters = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);

  return (
    <>
      <RenderIf when={bottomSheetType.search.isOpen}>
        <ScheduleSearchBottomSheet onCloseSearch={handleCloseSearch} onOpenFiltering={handleOpenFiltering} />
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
        <ScheduleFormBottomSheet />
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
        <FloatingButton
          label="과목 추가"
          icon={<AddSvg className="w-6 h-6 text-primary-500" />}
          onClick={handleOpenSearch}
        />
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
