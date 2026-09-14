import React from 'react';
import { AddIcon, CloseIcon } from '@allcll/allcll-ui';
import { Heading } from '@allcll/allcll-ui';

interface IBottomSheetHeader {
  title?: string;
  headerType: 'close' | 'add';
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClick?: () => void;
}

function BottomSheetHeader({ title, headerType, onClose, onClick }: IBottomSheetHeader) {
  return (
    <header className="w-full px-2 flex items-center justify-between mb-2">
      {headerType === 'add' ? (
        <div className="w-full h-8 flex items-center  justify-between ">
          <HeaderTypeIcon headerType="add" onClick={onClick!} />
          {title && <Heading level={3}>{title}</Heading>}
          <HeaderTypeIcon headerType="close" onClick={onClose} />
        </div>
      ) : (
        <>
          <div className="relative w-full flex items-center justify-center h-6">
            <Heading level={3}>{title}</Heading>

            <div className="absolute right-0">
              <HeaderTypeIcon headerType="close" onClick={onClose} />
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default BottomSheetHeader;

interface IHeaderTypeIcon {
  headerType: 'close' | 'add';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function HeaderTypeIcon({ headerType, onClick }: IHeaderTypeIcon) {
  const icon =
    headerType === 'close' ? (
      <CloseIcon className="w-4 h-4 text-gray-500" />
    ) : (
      <AddIcon className="w-4 h-4 text-gray-400" />
    );

  return (
    <button
      className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
