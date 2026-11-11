import { useState, type MouseEvent } from 'react';

function useDeleteConfirmation(onConfirm: () => void, isOpen = true) {
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  // 바텀시트는 닫혀도 마운트된 채로 남으므로, 닫힐 때 확인 상태를 비워 다음에 열 때 남지 않게 함
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setIsDeleteConfirming(false);
  }

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
