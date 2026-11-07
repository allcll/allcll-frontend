import { AddIcon } from '@allcll/allcll-ui';
import FloatingButton from '@/shared/ui/FloatingButton';
import ScheduleSearchBottomSheet from '@/widgets/filtering/search/ui/ScheduleSearchBottomSheet';
import FilterOverlay from '@/widgets/filtering/ui/FilterOverlay';
import ScheduleFormModal from '@/features/timetable/ui/ScheduleFormModal.tsx';
import ScheduleInfoModal from '@/features/timetable/ui/ScheduleInfoModal.tsx';
import { useOverlayStore } from '@/shared/model/useOverlayStore.ts';
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
  const overlays = useOverlayStore(state => state.type);
  const closeOverlay = useOverlayStore(state => state.closeOverlay);
  const openOverlay = useOverlayStore(state => state.openOverlay);

  const handleCloseSearch = () => {
    closeOverlay('search');
  };

  const handleOpenSearch = () => {
    openOverlay('search');
  };

  const handleOpenFiltering = () => {
    openOverlay('filter');
  };

  const handleCloseFilter = () => {
    closeOverlay('filter');
    openOverlay('search');
  };

  return (
    <>
      <RenderIf when={overlays.search.isOpen}>
        <ScheduleSearchBottomSheet onCloseSearch={handleCloseSearch} onOpenFiltering={handleOpenFiltering} />
      </RenderIf>

      {/* 과목 검색 시트 위에 쌓이도록 검색 시트 다음에 둠 */}
      <TimetableFilter onClose={handleCloseFilter} />

      <RenderIf when={overlays.edit.isOpen}>
        <ScheduleFormBottomSheet />
      </RenderIf>
      <RenderIf when={overlays.info.isOpen}>
        <ScheduleInfoBottomSheet />
      </RenderIf>

      <RenderIf
        when={!overlays.search.isOpen && !overlays.filter.isOpen && !overlays.edit.isOpen && !overlays.info.isOpen}
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
  const overlays = useOverlayStore(state => state.type);
  const closeOverlay = useOverlayStore(state => state.closeOverlay);

  return (
    <>
      <RenderIf when={overlays.edit.isOpen}>
        <ScheduleFormModal />
      </RenderIf>
      <RenderIf when={overlays.info.isOpen}>
        <ScheduleInfoModal />
      </RenderIf>
      <TimetableFilter onClose={() => closeOverlay('filter')} />
    </>
  );
}

function TimetableFilter({ onClose }: { onClose: () => void }) {
  const isOpen = useOverlayStore(state => state.type.filter.isOpen);

  return <FilterOverlay isOpen={isOpen} onClose={onClose} filterStore={useScheduleSearchStore} showSeatRange={false} />;
}

function RenderIf({ when, children }: { when: boolean; children: React.ReactNode }) {
  return when ? <>{children}</> : null;
}
