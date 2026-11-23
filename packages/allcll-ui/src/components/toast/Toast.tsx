import { CloseIcon, NotificationIcon } from '../../icons';

interface ToastProps {
  message: string;
  onClose: () => void;
}

function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="flex justify-between items-center gap-2 p-4 ml-2 bg-surface rounded-lg shadow-md">
      <NotificationIcon className="w-4 h-4 shrink-0 text-primary-500" />
      <span className="flex-1 text-sm font-bold break-keep text-balance whitespace-pre-line max-w-72">{message}</span>
      <button type="button" aria-label="닫기" onClick={onClose} className="p-2 rounded-full hover:bg-primary-muted">
        <CloseIcon className="w-4 h-4 text-fg-subtle" />
      </button>
    </div>
  );
}

export default Toast;
