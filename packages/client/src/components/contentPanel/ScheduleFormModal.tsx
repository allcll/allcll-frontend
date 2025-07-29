import { useEffect } from 'react';
import ScheduleFormContent from './ScheduleFormContent';
import XDarkGraySvg from '@/assets/x-darkgray.svg?react';
import useScheduleModal from '@/hooks/useScheduleModal';
import { ScheduleMutateType } from '@/store/useScheduleState.ts';

function ScheduleFormModal() {
  const { cancelSchedule, modalActionType } = useScheduleModal();
  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cancelSchedule(e);
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50  hidden md:flex items-center justify-center  bg-black/10"
      onClick={cancelSchedule}
    >
      <div
        className="bg-white flex border border-gray-200 rounded-xl flex-col gap-2 w-[90%] max-w-md p-8 shadow-xl relative"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex w-full justify-between">
          <h3 className="font-semibold">커스텀 일정 {title}</h3>
          <button
            className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
            onClick={cancelSchedule}
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
