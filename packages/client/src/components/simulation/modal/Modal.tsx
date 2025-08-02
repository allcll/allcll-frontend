import React, { useEffect } from 'react';

interface IModalProps {
  children: React.ReactNode;
}

function Modal({ children }: IModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-300 opacity-30 z-40"></div>
      <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
        <div className="w-[95%] sm:w-fit bg-white max-h-[90vh] border border-gray-200 overflow-y-auto rounded-md">
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
