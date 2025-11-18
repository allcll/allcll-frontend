import { createPortal } from 'react-dom';
import DialogTitle from './DialogTitle';
import DialogHeader from './DialogHeader';
import DialogOverlay from './DialogOverlay';
import DialogContents from './DialogContents';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import { useEffect, useId } from 'react';

interface IDialogMain {
  children: React.ReactNode;
  isOpen?: boolean;
  title?: string;
  onClose: () => void;
}

function DialogMain({ children, isOpen, title, onClose }: IDialogMain) {
  if (!isOpen) {
    return null;
  }

  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      console.log('escape');
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return createPortal(
    isOpen && (
      <dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        open
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
      </dialog>
    ),
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
