import SearchBottomSheet from '@/components/contentPanel/bottomSheet/SearchBottomSheet';
import FilteringBottomSheet from '@/components/contentPanel/bottomSheet/FilteringBottomSheet';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import ContentPanel from '@/components/contentPanel/ContentPanel';
import FormBottomSheet from '@/components/contentPanel/bottomSheet/FormBottomSheet';
import ScheduleFormModal from '@/components/contentPanel/ScheduleFormModal';

const Timetables = () => {
  const { type } = useBottomSheetStore();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="md:hidden">
        <SearchBottomSheet />
        {type === 'filter' && <FilteringBottomSheet />}
        {type === 'edit' && <FormBottomSheet />}
        {/*{type === 'detail' && <SubjectDetailBottomSheet />}*/}
        {/* <ScheduleDetailBottomSheet /> */}
      </div>

      <ScheduleFormModal />
      <div className="hidden md:block">
        <ContentPanel />
      </div>
    </div>
  );
};

export default Timetables;
