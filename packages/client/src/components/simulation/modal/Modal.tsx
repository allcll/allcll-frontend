import React, { useEffect, useRef } from 'react';

interface IModalProps {
  children: React.ReactNode;
  onClose: () => void;
  preventAutoFocus?: boolean;
}

function Modal({ children, onClose, preventAutoFocus }: Readonly<IModalProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

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
    onClose();
  };

  return (
    <div
      className="flex items-center justify-center fixed inset-0 w-full h-full z-40"
      role="none"
      ref={containerRef}
      tabIndex={-1}
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0 justify-center opacity-30 bg-gray-300 border-b-2 border-gray-400" />
      <div className="flex items-center justify-center" tabIndex={-1}>
        <div
          className="w-[95%] sm:w-fit z-50 bg-white max-h-[90vh] border border-gray-200 overflow-y-auto"
          role="dialog"
          tabIndex={-1}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
