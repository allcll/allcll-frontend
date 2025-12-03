import React, { useEffect, useRef } from 'react';

interface IModalProps {
  children: React.ReactNode;
  onBackdropClick?: () => void;
  preventAutoFocus?: boolean;
  noBorder?: boolean;
}

function Modal({ children, onBackdropClick, preventAutoFocus, noBorder }: Readonly<IModalProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalClassName = '' + (noBorder ? '' : 'border-3 border-black ');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (!preventAutoFocus) {
      containerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [preventAutoFocus]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onBackdropClick) {
      onBackdropClick();
    }
  };

  // Todo: aria-labelledby, aria-describedby 추가
  return (
    <div
      className="flex items-center justify-center fixed inset-0 w-full h-full z-100"
      role="none"
      ref={containerRef}
      tabIndex={-1}
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0 justify-center opacity-30 bg-gray-300 border-b-2 border-gray-400" />
      <div className="fixed inset-x-0 top-16 bottom-0 flex items-center justify-center" tabIndex={-1}>
        <div className={modalClassName}>
          <div
            className="w-[95%] sm:w-fit bg-white max-h-[90%] overflow-y-auto"
            role="dialog"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
