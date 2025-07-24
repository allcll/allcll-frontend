import TimetableComponent from '@/components/timetable/Timetable.tsx';
import DropdownSelect from '@/components/timetable/DropdownSelect.tsx';
import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';
import ContentPanel from '@/components/contentPanel/ContentPanel';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

function Timetable() {
  const yearsOptions = [
    { id: '2025-2', label: '2025학년 2학기' },
    { id: '2025-1', label: '2025학년 1학기' },
    { id: '2024-2', label: '2024학년 2학기' },
    { id: '2024-1', label: '2024학년 1학기' },
  ];
  const handleSelect = (value: string) => {
    console.log('Selected year:', value);
    // Handle year selection logic here
  };
  const handleEdit = (value: string) => {
    console.log('Edit year:', value);
    // Handle year edit logic here
  };
  const handleDelete = (value: string) => {
    console.log('Delete year:', value);
    // Handle year deletion logic here
  };

  const { type: bottomSheetType } = useBottomSheetStore();

  return (
    <div className="w-full p-4 ">
      <div className=" grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3 w-ful h-screen">
          <DropdownSelect
            initialLabel="2025학년 2학기"
            options={yearsOptions}
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
            {/* {type === 'detail' && <SubjectDetailBottomSheet />} */}
          </div>
        </div>
        {bottomSheetType === 'edit' && <ScheduleFormModal />}
      </div>
    </div>
  );
}

export default Timetable;
