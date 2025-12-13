import { createPortal } from 'react-dom';
import DialogTitle from './DialogTitle';
import DialogHeader from './DialogHeader';
import DialogOverlay from './DialogOverlay';
import DialogContents from './DialogContents';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import { useEffect, useId, useRef } from 'react';

interface IDialogMain {
  children: React.ReactNode;
  isOpen?: boolean;
  title?: string;
  onClose: () => void;
}

function DialogMain({ children, isOpen, title, onClose }: IDialogMain) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-labelledby={titleId}
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <DialogOverlay onClose={onClose}>
        <DialogContents>
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
