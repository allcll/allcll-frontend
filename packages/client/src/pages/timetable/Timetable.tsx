import { useMemo, useState } from 'react';
import TimetableComponent from '@/components/timetable/Timetable.tsx';
import DropdownSelect from '@/components/timetable/DropdownSelect.tsx';
import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';
import ContentPanel from '@/components/contentPanel/ContentPanel';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { TimetableType, useDeleteTimetable, useTimetables, useUpdateTimetable } from '@/hooks/server/useTimetableData';

function Timetable() {
  const { mutate: updateTimetable } = useUpdateTimetable();
  const { mutate: deleteTimetable } = useDeleteTimetable();
  // const { data: timetables = [], isPending } = useTimetables();

  const timetables = [
    {
      timeTableId: 1,
      timeTableName: '2025-2학기',
      semester: '2025-2', // ex: "2025-2"
    },
  ];

  const { type: bottomSheetType } = useBottomSheetStore();
  const [currentTimetable, setCurrentTimeTable] = useState<TimetableType>();

  const yearOptions = useMemo(() => {
    return timetables.map(timetable => ({
      id: timetable.timeTableId,
      label: timetable.timeTableName,
    }));
  }, [timetables]);

  // if (isPending) {
  //   return <div>로딩 중</div>;
  // }

  // if (!timetables) {
  //   return <div>데이터 불러오는 중 오류 발생</div>;
  // }

  // if (timetables.length === 0) {
  //   return <div>시간표가 없습니다. 새 시간표를 추가해주세요.</div>;
  // }

  const handleSelect = (optionId: number) => {
    const selectedTimetable = timetables.find(timetable => timetable.timeTableId === optionId);

    console.log('Selected semester:', selectedTimetable);
    //여기서 currentTimetable 저장
    setCurrentTimeTable(selectedTimetable);
  };

  const handleEdit = (value: string, optionId: number) => {
    const selectedTimetable = timetables.find(timetable => timetable.timeTableId === optionId);

    if (selectedTimetable) {
      updateTimetable({
        timeTableId: selectedTimetable.timeTableId,
        timeTableName: value,
      });
    }
  };

  const handleDelete = (optionId: number) => {
    console.log('Delete year:', optionId);

    // TODO: 삭제 로직
    deleteTimetable(optionId);
  };

  return (
    <div className="w-full p-4 ">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3 w-full h-screen">
          <DropdownSelect
            initialLabel={yearOptions[0]?.label ?? '학기 선택'}
            options={yearOptions}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <TimetableComponent />
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
    </div>
  );
}

export default Timetable;
