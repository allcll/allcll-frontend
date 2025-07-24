import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import ScheduleFormContent from './ScheduleFormContent';
import XDarkGraySvg from '@/assets/x-darkgray.svg?react';
import useScheduleModal from '@/hooks/useScheduleModal';
import { ScheduleMutateType } from '@/store/useScheduleState.ts';

function ScheduleFormModal() {
  const { closeBottomSheet } = useBottomSheetStore();
  const { cancelSchedule, modalActionType } = useScheduleModal();

  const handleCancelSchedule = (e?: React.MouseEvent<HTMLButtonElement>) => {
    cancelSchedule(e);
  };

  const title = modalActionType === ScheduleMutateType.CREATE ? '수정' : '등록';

  return (
    <div
      className="fixed inset-0 z-50 hidden md:flex items-center justify-center bg-black/40"
      onClick={() => closeBottomSheet('edit')}
    >
      <div
        className="bg-white flex flex-col gap-2 rounded-md w-[90%] max-w-md p-3 shadow-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex w-full justify-between">
          <h3 className="font-semibold">과목 {title}</h3>
          <button
            className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
            onClick={handleCancelSchedule}
          >
            <XDarkGraySvg />
          </button>
        </div>

        <ScheduleFormContent />
      </div>
    </div>
  );
}

export default ScheduleFormModal;
