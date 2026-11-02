import type { ReactNode } from 'react';
import { Drawer } from 'vaul';
import { CloseIcon } from '../../icons';
import { Z_INDEX } from '../../../zIndex';

type SnapPoint = number | string;

interface BottomSheetProps {
  title?: string;
  onClose: () => void;
  headerLeft?: ReactNode;
  snapPoints?: SnapPoint[];
  activeSnapPoint?: SnapPoint | null;
  setActiveSnapPoint?: (snapPoint: SnapPoint | null) => void;
  children: ReactNode;
}

function BottomSheet({
  title,
  onClose,
  headerLeft,
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  children,
}: BottomSheetProps) {
  return (
    <Drawer.Root
      open
      onOpenChange={open => !open && onClose()}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
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
            <div className="justify-self-start">{headerLeft}</div>
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

export default BottomSheet;
