import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ScheduleFormContent from '../ScheduleFormContent';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import { ScheduleMutateType } from '@/store/useScheduleState.ts';

function FormBottomSheet() {
  const { modalActionType } = useScheduleModalData();
  const { cancelSchedule } = useScheduleModal();

  const handleCancelSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    cancelSchedule(e);
  };

  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';

  return (
    <BottomSheet>
      <BottomSheetHeader title={`커스텀 일정 ${title}`} headerType="close" onClose={handleCancelSchedule} />
      <div className="flex flex-col py-5 px-5 gap-5 overflow-y-auto max-h-[70vh]">
        <ScheduleFormContent />
      </div>
    </BottomSheet>
  );
}

export default FormBottomSheet;
