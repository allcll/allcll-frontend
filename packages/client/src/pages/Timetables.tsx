import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import SubjectDetailBottomSheet from '@/components/contentPanel/bottomSheet/ScheduleDetailBottomSheet';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import ContentPanel from '@/components/contentPanel/ContentPanel';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';
import { useState } from 'react';

const Timetables = () => {
  const { type } = useBottomSheetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="md:hidden">
        <SearchBottomSheet />
        {type === 'filter' && <FilteringBottomSheet />}
        {type === 'edit' && <FormBottomSheet formType="edit" />}
        {type === 'detail' && <SubjectDetailBottomSheet />}
        {/* <ScheduleDetailBottomSheet /> */}
      </div>

      {isModalOpen && <ScheduleFormModal onClose={() => setIsModalOpen(!isModalOpen)} formType="add" />}
      <div className="hidden md:block">
        <ContentPanel setIsModalOpen={setIsModalOpen} />
      </div>
    </div>
  );
};

export default Timetables;
