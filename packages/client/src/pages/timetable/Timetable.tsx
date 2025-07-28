import React, { useState } from 'react';
import Card from '@/components/common/Card.tsx';
import TimetableComponent from '@/components/timetable/Timetable.tsx';
import DropdownSelect from '@/components/timetable/DropdownSelect.tsx';
import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';
import ContentPanel from '@/components/contentPanel/ContentPanel';
import { BottomSheetType, useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useDeleteTimetable, useTimetables } from '@/hooks/server/useTimetableSchedules.ts';
import EditTimetable from '@/components/contentPanel/EditTimetable';
import AddGraySvg from '@/assets/add-gray.svg?react';
import AddWhiteSvg from '@/assets/add-white.svg?react';

import { useScheduleState } from '@/store/useScheduleState';
import ScheduleInfoModal from '@/components/contentPanel/ScheduleInfoModal';
import ScheduleInfoBottomSheet from '@/components/contentPanel/bottomSheet/ScheduleDetailBottomSheet';

type modalType = 'edit' | 'create' | null;

function Timetable() {
  const [isOpenModal, setIsOpenModal] = useState<modalType>(null);
  const bottomSheetType = useBottomSheetStore(state => state.type);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);

  const handleClickFiltering = (bottomSheetType: BottomSheetType) => {
    closeBottomSheet('search');

    openBottomSheet(bottomSheetType);
  };

  return (
    <div className="w-full p-4 ">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 w-full h-full">
          <Card className="px-2 relative overflow-hidden">
            <TimetableHeader setIsOpenModal={setIsOpenModal} />
            <TimetableComponent />
          </Card>
        </div>

        <div className="md:col-span-1 w-full">
          <div className="hidden md:block">
            <ContentPanel />
          </div>
          <div className="md:hidden">
            {bottomSheetType === 'search' && <SearchBottomSheet onCloseSearch={handleClickFiltering} />}
            {bottomSheetType === 'filter' && <FilteringBottomSheet />}
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
          className="fixed bottom-4 right-4 z-50 w-15 h-15 rounded-full bg-blue-500 flex justify-center items-center shadow-lg block md:hidden"
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

  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);

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

  const handleCreateTimetable = () => {
    setIsOpenModal('create');
  };

  return (
    <header className="flex pb-2 justify-between items-center">
      <DropdownSelect timetables={timetables} onSelect={handleSelect} onEdit={handleEdit} onDelete={handleDelete} />
      <button className="p-1 h-fit cursor-pointer" onClick={handleCreateTimetable}>
        <AddGraySvg className="w-5 h-5 cursor-pointer" />
      </button>
    </header>
  );
}

export default Timetable;
