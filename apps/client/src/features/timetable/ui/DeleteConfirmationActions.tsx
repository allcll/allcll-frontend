import type { MouseEventHandler } from 'react';
import { Button } from '@allcll/allcll-ui';

interface DeleteConfirmationActionsProps {
  message: string;
  size: 'small' | 'medium';
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onConfirm: () => void;
}

function DeleteConfirmationActions({ message, size, onCancel, onConfirm }: DeleteConfirmationActionsProps) {
  return (
    <>
      <span className="self-center text-sm text-gray-600">{message}</span>
      <Button type="button" variant="secondary" size={size} onClick={onCancel}>
        취소
      </Button>
      <Button type="button" variant="danger" size={size} onClick={onConfirm}>
        삭제
      </Button>
    </>
  );
}

export default DeleteConfirmationActions;
