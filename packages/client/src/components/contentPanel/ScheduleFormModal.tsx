import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import ScheduleFormContent from './ScheduleFormContent';
import XDarkGraySvg from '@/assets/x-darkgray.svg?react';

function ScheduleFormModal() {
  const { closeBottomSheet } = useBottomSheetStore();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => closeBottomSheet('edit')}
    >
      <div
        className="bg-white flex  flex-col gap-2 rounded-md w-[90%] max-w-md p-3 hadow-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex w-full justify-between">
          <h3>과목 등록</h3>
          <button
            className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
            onClick={() => closeBottomSheet('edit')}
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
