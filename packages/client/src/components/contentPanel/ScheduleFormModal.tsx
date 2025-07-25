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

  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';

  return (
    <div
      className="fixed inset-0 z-50  hidden md:flex items-center justify-center  bg-black/10"
      onClick={() => closeBottomSheet('edit')}
    >
      <div
        className="bg-white flex border border-gray-200 rounded-xl flex-col gap-2 w-[90%] max-w-md p-8 shadow-xl relative"
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

        <ScheduleFormContent modalActionType={modalActionType} />
      </div>
    </div>
  );
}

export default ScheduleFormModal;
