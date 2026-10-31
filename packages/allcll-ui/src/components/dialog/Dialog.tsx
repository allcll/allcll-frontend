import { createPortal } from 'react-dom';
import DialogTitle from './DialogTitle';
import DialogHeader from './DialogHeader';
import DialogOverlay from './DialogOverlay';
import DialogContents, { type DialogSize } from './DialogContents';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import { useEffect, useId, useRef } from 'react';

interface IDialogMain {
  children: React.ReactNode;
  isOpen?: boolean;
  title?: string;
  size?: DialogSize;
  onClose: () => void;
}

function DialogMain({ children, isOpen = true, title, size = 'medium', onClose }: IDialogMain) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // 브라우저가 첫 버튼(닫기)에 포커스를 줘 테두리가 생기지 않도록 상자 자체에 포커스
      dialog.focus();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 겹친 모달에서 맨 위만 닫히도록 포커스가 든 모달만 반응하고, cancel이 아래 모달로 넘어가지 않게 막음
      if (e.key === 'Escape' && dialogRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/30 outline-none"
      tabIndex={-1}
      role="dialog"
      aria-labelledby={titleId}
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <DialogOverlay onClose={onClose}>
        <DialogContents size={size}>
          <DialogHeader onClose={onClose}>
            <Dialog.Title id={titleId}>{title}</Dialog.Title>
          </DialogHeader>
          {children}
        </DialogContents>
      </DialogOverlay>
    </dialog>,
    document.body,
  );
}

export default DialogMain;

export const Dialog = Object.assign(DialogMain, {
  Title: DialogTitle,
  Header: DialogHeader,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Contents: DialogContents,
  Footer: DialogFooter,
});
