import XDarkGraySvg from '@/assets/x-darkgray.svg?react';

interface IDialogHeader {
  children: React.ReactNode;
  onClose: () => void;
}

function DialogHeader({ children, onClose }: IDialogHeader) {
  return (
    <div className="w-full px-3 py-2 flex flex-row justify-between z-60">
      {children}

      <button
        type="button"
        aria-label="닫기"
        className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
        onClick={onClose}
      >
        <XDarkGraySvg />
      </button>
    </div>
  );
}

export default DialogHeader;
