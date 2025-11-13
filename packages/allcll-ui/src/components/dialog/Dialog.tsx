import { createPortal } from 'react-dom';
import DialogTitle from './DialogTitle';
import DialogHeader from './DialogHeader';
import DialogOverlay from './DialogOverlay';
import DialogContents from './DialogContents';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import { useCallback, useEffect, useId } from 'react';

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

  const handleEscKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKeyPress);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscKeyPress);
    };
  }, [isOpen, handleEscKeyPress]);

  return createPortal(
    isOpen && (
      <dialog role="dialog" aria-modal="true" aria-labelledby={titleId} open>
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
