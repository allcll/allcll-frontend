import React from 'react';
import useBottomSheet from '@/shared/model/useBottomSheet.ts';
import { useBottomSheetStore } from '@/shared/model/useBottomSheetStore.ts';
import useCloseBottomSheetOnBackKey from '@/widgets/bottomSheet/useCloseBottomSheetOnBackKey.ts';
import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';

type IBottomSheetChildren =
  | React.ReactNode
  | ((methods: { expandToMax: () => void; collapseToMin: () => void }) => React.ReactNode);

interface IBottomSheet {
  children: IBottomSheetChildren;
}

export const MIN_Y = 0;
export const MAX_Y = window.innerHeight - 300;
export const BOTTOM_SHEET_HEIGHT = window.innerHeight - MIN_Y;

function BottomSheet({ children }: IBottomSheet) {
  const { sheet, content, expandToMax, collapseToMin } = useBottomSheet();
  const { type, resetBottomSheet } = useBottomSheetStore();
  const { cancelSchedule } = useScheduleModal();

  function handleCloseBottomSheet() {
    cancelSchedule();
    resetBottomSheet();
  }

  useCloseBottomSheetOnBackKey();

  return (
    <div className="fixed inset-0 z-[200]">
      {type && (
        <div
          className="absolute inset-0 bg-black/5 bg-opacity-80"
          role="presentation"
          onClick={handleCloseBottomSheet}
        />
      )}

      <div
        ref={sheet}
        className="fixed rounded-t-xl bottom-0 left-0 w-full transition-transform bg-white duration-300 z-200"
        style={{
          height: `${BOTTOM_SHEET_HEIGHT}px`,
          transform: `translateY(${MIN_Y}px)`,
        }}
      >
        <div className="w-full flex justify-center py-2 h-7 shrink-0">
          <button
            className="w-20 h-2 cursor-pointer bg-gray-300 rounded-full"
            aria-label="닫기"
            onClick={cancelSchedule}
          />
        </div>

        <div ref={content} className="flex-1 overflow-y-auto ">
          {typeof children === 'function' ? children({ expandToMax, collapseToMin }) : children}
        </div>
      </div>
    </div>
  );
}

export default BottomSheet;
