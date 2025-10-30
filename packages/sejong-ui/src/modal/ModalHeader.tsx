import XSvg from '../assets/x.svg?react';

interface IModalHeader {
  title: string;
  onClose: () => void;
}

function ModalHeader({ title, onClose }: Readonly<IModalHeader>) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 ">
      <h2 className="font-semibold sm:text-lg text-sm text-gray-900">{title}</h2>

      <button
        className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
        onClick={onClose}
        title="창닫기"
        tabIndex={-1}
      >
        <XSvg className="w-full h-full" />
      </button>
    </div>
  );
}

export default ModalHeader;
