import React, { useEffect } from 'react';

interface IModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ children, onClose }: IModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      <div className="flex items-center justify-center fixed inset-0 w-full h-full z-40" onClick={handleBackdropClick}>
        <div className="fixed inset-0 justify-center opacity-30 bg-gray-300 border-b-2 border-gray-400" />
        <div className="flex items-center justify-center ">
          <div
            className="w-[95%] sm:w-fit z-50 bg-white max-h-[90vh] border border-gray-200 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
