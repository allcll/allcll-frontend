import React from 'react';

interface IModalProps {
  children: React.ReactNode;
}

function Modal({ children }: IModalProps) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-300 opacity-30 z-40"></div>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">{children}</div>
    </>
  );
}

export default Modal;
