import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import TimetableComponent from '@/components/timetable/TimetableComponent.tsx';
import DropdownSelect from '@/components/timetable/DropdownSelect.tsx';
import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';
import ContentPanel from '@/components/contentPanel/ContentPanel';
import EditTimetable from '@/components/contentPanel/EditTimetable';
import ScheduleInfoModal from '@/components/contentPanel/ScheduleInfoModal';
import ScheduleInfoBottomSheet from '@/components/contentPanel/bottomSheet/ScheduleDetailBottomSheet';
import { useScheduleState } from '@/store/useScheduleState';
import { BottomSheetType, useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useDeleteTimetable, useTimetables } from '@/hooks/server/useTimetableSchedules.ts';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import { saveImageFromElement } from '@/utils/saveImage.ts';
import AddGraySvg from '@/assets/add-gray.svg?react';
import AddWhiteSvg from '@/assets/add-white.svg?react';
import SearchSvg from '@/assets/search.svg?react';
import DownloadSvg from '@/assets/download.svg?react';
import Card from '@common/components/Card';
import { useScheduleSearchStore } from '@/store/useFilterStore';

type modalType = 'edit' | 'create' | null;

function Timetable() {
  const [isOpenModal, setIsOpenModal] = useState<modalType>(null);
  const bottomSheetType = useBottomSheetStore(state => state.type);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);

  const filters = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);

  const handleClickFiltering = (bottomSheetType: BottomSheetType) => {
    closeBottomSheet('search');
    openBottomSheet(bottomSheetType);
  };

  const handleCloseFiltering = () => {
    closeBottomSheet('filter');
    openBottomSheet('search');
  };

  return (
    <div className="w-full p-4 ">
      <Helmet>
        <title>ALLCLL | 시간표</title>
      </Helmet>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="md:col-span-3 w-full h-full">
          <Card className="px-2 relative overflow-hidden">
            <TimetableHeader setIsOpenModal={setIsOpenModal} />
            <TimetableComponent />
          </Card>
        </div>

        <div className="md:col-span-2 w-full">
          <div className="hidden md:block">
            <ContentPanel />
          </div>
          <div className="md:hidden">
            {bottomSheetType === 'search' && <SearchBottomSheet onCloseSearch={handleClickFiltering} />}
            {bottomSheetType === 'filter' && (
              <FilteringBottomSheet
                onCloseFiltering={handleCloseFiltering}
                filters={filters}
                setFilter={setFilter}
                resetFilter={resetFilter}
              />
            )}
            {bottomSheetType === 'edit' && <FormBottomSheet />}
            {bottomSheetType === 'Info' && <ScheduleInfoBottomSheet />}
          </div>
        </div>

        {bottomSheetType === 'edit' && <ScheduleFormModal />}
        {bottomSheetType === 'Info' && <ScheduleInfoModal />}
      </div>

      {isOpenModal && <EditTimetable type={isOpenModal} onClose={() => setIsOpenModal(null)} />}

      {bottomSheetType === null && (
        <button
          className="fixed bottom-4 right-4 z-50 w-15 h-15 rounded-full bg-blue-500 flex justify-center items-center shadow-lg md:hidden"
          onClick={() => openBottomSheet('search')}
        >
          <AddWhiteSvg className="w-10 h-10 cursor-pointer" />
        </button>
      )}
    </div>
  );
}

interface ITimetableHeaderProps {
  setIsOpenModal: React.Dispatch<React.SetStateAction<modalType>>;
}

function TimetableHeader({ setIsOpenModal }: ITimetableHeaderProps) {
  const { mutate: deleteTimetable } = useDeleteTimetable();
  const { data: timetables = [] } = useTimetables();

  const isMobile = useScheduleState(state => state.options.isMobile);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);
  const { openScheduleModal } = useScheduleModal();

  const handleSelect = (optionId: number) => {
    const selectedTimetable = timetables.find(timetable => timetable.timeTableId === optionId);

    if (selectedTimetable) {
      setCurrentTimetable(selectedTimetable);
    }
  };

  const handleEdit = () => {
    setIsOpenModal('edit');
  };

  const handleDelete = (optionId: number) => {
    deleteTimetable(optionId);
  };

  const handleSaveImage = () => {
    const name = useScheduleState.getState()?.currentTimetable?.timeTableName;
    const containerRef = useScheduleState.getState().options.containerRef;
    saveImageFromElement(containerRef, name ? name + '.png' : '시간표.png');
  };

  const handleCreateTimetable = () => {
    setIsOpenModal('create');
  };

  const handleCreateSchedule = () => {
    openScheduleModal(new ScheduleAdapter().toUiData());
  };

  return (
    <header className="flex pb-2 justify-between items-center">
      <DropdownSelect
        timetables={timetables}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        openCreateModal={handleCreateTimetable}
      />
      <div className="flex items-center gap-1">
        <button
          className="rounded-md hover:bg-gray-100 p-1 h-fit cursor-pointer"
          onClick={handleSaveImage}
          title="시간표 이미지 저장"
        >
          <DownloadSvg className="w-5 h-5" />
        </button>
        <button
          className="rounded-md hover:bg-gray-100 p-1 h-fit cursor-pointer"
          onClick={handleCreateSchedule}
          title="커스텀 일정 생성"
        >
          <AddGraySvg className="w-5 h-5" />
        </button>
        {isMobile && (
          <button
            className="rounded-md hover:bg-gray-100 p-2 h-fit cursor-pointer"
            onClick={() => openBottomSheet('search')}
            title="과목 검색"
          >
            <SearchSvg className="w-3 h-3" />
          </button>
        )}
      </div>
    </header>
  );
}

export default Timetable;
