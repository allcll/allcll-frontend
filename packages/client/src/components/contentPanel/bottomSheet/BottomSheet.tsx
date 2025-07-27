import useBottomSheet from '@/hooks/useBottomSheet';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

type IBottomSheetChildren =
  | React.ReactNode
  | ((methods: { expandToMax: () => void; collapseToMin: () => void }) => React.ReactNode);

interface IBottomSheet {
  children: IBottomSheetChildren;
}

export const MIN_Y = 0;
export const MAX_Y = window.innerHeight - 200;
export const BOTTOM_SHEET_HEIGHT = window.innerHeight - MIN_Y;

function BottomSheet({ children }: IBottomSheet) {
  const { sheet, content, expandToMax, collapseToMin } = useBottomSheet();
  const { closeBottomSheet } = useBottomSheetStore();

  return (
    <div
      ref={sheet}
      className="fixed inset-x-0  bottom-0 z-100 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
      style={{
        height: `${BOTTOM_SHEET_HEIGHT}px`,
        transform: `translateY(${MIN_Y}px)`,
      }}
    >
      <div className="w-full flex justify-center py-2 h-15 shrink-0" onClick={() => closeBottomSheet('search')}>
        <div className="w-20 h-2 cursor-pointer bg-gray-300 rounded-full" />
      </div>

      <div ref={content} className="flex-1 overflow-y-auto px-4 pb-[5rem]">
        {typeof children === 'function' ? children({ expandToMax, collapseToMin }) : children}
      </div>
    </div>
  );
}

export default BottomSheet;
