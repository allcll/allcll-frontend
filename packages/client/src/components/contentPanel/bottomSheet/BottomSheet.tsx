import useBottomSheet from '@/hooks/useBottomSheet';

interface IBottomSheet {
  children: React.ReactNode;
}

export const MIN_Y = 60;
export const MAX_Y = window.innerHeight - 200;
export const BOTTOM_SHEET_HEIGHT = window.innerHeight - MIN_Y;

function BottomSheet({ children }: IBottomSheet) {
  const { sheet, content } = useBottomSheet();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-10 bg-white rounded-t-2xl shadow-2xl flex flex-col"
      ref={sheet}
      style={{ height: `${BOTTOM_SHEET_HEIGHT}px` }}
    >
      <div className="w-full flex justify-center py-2 h-10 shrink-0">
        <div className="w-15 h-1.5 cursor-pointer bg-gray-300 rounded-full" />
      </div>

      <div ref={content} className="flex-1 overflow-y-auto px-4 pb-[5rem]">
        {children}
      </div>
    </div>
  );
}

export default BottomSheet;
