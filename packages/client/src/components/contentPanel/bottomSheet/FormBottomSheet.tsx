import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ScheduleFormContent from '../ScheduleFormContent';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

function FormBottomSheet() {
  const { closeBottomSheet } = useBottomSheetStore();

  return (
    <BottomSheet>
      <BottomSheetHeader title="과목 수정" headerType="close" onClose={() => closeBottomSheet('edit')} />
      <ScheduleFormContent />
    </BottomSheet>
  );
}

export default FormBottomSheet;
