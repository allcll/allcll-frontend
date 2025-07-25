import XDarkGraySvg from '@/assets/x-darkgray.svg?react';
import AddGraySvg from '@/assets/add-gray.svg?react';

interface IBottomSheetHeader {
  title?: string;
  headerType: 'close' | 'add';
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClick?: () => void;
}

function BottomSheetHeader({ title, headerType, onClose, onClick }: IBottomSheetHeader) {
  return (
    <header className="w-full flex justify-between mb-2 ">
      {headerType === 'close' ? (
        <div className="relative w-full h-6 flex items-center">
          <div className="absolute left-0">
            <HeaderTypeIcon headerType={headerType} onClose={onClose} />
          </div>

          {title && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h3 className="text-sm font-semibold">{title}</h3>
            </div>
          )}
        </div>
      ) : (
        <>
          <h3 className="text-sm font-semibold">{title}</h3>
          <div onClick={onClick}>
            <HeaderTypeIcon headerType={headerType} onClose={onClose} />
          </div>
        </>
      )}
    </header>
  );
}

export default BottomSheetHeader;

interface IHeaderTypeIcon {
  headerType: 'close' | 'add';
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function HeaderTypeIcon({ headerType, onClose }: IHeaderTypeIcon) {
  return (
    <button
      className="w-5 h-5 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
      onClick={onClose}
    >
      {/**TODO: XDarkGraySvg Add로 변경 */}
      {headerType === 'close' ? <XDarkGraySvg /> : <AddGraySvg />}
    </button>
  );
}
