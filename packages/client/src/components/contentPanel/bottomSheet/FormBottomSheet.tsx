import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ScheduleFormContent from '../ScheduleFormContent';
import useScheduleModal from '@/hooks/useScheduleModal';
import { ScheduleMutateType } from '@/store/useScheduleState.ts';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

function FormBottomSheet() {
  const { cancelSchedule, modalActionType } = useScheduleModal();
  const { closeBottomSheet } = useBottomSheetStore();

  const handleCancelSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    cancelSchedule(e);
    closeBottomSheet('edit');
  };

  const title = modalActionType === ScheduleMutateType.CREATE ? '수정' : '등록';

  return (
    <BottomSheet>
      <BottomSheetHeader title={`과목 ${title}`} headerType="close" onClose={handleCancelSchedule} />
      <ScheduleFormContent />
    </BottomSheet>
  );
}

export default FormBottomSheet;
