import React, { useEffect, useRef } from 'react';

interface IModalProps {
  children: React.ReactNode;
  onBackdropClick?: () => void;
  preventAutoFocus?: boolean;
  noBorder?: boolean;
}

function Modal({ children, onBackdropClick, preventAutoFocus, noBorder }: Readonly<IModalProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalClassName = '' + (noBorder ? '' : 'border-[3px] border-slate-800 ');

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
    <div className="fixed inset-0 z-100 flex items-center justify-center" onClick={handleBackdropClick} tabIndex={-1}>
      <div className="fixed inset-x-0 top-16 bottom-0 flex items-center justify-center">
        <div
          ref={containerRef}
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          className={`
          relative
          w-[90%]
          max-h-[100vh]
          max-w-[500px]
          bg-white
          overflow-y-auto
          ${modalClassName}
        `}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
