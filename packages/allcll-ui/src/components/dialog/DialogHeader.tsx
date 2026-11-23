import { CloseIcon } from '../../icons';

interface IDialogHeader {
  children: React.ReactNode;
  onClose: () => void;
}

function DialogHeader({ children, onClose }: IDialogHeader) {
  return (
    <div className="w-full px-4 sm:px-6 py-4 border-b border-line-subtle flex flex-row justify-between">
      {children}

      <button
        type="button"
        aria-label="닫기"
        className="w-6 h-6 flex items-center justify-center bg-surface-muted rounded-full"
        onClick={onClose}
      >
        <CloseIcon className="text-fg-muted w-3 h-3" />
      </button>
    </div>
  );
}

export default DialogHeader;
