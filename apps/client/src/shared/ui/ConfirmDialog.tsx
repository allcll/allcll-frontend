import { Button, Dialog, Flex } from '@allcll/allcll-ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  danger = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} title={title} onClose={onClose}>
      <Dialog.Content>
        <p className="text-sm text-gray-600 min-w-60">{description}</p>
      </Dialog.Content>
      <Dialog.Footer>
        <Flex gap="gap-2" justify="justify-end">
          <Button variant="secondary" size="medium" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'secondary'} size="medium" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

export default ConfirmDialog;
