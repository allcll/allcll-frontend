import XDarkGraySvg from '@/assets/x.svg?react';

interface IDialogHeader {
  children: React.ReactNode;
  onClose: () => void;
}

function DialogHeader({ children, onClose }: IDialogHeader) {
  return (
    <div className="w-full px-8 py-5 border-b border-gray-100 flex flex-row justify-between z-60">
      {children}

      <button
        type="button"
        aria-label="닫기"
        className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
        onClick={onClose}
      >
        <XDarkGraySvg className="text-gray-600 w-4 h-4" />
      </button>
    </div>
  );
}

export default DialogHeader;
