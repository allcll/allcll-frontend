interface IModalHeader {
  title: string;
  onClose: () => void;
}

function ModalHeader({ title, onClose }: Readonly<IModalHeader>) {
  return (
    <div className="flex justify-between p-4 border-b border-gray-200 ">
      <h2 className="font-semibold sm:text-lg text-sm text-gray-900">{title}</h2>

      <button className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onClose} title="창닫기">
        {/* 닫기 아이콘 (X) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export default ModalHeader;
