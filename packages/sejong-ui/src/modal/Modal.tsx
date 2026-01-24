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

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="fixed inset-x-0 top-0 bottom-0 flex items-center justify-center bg-black/5">
        <div
          ref={containerRef}
          role="dialog"
          tabIndex={-1}
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
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
