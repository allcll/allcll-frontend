import { createPortal } from 'react-dom';
import DialogTitle from './DialogTitle';
import DialogHeader from './DialogHeader';
import DialogOverlay from './DialogOverlay';
import DialogContents from './DialogContents';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';

interface IDialogRoot {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose: () => void;
}

function DialogRoot({ children, isOpen, onClose }: IDialogRoot) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div>
      <div>{getDialogOverlay(children, onClose)}</div>
    </div>,
    document.body,
  );
}

export default DialogRoot;

export const Dialog = Object.assign(DialogRoot, {
  Title: DialogTitle,
  Header: DialogHeader,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Contents: DialogContents,
  Footer: DialogFooter,
});

function getDialogOverlay(children: React.ReactNode, onClose: () => void) {
  return <DialogOverlay onClose={onClose}>{children}</DialogOverlay>;
}
