import { AddIcon } from '@allcll/allcll-ui';
import FloatingButton from '@/shared/ui/FloatingButton';
import ScheduleSearchBottomSheet from '@/widgets/filtering/search/ui/ScheduleSearchBottomSheet';
import FilterOverlay from '@/widgets/filtering/ui/FilterOverlay';
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

  const handleOpenSearch = () => {
    openBottomSheet('search');
  };

  const handleOpenFiltering = () => {
    openBottomSheet('filter');
  };

  const handleCloseFilter = () => {
    closeBottomSheet('filter');
    openBottomSheet('search');
  };

  return (
    <>
      <RenderIf when={bottomSheetType.search.isOpen}>
        <ScheduleSearchBottomSheet onCloseSearch={handleCloseSearch} onOpenFiltering={handleOpenFiltering} />
      </RenderIf>

      {/* 과목 검색 시트 위에 쌓이도록 검색 시트 다음에 둠 */}
      <TimetableFilter onClose={handleCloseFilter} />

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
          icon={<AddIcon className="w-6 h-6 text-primary-500" />}
          onClick={handleOpenSearch}
        />
      </RenderIf>
    </>
  );
}

function DesktopTimetableOverlay() {
  const bottomSheetType = useBottomSheetStore(state => state.type);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);

  return (
    <>
      <RenderIf when={bottomSheetType.edit.isOpen}>
        <ScheduleFormModal />
      </RenderIf>
      <RenderIf when={bottomSheetType.info.isOpen}>
        <ScheduleInfoModal />
      </RenderIf>
      <TimetableFilter onClose={() => closeBottomSheet('filter')} />
    </>
  );
}

function TimetableFilter({ onClose }: { onClose: () => void }) {
  const isOpen = useBottomSheetStore(state => state.type.filter.isOpen);

  return <FilterOverlay isOpen={isOpen} onClose={onClose} filterStore={useScheduleSearchStore} showSeatRange={false} />;
}

function RenderIf({ when, children }: { when: boolean; children: React.ReactNode }) {
  return when ? <>{children}</> : null;
}
