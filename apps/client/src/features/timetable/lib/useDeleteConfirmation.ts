import { useState, type MouseEvent } from 'react';

function useDeleteConfirmation(onConfirm: () => void) {
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  const requestDeleteConfirmation = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setIsDeleteConfirming(true);
  };

  const cancelDeleteConfirmation = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteConfirming(false);
  };

  return {
    isDeleteConfirming,
    requestDeleteConfirmation,
    cancelDeleteConfirmation,
    confirmDelete: onConfirm,
  };
}

export default useDeleteConfirmation;
