import { useEffect, useState } from 'react';
import Card from '@/components/common/Card.tsx';
import TimetableComponent from '@/components/timetable/Timetable.tsx';
import DropdownSelect from '@/components/timetable/DropdownSelect.tsx';
import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';
import ContentPanel from '@/components/contentPanel/ContentPanel';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useDeleteTimetable, useTimetables } from '@/hooks/server/useTimetableData';
import EditTimetable from '@/components/contentPanel/EditTimetable';
import AddGraySvg from '@/assets/add-gray.svg?react';
import { useScheduleState } from '@/store/useScheduleState';

type modalType = 'edit' | 'create' | null;

function Timetable() {
  const { mutate: deleteTimetable } = useDeleteTimetable();
  const { data: timetables = [] } = useTimetables();

  const [isOpenModal, setIsOpenModal] = useState<modalType>(null);
  const bottomSheetType = useBottomSheetStore(state => state.type);

  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);

  useEffect(() => {
    if (timetables.length > 0 && (!currentTimetable || currentTimetable.timeTableId <= -1)) {
      setCurrentTimetable(timetables[0]);
    }
  }, [timetables]);

  const handleSelect = (optionId: number) => {
    const selectedTimetable = timetables.find(timetable => timetable.timeTableId === optionId);

    if (selectedTimetable) setCurrentTimetable(selectedTimetable);
  };

  const handleEdit = () => {
    setIsOpenModal('edit');
  };

  const handleDelete = (optionId: number) => {
    deleteTimetable(optionId);
  };

  const handleCreateTimetable = () => {
    setIsOpenModal('create');
    //TOOD: 시간표 추가 연결
  };

  return (
    <div className="w-full p-4 ">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3 w-full h-screen">
          <Card className="px-2">
            <header className="flex pb-2 justify-between items-center">
              <DropdownSelect
                timetables={timetables}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <button className="p-1 h-fit cursor-pointer" onClick={handleCreateTimetable}>
                <AddGraySvg className="w-5 h-5 cursor-pointer" />
              </button>
            </header>

            <TimetableComponent />
          </Card>
        </div>

        <div className="md:col-span-1 w-full">
          <div className="hidden md:block">
            <ContentPanel />
          </div>
          <div className="md:hidden">
            <SearchBottomSheet />
            {bottomSheetType === 'filter' && <FilteringBottomSheet />}
            {bottomSheetType === 'edit' && <FormBottomSheet />}
          </div>
        </div>

        {bottomSheetType === 'edit' && <ScheduleFormModal />}
      </div>

      {isOpenModal && (
        <EditTimetable type={isOpenModal} timeTable={currentTimetable} onClose={() => setIsOpenModal(null)} />
      )}
    </div>
  );
}

export default Timetable;
