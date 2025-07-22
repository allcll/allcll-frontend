import useBottomSheet from '@/hooks/useBottomSheet';

interface IBottomSheet {
  children: React.ReactNode;
}

export const MIN_Y = 60; //60px
export const MAX_Y = window.innerHeight - 200; //600px
export const BOTTOM_SHEET_HEIGHT = window.innerHeight - MIN_Y;

function BottomSheet({ children }: IBottomSheet) {
  const { sheet, content } = useBottomSheet();

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-1 bg-white rounded-t-2xl shadow-2xl flex flex-col`}
      ref={sheet}
      style={{ height: `${BOTTOM_SHEET_HEIGHT}px` }}
    >
      {/*Handler*/}
      <div className="w-full flex justify-center py-2">
        <div className="w-15 h-1.5 cursor-pointer bg-gray-300 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 max-h-120 min-h-50" ref={content}>
        {children}
      </div>
    </div>
  );
}

export default BottomSheet;
