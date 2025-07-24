import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ScheduleFormContent from '../ScheduleFormContent';
import useScheduleModal from '@/hooks/useScheduleModal';

function FormBottomSheet() {
  const { deleteSchedule } = useScheduleModal();

  const handleCancelSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    deleteSchedule(e);
  };

  return (
    <BottomSheet>
      <BottomSheetHeader title="과목 수정" headerType="close" onClose={handleCancelSchedule} />
      <ScheduleFormContent />
    </BottomSheet>
  );
}

export default FormBottomSheet;
