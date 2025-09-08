import React from 'react';

interface IModalActions {
  children: React.ReactNode;
}

const ModalActions = ({ children }: IModalActions) => (
  <div className="flex justify-end gap-2 px-2 pb-2 sm:px-6 sm:pb-6">{children}</div>
);

export default ModalActions;
