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

  const title = modalActionType === ScheduleMutateType.CREATE ? '등록' : '수정';

  return (
    <BottomSheet>
      <BottomSheetHeader title={`과목 ${title}`} headerType="close" onClose={handleCancelSchedule} />
      <div className="flex flex-col py-5 px-5 gap-5 overflow-y-auto max-h-[70vh]">
        <ScheduleFormContent />
      </div>
    </BottomSheet>
  );
}

export default FormBottomSheet;
