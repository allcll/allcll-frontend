import XDarkGraySvg from '@/assets/x-darkgray.svg?react';
import AddGraySvg from '@/assets/add-gray.svg?react';

interface IBottomSheetHeader {
  title?: string;
  headerType: 'close' | 'add';
  onClose: () => void;
  onClick?: () => void;
}

function BottomSheetHeader({ title, headerType, onClose, onClick }: IBottomSheetHeader) {
  return (
    <header className="w-full flex justify-between mb-2 ">
      {headerType === 'close' ? (
        <>
          <HeaderTypeIcon headerType={headerType} onClose={onClose} />
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          <button className="text-blue-500 cursor-pointer text-xs" onClick={onClick}>
            저장
          </button>
        </>
      ) : (
        <>
          <h3 className="text-sm">{title}</h3>
          <HeaderTypeIcon headerType={headerType} onClose={onClose} />
        </>
      )}
    </header>
  );
}

export default BottomSheetHeader;

interface IHeaderTypeIcon {
  headerType: 'close' | 'add';
  onClose: () => void;
}

function HeaderTypeIcon({ headerType, onClose }: IHeaderTypeIcon) {
  return (
    <div className="w-5 h-5 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full" onClick={onClose}>
      {/**TODO: XDarkGraySvg Add로 변경 */}
      {headerType === 'close' ? <XDarkGraySvg /> : <AddGraySvg />}
    </div>
  );
}
