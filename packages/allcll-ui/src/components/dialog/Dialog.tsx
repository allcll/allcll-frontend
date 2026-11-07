import { useRef } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import DialogHeader from './DialogHeader';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import { Z_INDEX } from '../../../zIndex';

export type DialogSize = 'medium' | 'large';

const SIZE_CLASS: Record<DialogSize, string> = {
  medium: 'max-w-[90%]',
  large: 'w-[90%] max-w-3xl',
};

interface IDialogMain {
  children: React.ReactNode;
  isOpen?: boolean;
  title?: string;
  size?: DialogSize;
  onClose: () => void;
}

function DialogMain({ children, isOpen = true, title, size = 'medium', onClose }: IDialogMain) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <RadixDialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className="fixed inset-0 flex items-center justify-center bg-black/30"
          style={{ zIndex: Z_INDEX.dialog }}
        >
          <RadixDialog.Content
            ref={contentRef}
            aria-describedby={undefined}
            // 첫 버튼(닫기)에 포커스 테두리가 생기지 않도록 상자 자체에 포커스
            onOpenAutoFocus={e => {
              e.preventDefault();
              contentRef.current?.focus();
            }}
            className={`flex flex-col justify-center bg-white min-w-80 max-h-[90vh] rounded-lg outline-none ${SIZE_CLASS[size]}`}
          >
            <DialogHeader onClose={onClose}>
              <RadixDialog.Title className="font-semibold">{title}</RadixDialog.Title>
            </DialogHeader>
            {children}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export default DialogMain;

export const Dialog = Object.assign(DialogMain, {
  Header: DialogHeader,
  Content: DialogContent,
  Footer: DialogFooter,
});
