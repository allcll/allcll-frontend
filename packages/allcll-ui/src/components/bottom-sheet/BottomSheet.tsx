import type { ReactNode } from 'react';
import { Drawer } from 'vaul';
import { CloseIcon } from '../../icons';
import { Z_INDEX } from '../../../zIndex';

type SnapPoint = number | string;

interface BottomSheetProps {
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  snapPoints?: SnapPoint[];
  activeSnapPoint?: SnapPoint | null;
  onActiveSnapPointChange?: (snapPoint: SnapPoint | null) => void;
  children: ReactNode;
}

function BottomSheetMain({
  title,
  isOpen = true,
  onClose,
  snapPoints,
  activeSnapPoint,
  onActiveSnapPointChange,
  children,
}: BottomSheetProps) {
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={open => !open && onClose()}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={onActiveSnapPointChange}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/30" style={{ zIndex: Z_INDEX.bottomSheet }} />
        <Drawer.Content
          aria-describedby={undefined}
          className={`fixed inset-x-0 bottom-0 flex flex-col pb-[env(safe-area-inset-bottom)] rounded-t-xl bg-white outline-none ${
            snapPoints ? 'h-[95dvh]' : 'max-h-[90dvh]'
          }`}
          style={{ zIndex: Z_INDEX.bottomSheet }}
        >
          <div className="flex justify-center py-2 shrink-0">
            <div className="w-20 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <header className="grid grid-cols-[1fr_auto_1fr] items-center px-4 pb-6 shrink-0">
            <div />
            <Drawer.Title className="text-base font-semibold text-text-200">{title}</Drawer.Title>
            <button
              type="button"
              aria-label="닫기"
              className="justify-self-end w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full"
              onClick={onClose}
            >
              <CloseIcon className="text-gray-600 w-3 h-3" />
            </button>
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

interface BottomSheetFooterProps {
  /** 버튼 위에 놓을 내용 */
  above?: ReactNode;
  /** 오른쪽에 늘어놓을 버튼 */
  children: ReactNode;
}

// 시트 내용 영역의 아래 여백을 하단 고정 영역이 대신하므로, 여백만큼 내려 붙여 그 틈으로 뒤 내용이 비치지 않게 함
export function BottomSheetFooter({ above, children }: BottomSheetFooterProps) {
  return (
    <div className="sticky -bottom-4 -mx-4 -mb-4 px-4 py-3 bg-white border-t border-gray-100 flex flex-col gap-3">
      {above}
      <div className="flex justify-end items-center gap-2">{children}</div>
    </div>
  );
}

const BottomSheet = Object.assign(BottomSheetMain, { Footer: BottomSheetFooter });

export default BottomSheet;
